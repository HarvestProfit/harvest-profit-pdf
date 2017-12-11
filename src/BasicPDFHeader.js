/**
 * Generates a basic PDF Header
 */
class BasicPDFHeader {
  /**
   * Adds metadata tags to the header.
   */
  addTags() {
    const {
      doc,
      margins,
      metadata,
      documentFont,
      documentBoldFont,
    } = this.pdfBuilder;
    const fontSize = 11;
    let lineHeight = metadata.tags.length - 1;
    const contentHeight = margins.top + ((lineHeight + 1) * fontSize) + 10;
    const minHeight = margins.top + 30;

    this.height = contentHeight > minHeight ? contentHeight : minHeight;
    doc.font(documentFont);
    doc.fontSize(fontSize);

    for (let i = 0; i < metadata.tags.length; i += 1) {
      if (typeof metadata.tags[i] === 'string') {
        doc.text(metadata.tags[i], margins.left, margins.top + (lineHeight * fontSize));
        lineHeight -= 1;
      } else if (typeof metadata.tags[i] === 'object' &&
                  metadata.tags[i].value !== undefined &&
                  metadata.tags[i].label !== undefined) {
        doc
          .font(documentBoldFont)
          .text(`${metadata.tags[i].label}: `, margins.left, margins.top + (lineHeight * fontSize), { lineBreak: false })
          .font(documentFont).text(metadata.tags[i].value);
        lineHeight -= 1;
      }
    }
  }

  /**
   * Adds the year to the header if provided in metadata.
   * @param {PDFBuilder} pdfBuilder The pdf builder object to add to.
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
   */
  onPageAdded(pdfBuilder) {
    this.pdfBuilder = pdfBuilder;
    this.addTags();
    this.addYear();
  }
}

export default BasicPDFHeader;
