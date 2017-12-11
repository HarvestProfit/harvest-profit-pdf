import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';

/*
eslint no-underscore-dangle: ["error", {
  "allow": [
  "_setupHeader",
  "_setupFooter"]
}]
*/

/**
 * Builds the PDF
 */
class PDFBuilder {
  /**
   * @param {Object} options The options used to build the PDF
   * @param {string} options.title The title of the document
   * @param {boolean} options.includePageNumber=true Document includes page numbers
   * @param {string} options.documentFont=Helvetica The default font style for document
   * @param {string} options.documentBoldFont=Helvetica-Bold The default bold font style for document
   * @param {string} options.headingFont=options.documentBoldFont The font style of the page heading
   * @param {number} options.headingFontSize=16 The heading font size
   * @param {number} options.headingLineGap=18 The heading line gap
   * @param {string} options.subHeadingFont=options.documentBoldFont The font style of the subheading
   * @param {number} options.subHeadingFontSize=14 The subheading font size
   * @param {number} options.subHeadingLineGap=12 The subheading line gap
   * @param {( portrait | landscape )} options.layout=portrait The page layout style
   * @param {Margin} options.margin Margin of the page
   * @param {( letter )} options.size The size of the generated PDF
   * @param {metadata} options.metadata Additional data stored on the object.
   */
  constructor(options = {}) {
    this.title = options.title || '';
    this.metadata = options.metadata || {};

    this.doc = new PDFDocument({
      autoFirstPage: false,
      bufferPages: true,
    });

    let documentTitle = this.title;
    if (this.metadata.year) {
      documentTitle = `${this.metadata.year} ${documentTitle}`;
    }

    if (!this.metadata.filename) {
      this.metadata.filename = `${documentTitle}.pdf`;
    }

    this.doc.info.Title = documentTitle;
    this.doc.info.Producer = 'Harvest Profit';
    this.doc.info.Creator = 'Harvest Profit';

    this.stream = this.doc.pipe(blobStream());

    this.header = options.header;
    this.footer = options.footer;
    this.documentFont = options.documentFont || 'Helvetica-Bold';
    this.documentBoldFont = options.documentBoldFont || 'Helvetica-Bold';
    this.includePageNumber = (typeof options.includePageNumber === 'undefined') ? true : options.includePageNumber;
    this.headingFont = options.headingFont || this.documentBoldFont;
    this.headingFontSize = options.headingFontSize || 16;
    this.headingFontColor = options.headingFontColor || '#000000';
    this.headingLineGap = options.headingLineGap || 18;
    this.subHeadingFont = options.subHeadingFont || this.documentBoldFont;
    this.subHeadingFontSize = options.subHeadingFontSize || 14;
    this.subHeadingFontColor = options.subHeadingFontColor || '#000000';
    this.subHeadingLineGap = options.subHeadingLineGap || 12;
    this.layout = options.layout || 'portrait';
    const defaultMargins = {
      bottom: 30,
      left: 30,
      right: 30,
      top: 30,
    };
    this.margins = options.margins || defaultMargins;
    this.size = options.size || 'letter';

    if (this.header != null) {
      this._setupHeader();
    }

    this.currentPage = 0;
    if (this.footer != null) {
      this._setupFooter();
    }

    this.addPage();
  }

  /**
  * Add a new page to the PDF document.
  */
  addPage() {
    this.doc.addPage({
      layout: this.layout,
      margins: this.margins,
    });
    this.resetPosition();
  }

  /**
  * Adds a new page to the PDF document if close to the end of the content area.
  * @param {number} currentPage The current page of the document
  * @param {number} pageCount The number of pages
  * @return {boolean} Was a new page added
  */
  addPageIfNeeded(currentPage, pageCount) {
    if (this.doc.y / this.contentHeight() > 0.95) {
      // Don't add a new page if we can just switch to the next page that's already been created
      if (currentPage == null || pageCount == null || currentPage === pageCount - 1) {
        this.addPage();
      } else {
        this.doc.switchToPage(currentPage + 1);
        this.resetPosition();
      }

      return true;
    }

    return false;
  }

