/**
 * Generates a basic PDF Header
 */
class BasicPDFHeader {
  constructor(options, year) {
    this.year = year;
    if (options.includePagination !== undefined &&
        options.includePagination !== null &&
        options.includePagination === false) {
      this.includePagination = false;
    } else {
      this.includePagination = true;
      this.currentPage = 1;
    }
    this.data = options.data || [];
    if (!Array.isArray(this.data)) {
      this.data = [this.data];
    }
  }

  addHeaderData() {
    const doc = this.pdfBuilder.doc;
    const margins = this.pdfBuilder.margins;
    const fontSize = 11;
    let lineHeight = this.data.length - 1;
    const contentHeight = margins.top + ((lineHeight + 1) * fontSize) + 10;
    const minHeight = margins.top + 30;

    this.height = contentHeight > minHeight ? contentHeight : minHeight;
    doc.font('Helvetica');
    doc.fontSize(fontSize);

    for (let i = 0; i < this.data.length; i += 1) {
      if (typeof this.data[i] === 'string') {
        doc.text(this.data[i], margins.left, margins.top + (lineHeight * fontSize));
        lineHeight -= 1;
      } else if (typeof this.data[i] === 'object' &&
                  this.data[i].value !== undefined &&
                  this.data[i].label !== undefined) {
        doc
          .font('Helvetica-Bold')
          .text(`${this.data[i].label}: `, margins.left, margins.top + (lineHeight * fontSize), { lineBreak: false })
          .font('Helvetica').text(this.data[i].value);
        lineHeight -= 1;
      }
    }
  }

  addYear() {
    const doc = this.pdfBuilder.doc;
    const margins = this.pdfBuilder.margins;
    doc.font('Helvetica-Bold');
    doc.fontSize(18);
    doc.text(this.year, doc.page.width - margins.left - margins.right - 12, margins.top);
  }

  onPageAdded(pdfBuilder) {
    this.pdfBuilder = pdfBuilder;
    this.addHeaderData();
    this.addYear();
  }
}

export default BasicPDFHeader;
