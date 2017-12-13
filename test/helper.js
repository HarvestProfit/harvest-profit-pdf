import _ from 'lodash';
import Parser from 'pdf3json';
import toBuffer from 'blob-to-buffer';

import { BasicPDFHeader, HarvestProfitPDFFooter } from '../dist';

/**
 * Default PDF Configuration to test
 */
export const defaultPDFConfig = {
  header: new BasicPDFHeader(),
  footer: new HarvestProfitPDFFooter({}),
  margins: {
    bottom: -30,
    left: 30,
    right: 30,
    top: 30,
  },
  includePageNumber: true,
  subHeadingFontColor: '#555555',
  subHeadingFontSize: 10,
  title: 'Inputs Usage',
  metadata: {
    year: 2017,
    tags: [{
      label: 'Crops',
      value: 'Corn, Barley',
    },
    {
      label: 'Fields',
      value: 'All Fields',
    },
    {
      label: 'Entities',
      value: 'All Entities',
    }],
  },
};

/**
 * Peices of the PDF to test.
 */
export const chunks = [
  'Crops: ',
  'Corn, Barley',
  'Fields: ',
  'All Fields',
  'Entities: ',
  'All Entities',
  '2017',
  'HARVEST',
  'profit',
  'Inputs Usage - 1',
  'FERTILIZER',
  'Name', // Table starts at: 11
  'DDT',
  'K12',
  'Usage',
  '0.540 tons',
  '12.400 tons',
  'Total Cost',
  '$5.46',
  '$5.32',
];

export default class PDFTestHelper {
  /**
   * Renders a PDF from a builder object and returns a list of pages containing
   * a list of text on the page.
   * @param {PDFBuilder} builder The builder object to render
   * @param {function(pages)} cb The callback function to call when the pdf is rendered and parsed
   */
  static parsePDF = (builder, cb) => {
    const parser = new Parser();
    parser.on('pdfParser_dataReady', (result) => {
      const pages = [];

      // get text on a particular page
      result.data.Pages.forEach((page) => {
        const chunks = _(page.Texts)
          .map('R')
          .flatten()
          .map('T')
          .map(decodeURIComponent)
          .value();
        pages.push(chunks);
      });

      parser.destroy();

      setImmediate(() => {
        cb(pages);
      });
    });

    parser.on('pdfParser_dataError', (err) => {
      parser.destroy();
      throw err;
    });
    builder.generateBlob().then((blob) => {
      toBuffer(blob, (err, buffer) => {
        parser.parseBuffer(buffer);
      });
    });
  };

  /**
   * Parses a PDF table and returns a map with the keys as column names and the
   * values a list of the items in the column. Works page by page, so a table that
   * spans multiple pages will need to be extracted separately.
   * @param {Array} chunks The text chunks extracted from the PDF.
   * @param {number} idx The index of the chunk the table starts at.
   * @param {number} columnCount The amount of columns in the table.
   * @param {number} rowCount The amount of row in the table ON THAT PAGE.
   * @return {{table: {string: Array}, index: number}} An object containing the table data and the next chunk index.
   */
  static parsePDFTable = (chunks, idx, columnCount, rowCount) => {
    const data = {};
    let chunk;
    let chunkIdx;
    let currentRow;
    let index = idx;
    for (let i = 0; i <= ((columnCount + 1) * rowCount); i += 1) {
      chunkIdx = i + idx;
      chunk = chunks[chunkIdx];
      if (!chunk) break;
      if (i % columnCount === 0) {
        currentRow = chunk;
        data[currentRow] = [];
      } else {
        data[currentRow].push(chunk);
      }
      index = chunkIdx;
    }

    return {
      table: data,
      index,
    };
  };

  /**
   * Parses a BasicPDFHeader from the provided chunks.
   * @param {Array} chunks The text chunks extracted from the PDF.
   * @param {number} tagCount The amount of tags/filters in the header.
   * @param {number} idx=0 The index of the chunk the header starts at.
   * @return {{tags: {string: string}, year: string, index: number}} An object containing the tags, year, and next chunk index.
   */
  static parseBasicPDFHeader = (chunks, tagCount, idx = 0) => {
    const tags = {};
    let year;
    const headerAdditionalCount = 3;
    const tagLength = tagCount * 2;
    let currentTag;
    let index = 0;
    for (let i = idx; i <= (tagLength + headerAdditionalCount); i += 1) {
      if (i < tagLength) {
        if (i % 2) {
          tags[currentTag] = chunks[i];
        } else {
          currentTag = chunks[i].replace(/:\s$/, '');
          tags[currentTag] = '';
        }
      } else if (i === tagLength) {
        year = chunks[i];
      }
      index = i;
    }

    return {
      tags,
      year,
      index,
    };
  };

  /**
   * Parses a HarvestProfitPDFFooter from the provided chunks.
   * @param {Array} chunks The text chunks extracted from the PDF.
   * @param {number} idx The index of the chunk the footer starts at.
   * @param {boolean} hasMessage=false If the footer has a center message.
   * @return {{titleAndPage: string, message: string, index: number}} An object containing the title and page number, center message, and next chunk index.
   */
  static parseHarvestProfitPDFFooter = (chunks, idx, hasMessage = false) => {
    let message = '';
    let index = idx;
    if (hasMessage) {
      message = chunks[index];
      index += 1;
    }

    const titleAndPage = chunks[index];
    return {
      titleAndPage,
      message,
      index: index + 1,
    };
  };

  /**
   * Parses a HarvestProfitPDFFooter from the provided chunks.
   * @param {Array} chunks The text chunks extracted from the PDF.
   * @param {number} idx The index of the chunk the heading starts at.
   * @return {{heading: string, index: number}} An object containing the heading and next chunk index.
   */
  static parseHeading = (chunks, idx) => ({
    heading: chunks[idx],
    index: idx + 1,
  });
}
