import logoPath from './logo';

/**
 * Generates a HarvestProfit themed PDF header.
 */
class HarvestProfitPDFHeader {
  constructor() {}

  addLogo() {
    const { doc, margins } = this.pdfBuilder;

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
    const { doc, margins, metadata } = this.pdfBuilder;

    doc.font('Helvetica-Bold');
    doc.fontSize(18);
    doc.text(metadata.year, doc.page.width - margins.left - margins.right - 12, margins.top);
  }

  onPageAdded(pdfBuilder) {
    this.height = pdfBuilder.margins.top + 30;
    this.pdfBuilder = pdfBuilder;
    this.addLogo();
    if (this.pdfBuilder.metadata.year)
      this.addYear();
  }
}

export default HarvestProfitPDFHeader;
