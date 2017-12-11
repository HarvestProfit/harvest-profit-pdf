/**
 * Generates a basic PDF footer
 */
class BasicPDFFooter {
  constructor(options) {
    this.data = options.data || [];
    if (!Array.isArray(this.data)) {
      this.data = [this.data];
    }
  }

  addFooterData() {
    const { doc, margins } = this.pdfBuilder;
    const fontSize = 9;
    let lineHeight = this.data.length - 1;
    doc.font('Helvetica');
    doc.fontSize(fontSize);

    for (let i = 0; i < this.data.length; i += 1) {
      if (typeof this.data[i] === 'string') {
        doc.text(
          this.data[i],
          margins.left,
          (this.height + margins.bottom) - (lineHeight * fontSize));
        lineHeight -= 1;
      } else if (typeof this.data[i] === 'object' && this.data[i].value !== undefined && this.data[i].label !== undefined) {
        doc
          .font('Helvetica-Bold')
          .text(`${this.data[i].label}:`,
            margins.left,
            (this.height + margins.bottom) - (lineHeight * fontSize),
            { lineBreak: false })
          .font('Helvetica')
          .text(this.data[i].value);
        lineHeight -= 1;
      }
    }
  }

  addPagination() {
    const { doc, margins } = this.pdfBuilder;
    let text = this.currentPage;
    doc.fontSize(9);

    if (this.docTitle.length > 0) {
      text = `${this.docTitle} - ${text}`;
    }
    doc.text(text, margins.left, this.height + margins.bottom, { align: 'right', width: this.width });
  }

  onPageAdded(pdfBuilder) {
    this.width = pdfBuilder.doc.page.width - pdfBuilder.margins.left - pdfBuilder.margins.right;
    this.height = pdfBuilder.doc.page.height - pdfBuilder.margins.top - pdfBuilder.margins.bottom;
    this.currentPage = pdfBuilder.currentPage;
    this.docTitle = pdfBuilder.title;
    this.pdfBuilder = pdfBuilder;
    this.addFooterData();
    if (this.pdfBuilder.includePageNumber) {
      this.addPagination();
    }
  }
}

export default BasicPDFFooter;
