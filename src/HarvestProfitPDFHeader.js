import logoPath from './logo';

/**
 * Generates a HarvestProfit themed PDF header.
 */
class HarvestProfitPDFHeader {
  /**
   * Adds the Harvest Profit Logo to the header.
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
    doc.scale(0.25);
    doc.translate(margins.left + 28, margins.top + 30);
    doc.path(logoPath);
    doc.fillAndStroke();
    doc.restore();

    // Add Logo Text
    doc.font(documentBoldFont);
    doc.fontSize(18);
    doc.text('HARVEST', margins.left + 26, margins.top);
    doc.font(documentFont);
    doc.text('profit', margins.left + 112, margins.top);
  }

  /**
   * Adds the year to the header if provided in metadata.
   */
  addYear() {
    if (this.pdfBuilder.metadata.year) {
      const {
        doc,
        margins,
        metadata,
        documentBoldFont,
      } = this.pdfBuilder;

      doc.font(documentBoldFont);
      doc.fontSize(18);
      doc.text(metadata.year, doc.page.width - margins.left - margins.right - 12, margins.top);
    }
  }

  /**
   * Hook called by a PDFBuilder object when a new page is added.
   * @param {PDFBuilder} pdfBuilder The pdf builder object to add to.
   */
  onPageAdded(pdfBuilder) {
    this.height = pdfBuilder.margins.top + 30;
    this.pdfBuilder = pdfBuilder;
    this.addLogo();
    this.addYear();
  }
}

export default HarvestProfitPDFHeader;
