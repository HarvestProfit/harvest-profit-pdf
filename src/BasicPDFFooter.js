/**
 * Generates a basic PDF footer
 */
class BasicPDFFooter {
  constructor() {}

  /**
   * Adds metadata tags to the footer.
   */
  addTags() {
    const { doc, margins, metadata } = this.pdfBuilder;
    const fontSize = 9;
    let lineHeight = this.data.length - 1;
    doc.font('Helvetica');
    doc.fontSize(fontSize);

    for (let i = 0; i < metadata.tags.length; i += 1) {
      if (typeof metadata.tags[i] === 'string') {
        doc.text(
          metadata.tags[i],
          margins.left,
          (this.height + margins.bottom) - (lineHeight * fontSize));
        lineHeight -= 1;
      } else if (typeof metadata.tags[i] === 'object' && metadata.tags[i].value !== undefined && metadata.tags[i].label !== undefined) {
        doc
          .font('Helvetica-Bold')
          .text(`${metadata.tags[i].label}:`,
            margins.left,
            (this.height + margins.bottom) - (lineHeight * fontSize),
            { lineBreak: false })
          .font('Helvetica')
          .text(metadata.tags[i].value);
        lineHeight -= 1;
      }
    }
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
      doc.text(text, margins.left, this.height + margins.bottom, { align: 'right', width: this.width });
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
    this.addTags();
    this.addPagination();
  }
}

export default BasicPDFFooter;
