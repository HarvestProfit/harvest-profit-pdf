import logoPath from './logo';

/**
 * Generates a HarvestProfit themed PDF footer.
 */
class HarvestProfitPDFFooter {
  constructor(options) {
    if (options.includePagination !== undefined &&
        options.includePagination !== null &&
        options.includePagination === false) {
      this.includePagination = false;
    } else {
      this.includePagination = true;
      this.currentPage = 1;
    }

    this.message = options.message;
  }

  addLogo() {
    const doc = this.pdfBuilder.doc;
    const margins = this.pdfBuilder.margins;

    // Add Logo Mark
    doc.save();
    doc.translate(margins.left - 15, (this.height + margins.bottom) - 15);
    doc.scale(0.20);
    doc.path(logoPath);
    doc.fillAndStroke();
    doc.restore();

    // Add Logo Text
    doc.font('Helvetica-Bold');
    doc.fontSize(16);
    doc.text('HARVEST', margins.left + 18, (this.height + margins.bottom) - 3, {
      lineBreak: false,
    }).font('Helvetica').text('profit');
  }

  addPagination() {
    const doc = this.pdfBuilder.doc;
    const margins = this.pdfBuilder.margins;
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

  addCenterMessage() {
    if (this.message) {
      const doc = this.pdfBuilder.doc;
      const margins = this.pdfBuilder.margins;
      doc.fontSize(7);
      doc.text(this.message, margins.left, this.height + margins.bottom, {
        align: 'center',
        width: this.width,
      });
    }
  }

  onPageAdded(pdfBuilder) {
    this.width = pdfBuilder.doc.page.width - pdfBuilder.margins.left - pdfBuilder.margins.right;
    this.height = pdfBuilder.doc.page.height - pdfBuilder.margins.top - pdfBuilder.margins.bottom;
    this.currentPage = pdfBuilder.currentPage;
    this.docTitle = pdfBuilder.title;
    this.pdfBuilder = pdfBuilder;
    this.addLogo();
    if (this.includePagination) {
      this.addPagination();
    }
    this.addCenterMessage();
  }
}

export default HarvestProfitPDFFooter;
