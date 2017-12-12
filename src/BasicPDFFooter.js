/**
 * Generates a basic PDF footer
 */
class BasicPDFFooter {
  /**
   * Adds metadata tags to the footer.
   */
  addTags() {
    const {
      doc,
      margins,
      metadata,
      documentFont,
      documentBoldFont,
    } = this.pdfBuilder;
    const fontSize = 9;
    let lineHeight = this.data.length - 1;
    doc.font(documentFont);
    doc.fontSize(fontSize);

    const tags = metadata.tags || [];

    for (let i = 0; i < tags.length; i += 1) {
      if (typeof tags[i] === 'string') {
        doc.text(
          tags[i],
          margins.left,
          (this.height + margins.bottom) - (lineHeight * fontSize));
        lineHeight -= 1;
      } else if (typeof tags[i] === 'object' && tags[i].value !== undefined && tags[i].label !== undefined) {
        doc
          .font(documentBoldFont)
          .text(`${tags[i].label}:`,
            margins.left,
            (this.height + margins.bottom) - (lineHeight * fontSize),
            { lineBreak: false })
          .font(documentFont)
          .text(tags[i].value);
        lineHeight -= 1;
      }
    }
  }

  /**
   * Adds the page number to the footer if enabled.
   */
  addPagination() {
    if (this.pdfBuilder.includePageNumber) {
      const { doc, margins, documentFont } = this.pdfBuilder;
      let text = this.currentPage;
      doc.font(documentFont);
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
