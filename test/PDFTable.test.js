import PDFTestHelper, { chunks } from './helper';

describe('PDFTable', () => {
  it('should parse the table from the chunks', () => {
    const pdfTable = PDFTestHelper.parsePDFTable(chunks, 11, 3, 2);
    expect(pdfTable.table).toEqual({ Name: ['DDT', 'K12'], Usage: ['0.540 tons', '12.400 tons'], 'Total Cost': ['$5.46', '$5.32'] });
    expect(pdfTable.index).toEqual(19);
  });

  it('should return the correct last index', () => {
    const pdfTable = PDFTestHelper.parsePDFTable(chunks, 11, 3, 2);
    expect(pdfTable.index).toEqual(19);
  });
});
