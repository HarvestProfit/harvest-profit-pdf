import logoPath from './logo';

/**
 * Generates a HarvestProfit themed PDF header.
 */
class HarvestProfitPDFHeader {
  constructor(year) {
    this.year = year;
  }

  addLogo() {
    const doc = this.pdfBuilder.doc;
    const margins = this.pdfBuilder.margins;

    // Add Logo Mark
    doc.save();
    doc.scale(0.25);
    doc.translate(margins.left + 28, margins.top + 30);
    doc.path(logoPath);
    doc.fillAndStroke();
    doc.restore();

    // Add Logo Text
    doc.font('Helvetica-Bold');
    doc.fontSize(18);
    doc.text('HARVEST', margins.left + 26, margins.top);
    doc.font('Helvetica');
    doc.text('profit', margins.left + 112, margins.top);
  }

  addYear() {
    const doc = this.pdfBuilder.doc;
    const margins = this.pdfBuilder.margins;

    doc.font('Helvetica-Bold');
    doc.fontSize(18);
    doc.text(this.year, doc.page.width - margins.left - margins.right - 12, margins.top);
  }

  onPageAdded(pdfBuilder) {
    this.height = pdfBuilder.margins.top + 30;
    this.pdfBuilder = pdfBuilder;
    this.addLogo();
    this.addYear();
  }
}

export default HarvestProfitPDFHeader;
