import logoPath from './logo';

/**
 * Generates a HarvestProfit themed PDF footer.
 */
class HarvestProfitPDFFooter {
  /**
   * @param {Object} options The options used to build the PDF Footer
   * @param {string} options.message The message to be inserted into the center of the footer
   */
  constructor(options) {
    this.message = options.message;
  }

  /**
   * Adds the Harvest Profit Logo to the footer.
   */
  addLogo() {
    const {
      doc,
      margins,
      documentFont,
      documentBoldFont,
    } = this.pdfBuilder;

    // Add Logo Mark
    doc.save();
    doc.translate(margins.left - 15, (this.height + margins.bottom) - 15);
    doc.scale(0.20);
    doc.path(logoPath);
    doc.fillAndStroke();
    doc.restore();

    // Add Logo Text
    doc.font(documentBoldFont);
    doc.fontSize(16);
    doc.text('HARVEST', margins.left + 18, (this.height + margins.bottom) - 3, {
      lineBreak: false,
    }).font(documentFont).text('profit');
  }

  /**
   * Adds the page number to the footer if enabled.
   */
  addPagination() {
    if (this.pdfBuilder.includePageNumber) {
      const { doc, margins } = this.pdfBuilder;
      let text = this.currentPage;
      doc.fontSize(9);

      if (this.docTitle.length > 0) {
        text = `${this.docTitle} - ${text}`;
      }
      doc.text(text, margins.left, this.height + margins.bottom, {
        align: 'right',
        width: this.width,
      });
    }
  }

  /**
   * Adds a small message in the center of the footer.
   */
  addCenterMessage() {
    if (this.message) {
      const { doc, margins } = this.pdfBuilder;
      doc.fontSize(7);
      doc.text(this.message, margins.left, this.height + margins.bottom, {
        align: 'center',
        width: this.width,
      });
    }
  }

  /**
   * Hook called by a PDFBuilder object when a new page is added.
   * @param {PDFBuilder} pdfBuilder The pdf builder object to add to.
   */
  onPageAdded(pdfBuilder) {
    this.width = pdfBuilder.doc.page.width - pdfBuilder.margins.left - pdfBuilder.margins.right;
    this.height = pdfBuilder.doc.page.height - pdfBuilder.margins.top - pdfBuilder.margins.bottom;
    this.currentPage = pdfBuilder.currentPage;
    this.docTitle = pdfBuilder.title;
    this.pdfBuilder = pdfBuilder;
    this.addLogo();
    this.addPagination();
    this.addCenterMessage();
  }
}

export default HarvestProfitPDFFooter;