  /**
  * Add a heading to the PDF document.
  * @param {string} text The heading to add
  */
  addHeading(text) {
    this.addPageIfNeeded();

    const { doc } = this;
    const lineGap = this.headingLineGap;
    const x = this.pageLeft();
    const { y } = doc;

    doc.font(this.headingFont);
    doc.fontSize(this.headingFontSize);
    doc.fillColor(this.headingFontColor);
    doc.text(text.toUpperCase(), x, y, { lineGap });
  }

  /**
  * Add a sub heading to the PDF document.
  * @param {String} text The subheading text to add
  */
  addSubHeading(text) {
    this.addPageIfNeeded();

    const { doc } = this;
    const lineGap = this.subHeadingLineGap;
    const x = this.pageLeft();
    const { y } = doc;

    doc.font(this.subHeadingFont);
    doc.fontSize(this.subHeadingFontSize);
    doc.fillColor(this.subHeadingFontColor);
    doc.text(text.toUpperCase(), x, y, { lineGap });
  }

  /**
  * Add a table to the PDF document.
  * @param {PDFTable} table The table to add to the PDF
  */
  addTable(table) {
    this.addPageIfNeeded();
    table.addToPDF(this);
  }

  /**
  * Returns the height of the page inside the page margins.
  * @return {number}
  */
  contentHeight() {
    const topMargin = this.header == null ? this.margins.top : this.header.height;
    return this.doc.page.height - topMargin - this.margins.bottom;
  }

  /**
  * Returns the width of the page inside the page margins.
  * @return {number} The width of the page inside the page margins
  */
  contentWidth() {
    return this.doc.page.width - this.margins.left - this.margins.right;
  }

  /**
  * Closes the document and generates blob URL that can be saved to disk.
  * @example
  * let pdfBuilder = new PDFBuilder();
  * let saveAs = require('file-saver');
  * pdfBuilder.generateBlob().then(function(blob) {
  *   saveAs(blob, 'document.pdf');
  * });
  * @return {Promise} Resolves when the PDF has been generated
  */
  generateBlob() {
    const { doc, stream } = this;

    return new Promise((resolve) => {
      doc.flushPages();
      doc.end();

      stream.on('finish', () => {
        const blob = stream.toBlob('application/pdf');
        resolve(blob);
      });
    });
  }

  /**
  * Closes the document and generates blob URL that can be loaded by a web browser.
  * @example
  * let pdfBuilder = new PDFBuilder();
  * pdfBuilder.generateBlobURL().then(function(url) {
  *   $('iframe')[0].src = url;
  * });
  * @return {Promise} Resolves when the PDF Url has been generated
  */
  generateBlobURL() {
    const { doc, stream } = this;

    return new Promise((resolve) => {
      doc.flushPages();
      doc.end();

      stream.on('finish', () => {
        const url = stream.toBlobURL('application/pdf');
        resolve(url);
      });
    });
  }

  /**
  * Returns the position of the left edge of the page based on left margin.
  * @return {number} The position of the left edge of the page
  */
  pageLeft() {
    return this.margins.left;
  }

  /**
  * Returns the position of the right edge of the page based on the width and right margin.
  * @return {number} The position of the right edge of the page
  */
  pageRight() {
    return this.doc.page.width - this.margins.right;
  }

  /**
  * Sets the current print position to the top-left of the document + margins.
  */
  resetPosition() {
    this.doc.x = this.margins.left;
    this.doc.y = this.header == null ? this.margins.top : this.header.height;
  }

  _setupHeader() {
    const builder = this;
    const { header } = this;

    this.doc.on('pageAdded', () => {
      header.onPageAdded(builder);
    });
  }

  _setupFooter() {
    const builder = this;
    const { footer } = this;

    this.doc.on('pageAdded', () => {
      builder.currentPage += 1;
      footer.onPageAdded(builder);
    });
  }
}

export default PDFBuilder;
