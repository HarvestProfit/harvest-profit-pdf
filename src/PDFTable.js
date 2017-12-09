/*
eslint no-underscore-dangle: ["error", {
  "allow": [
  "_addColumn",
  "_addHeader",
  "_addRow",
  "_columnWidth",
  "_headerLineGap",
  "_rowLineGap"]
}]
*/

export default class PDFTable {
  /**
  Initialize a table for outputting to a PDF.
  Usage:
    ```javascript
    let pdfBuilder = new PDFBuilder();
    let table = new PDFTable();
    pdfBuilder.addTable()
    ```

    Minimum options required to build out the table:
    ```javascript
    let table = new PDFTable([{
      header: { text: 'ID' },
      rows:  [{ text: '1' }, { text: '2' }, { text: '3' }]
    }, {
      header: { text: 'Name' },
      rows:  [{ text: 'Billy' }, { text: 'Bob' }, { text: 'Suzy' }]
    }]);
    ```

    All available options:
    ```javascript
    let table = new PDFTable([{
      header: {
        align:       'center',
        borderColor: '#000',
        borderStyle: 'bottom',
        borderWidth: 2,
        color:       '#000',
        font:        'Helvetica-Bold',
        fontSize:    14,
        text:        'Name'
      },
      rows: [{
        align:       'center',
        borderColor: '#000',
        borderStyle: 'bottom',
        borderWidth: 2,
        color:       '#000',
        font:        'Helvetica-Bold',
        fontSize:    14,
        text:        'Brian'
      }],
      width: 150 // or 0.25 for 25% of the table's width
    }]);
    ```

    @method constructor
    @param {Array} columns
    @param {Object} options
  */
  constructor(columns = [], options = {}) {
    this.cellAlign = options.cellAlign || 'left';
    this.cellColor = options.cellColor || '#222';
    this.cellBorderColor = options.headerColor || '#ccc';
    this.cellBorderWidth = options.cellBorderWidth || 1;
    this.cellFont = options.cellFont || 'Helvetica';
    this.cellItalic = options.cellItalic || false;
    this.cellFontSize = options.cellFontSize || 14;
    this.headerAlign = options.headerAlign || 'left';
    this.headerColor = options.headerColor || '#000';
    this.headerBorderColor = options.headerColor || '#000';
    this.headerBorderStyle = options.headerBorderStyle || 'bottom';
    this.headerBorderWidth = options.headerBorderWidth || 1.5;
    this.headerFont = options.headerFont || 'Helvetica-Bold';
    this.headerItalic = options.headerItalic || false;
    this.headerFontSize = options.headerFontSize || 14;
    this.margins = options.margins || { bottom: 30, left: 0, right: 0, top: 0 };

    this.cellEmptyColor = options.cellEmptyColor || '#FFFFFF';
    this.cellEmptyFontSize = options.cellEmptyFontSize || this.cellFontSize;
    this.cellEmptyItalic = options.cellEmptyItalic || this.cellItalic;
    this.cellEmptyText = options.cellEmptyText || 'none';

    this.headerEmptyColor = options.headerEmptyColor || '#FFFFFF';
    this.headerEmptyFontSize = options.headerEmptyFontSize || this.headerFontSize;
    this.headerEmptyItalic = options.headerEmptyItalic || this.headerItalic;
    this.headerEmptyText = options.headerEmptyText || 'none';
    this.headerAllowWrap = options.headerAllowWrap || false;
    this.cellAllowWrap = options.cellAllowWrap || false;

    this.skewFactor = Math.tan((-15 * Math.PI) / 180);
    this.columns = columns;
  }

  /**
    Add a table to the PDF document.
    @method addToPDF
    @param {PDFBuilder} builder
  */
  addToPDF(builder) {
    const doc = builder.doc;

    this.builder = builder;
    this.currentPage = doc.bufferedPageRange().count - 1;
    this.currentPosition = { x: builder.pageLeft(), y: doc.y };
    this.startingPosition = { x: builder.pageLeft(), y: doc.y };
    this.startingPage = doc.bufferedPageRange().count - 1;

    for (let i = 0; i < this.columns.length; i += 1) {
      this.currentPage = this.startingPage;
      this.currentPosition.y = this.startingPosition.y;
      doc.switchToPage(this.currentPage);
      this._addColumn(this.columns[i]);
    }

    doc.y += this.margins.bottom;
  }

  /**
    Returns the full width of the table based on the page size and margins.
    @return {Number}
  */
  width() {
    return this.builder.contentWidth();
  }


  /**
    Ouput a column from the table to the PDF.
    @method _addColumn
    @param {Object} column
    @private
  */
  _addColumn(column) {
    this.columnWidth = this._columnWidth(column.width);

    // Add Header Row
    this._addHeader(column);

    // Add Data Rows
    for (let i = 0; i < column.rows.length; i += 1) {
      this._addRow(column, column.rows[i]);
    }

    // Update position for the next column
    this.currentPosition.x += this.columnWidth;
  }


