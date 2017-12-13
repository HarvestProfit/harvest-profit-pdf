import { PDFBuilder } from '../src';
import PDFTestHelper, { chunks, defaultPDFConfig } from './helper';

describe('PDFBuilder', () => {
  it('should parse the pdf into a list of page chunks', async () => {
    const builder = new PDFBuilder(defaultPDFConfig);
    builder.addHeading('Random header');

    await PDFTestHelper.parsePDF(builder, (pages) => {
      expect(Array.isArray(pages)).toEqual(true);
    });
  });

  it('should parse the pdf into chunks for one page', async () => {
    const builder = new PDFBuilder(defaultPDFConfig);
    builder.addHeading('Random header');

    await PDFTestHelper.parsePDF(builder, (pages) => {
      expect(pages.length).toEqual(1);
      expect(Array.isArray(pages[0])).toEqual(true);
    });
  });

  it('should parse the pdf into chunks for multiple pages', async () => {
    const builder = new PDFBuilder(defaultPDFConfig);
    for (let i = 0; i < 100; i += 1) {
      builder.addHeading(`Random header ${i}`);
    }

    await PDFTestHelper.parsePDF(builder, (pages) => {
      expect(pages.length).toBeGreaterThan(1);
    });
  });

  describe('Heading', () => {
    it('should parse the footer title and page from the chunks', () => {
      const pdfHeading = PDFTestHelper.parseHeading(chunks, 10);
      expect(pdfHeading.heading).toEqual('FERTILIZER');
    });

    it('should return the correct last index', () => {
      const pdfHeading = PDFTestHelper.parseHeading(chunks, 10);
      expect(pdfHeading.index).toEqual(11);
    });
  });
});
