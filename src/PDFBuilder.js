import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';

/*
eslint no-underscore-dangle: ["error", {
  "allow": [
  "_setupHeader",
  "_setupFooter"]
}]
*/

export default class PDFBuilder {
  constructor(options = {}) {
    this.title = options.title || '';

    this.doc = new PDFDocument({
      autoFirstPage: false,
      bufferPages: true,
    });

    this.doc.info.Title = this.title;
    this.doc.info.Producer = 'Harvest Profit';
    this.doc.info.Creator = 'Harvest Profit';

    this.stream = this.doc.pipe(blobStream());

    this.header = options.header;
    this.footer = options.footer;
    this.title = options.title || '';
    this.includePageNumber = options.includePageNumber || true;
    this.headingFont = options.headingFont || 'Helvetica-Bold';
    this.headingFontSize = options.headingFontSize || 16;
    this.headingFontColor = options.headingFontColor || '#000000';
    this.headingLineGap = options.headingLineGap || 18;
    this.subHeadingFont = options.subHeadingFont || 'Helvetica-Bold';
    this.subHeadingFontSize = options.subHeadingFontSize || 14;
    this.subHeadingFontColor = options.subHeadingFontColor || '#000000';
    this.subHeadingLineGap = options.subHeadingLineGap || 12;
    this.layout = options.layout || 'portrait';
    this.margins = options.margins || { bottom: 30, left: 30, right: 30, top: 30 };
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
    Add a new page to the PDF document.
    @method addPage
  */
  addPage() {
    this.doc.addPage({
      layout: this.layout,
      margins: this.margins,
    });
    this.resetPosition();
  }

  /**
    Adds a new page to the PDF document if close to the end of the content area.
    @method addPageIfNeeded
    @param {Number} currentPage
    @param {Number} pageCount
    @return {Boolean}
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
    Add a heading to the PDF document.
    @method addHeading
    @param {String} text
  */
  addHeading(text) {
    this.addPageIfNeeded();

    const doc = this.doc;
    const lineGap = this.headingLineGap;
    const x = this.pageLeft();
    const y = doc.y;

    doc.font(this.headingFont);
    doc.fontSize(this.headingFontSize);
    doc.fillColor(this.headingFontColor);
    doc.text(text.toUpperCase(), x, y, { lineGap });
  }

  /**
    Add a sub heading to the PDF document.
    @method addHeading
    @param {String} text
  */
  addSubHeading(text) {
    this.addPageIfNeeded();

    const doc = this.doc;
    const lineGap = this.subHeadingLineGap;
    const x = this.pageLeft();
    const y = doc.y;

    doc.font(this.subHeadingFont);
    doc.fontSize(this.subHeadingFontSize);
    doc.fillColor(this.subHeadingFontColor);
    doc.text(text.toUpperCase(), x, y, { lineGap });
  }

  /**
    Add a table to the PDF document.
    @method addTable
    @param {PDFTable} table
  */
  addTable(table) {
    this.addPageIfNeeded();
    table.addToPDF(this);
  }

  /**
    Returns the height of the page inside the page margins.
    @method contentHeight
    @return {Number}
  */
  contentHeight() {
    const topMargin = this.header == null ? this.margins.top : this.header.height;
    return this.doc.page.height - topMargin - this.margins.bottom;
  }

  /**
    Returns the width of the page inside the page margins.
    @method contentWidth
    @return {Number}
  */
  contentWidth() {
    return this.doc.page.width - this.margins.left - this.margins.right;
  }

  /**
    Closes the document and generates blob URL that can be saved to disk.
    Usage:
    ```javascript
    let pdfBuilder = new PDFBuilder();
    let saveAs = require('file-saver');
    pdfBuilder.generateBlob().then(function(blob) {
      saveAs(blob, 'document.pdf');
    });
    ```
    @method generateBlob
    @return {Promise}
  */
  generateBlob() {
    const doc = this.doc;
    const stream = this.stream;

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
    Closes the document and generates blob URL that can be loaded by a web browser.
    Usage:
     ```javascript
    let pdfBuilder = new PDFBuilder();
     pdfBuilder.generateBlobURL().then(function(url) {
      $('iframe')[0].src = url;
    });
    ```
    @method generateBlobURL
    @return {Promise}
  */
  generateBlobURL() {
    const doc = this.doc;
    const stream = this.stream;

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
    Returns the position of the left edge of the page based on left margin.
    @method pageLeft
    @return {Number}
  */
  pageLeft() {
    return this.margins.left;
  }

  /**
    Returns the position of the right edge of the page based on the width and right margin.
    @method pageRight
    @return {Number}
  */
  pageRight() {
    return this.doc.page.width - this.margins.right;
  }

  /**
    Sets the current print position to the top-left of the document + margins.
    @method resetPosition
  */
  resetPosition() {
    this.doc.x = this.margins.left;
    this.doc.y = this.header == null ? this.margins.top : this.header.height;
  }

  _setupHeader() {
    const builder = this;
    const header = this.header;

    this.doc.on('pageAdded', () => {
      header.onPageAdded(builder);
    });
  }

  _setupFooter() {
    const builder = this;
    const footer = this.footer;

    this.doc.on('pageAdded', () => {
      builder.currentPage += 1;
      footer.onPageAdded(builder);
    });
  }
}