  /**
    Ouput the column header to the PDF.
    @method _addHeader
    @param {Object} column
    @param {Number} width
    @private
  */
  _addHeader(column) {
    const doc = this.builder.doc;
    const header = column.header;
    const align = header.align || this.headerAlign;
    const borderColor = header.borderColor || this.headerBorderColor;
    // const borderStyle = header.borderStyle || this.headerBorderStyle;
    const borderWidth = header.borderWidth || this.headerBorderWidth;
    let color = header.color || this.headerColor;
    const font = header.font || this.headerFont;
    let italic = header.italic || this.headerItalic;
    let fontSize = header.fontSize || this.headerFontSize;
    const lineGap = this._headerLineGap(header);
    const position = this.currentPosition;
    const width = this.columnWidth;
    let text = header.text;
    const emptyColor = header.emptyColor || this.headerEmptyColor;
    const emptyFontSize = header.emptyFontSize || this.headerEmptyFontSize;
    const emptyItalic = header.emptyItalic || this.headerEmptyItalic;
    const emptyText = header.emptyText || this.headerEmptyText;
    const allowWrap = header.allowWrap || this.headerAllowWrap;

    if (text === undefined || text === null || text.length < 1) {
      color = emptyColor;
      fontSize = emptyFontSize;
      italic = emptyItalic;
      text = emptyText;
    }

    doc.save();
    doc.fillColor(color);
    doc.font(font);
    doc.fontSize(fontSize);
    if (italic) {
      doc.transform(1, 0, this.skewFactor, 1, (-position.y * this.skewFactor) + 1, 0);
    }
    if (allowWrap) {
      doc.text(text, position.x, position.y, {
        lineBreak: false,
        align,
        lineGap,
        width,
      });
    } else {
      doc.text(text, position.x, position.y, {
        lineBreak: false,
        align,
        lineGap,
        width,
        height: lineGap,
        ellipsis: true,
      });
    }
    doc.restore();

    doc
      .moveTo(doc.x, doc.y - (fontSize * 0.85))
      .lineWidth(borderWidth)
      .lineTo(doc.x + width, doc.y - (fontSize * 0.85))
      .strokeColor(borderColor)
      .stroke();
  }

  _addRow(column, row) {
    const doc = this.builder.doc;
    const pageCount = doc.bufferedPageRange().count;

    // Repeat the header if a new page is needed
    const newPage = this.builder.addPageIfNeeded(this.currentPage, pageCount);
    if (newPage) {
      this.currentPage += 1;
      this.currentPosition.y = doc.y;
      this._addHeader(column, column.header);
    }

    const align = row.align || this.cellAlign;
    const borderColor = row.borderColor || this.cellBorderColor;
    const borderStyle = row.borderStyle || this.cellBorderStyle;
    const borderWidth = row.borderWidth || this.cellBorderWidth;
    let italic = row.italic || this.cellItalic;
    let color = row.color || this.cellColor;
    const font = row.font || this.cellFont;
    let fontSize = row.fontSize || this.cellFontSize;

    const allowWrap = row.allowWrap || this.cellAllowWrap;

    const emptyColor = row.emptyColor || this.cellEmptyColor;
    const emptyFontSize = row.emptyFontSize || this.cellEmptyFontSize;
    const emptyItalic = row.emptyItalic || this.cellEmptyItalic;
    const emptyText = row.emptyText || this.cellEmptyText;

    let text = row.text;

    const lineGap = this._rowLineGap(row);
    const width = this.columnWidth;
    if (text === undefined || text === null || text.length < 1) {
      color = emptyColor;
      fontSize = emptyFontSize;
      italic = emptyItalic;
      text = emptyText;
    }

    doc.save();
    doc.fillColor(color);
    doc.font(font);
    doc.fontSize(fontSize);
    if (italic) {
      doc.transform(1, 0, this.skewFactor, 1, (-doc.y * this.skewFactor) + 1, 0);
    }

    if (allowWrap) {
      doc.text(text, {
        lineBreak: false,
        align,
        lineGap,
        width,
      });
    } else {
      doc.text(text, {
        lineBreak: false,
        align,
        lineGap,
        width,
        height: lineGap,
        ellipsis: true,
      });
    }
    doc.restore();

    if (borderStyle === 'none') {
      return;
    }

    doc
      .moveTo(doc.x, doc.y - (fontSize * 0.7))
      .lineWidth(borderWidth)
      .lineTo(doc.x + width, doc.y - (fontSize * 0.7))
      .strokeColor(borderColor)
      .stroke();
  }

  /**
    Ouput the column header to the PDF.
    @method _columnWidth
    @param {Number} width
    @return {Number}
    @private
  */
  _columnWidth(width) {
    if (this.columns.length < 2) {
      return this.width();
    }

    if (width == null) {
      return this.width() / this.columns.length;
    }

    if (width < 1) {
      return this.width() * width;
    }

    return width;
  }

  _headerLineGap(header) {
    const fontSize = header.fontSize || this.headerFontSize;
    return fontSize * 1.2;
  }

  _rowLineGap(row) {
    const fontSize = row.fontSize || this.cellFontSize;
    return fontSize * 1.07;
  }
}
