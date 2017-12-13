import PDFTestHelper, { chunks } from './helper';

describe('parseBasicPDFHeader', () => {
  it('should parse the header tags from the chunks', () => {
    const pdfHeader = PDFTestHelper.parseBasicPDFHeader(chunks, 3);
    expect(pdfHeader.tags).toEqual({ Crops: 'Corn, Barley', Fields: 'All Fields', Entities: 'All Entities' });
  });

  it('should parse the header year from the chunks', () => {
    const pdfHeader = PDFTestHelper.parseBasicPDFHeader(chunks, 3);
    expect(pdfHeader.year).toEqual('2017');
  });

  it('should return the correct last index', () => {
    const pdfHeader = PDFTestHelper.parseBasicPDFHeader(chunks, 3);
    expect(pdfHeader.index).toEqual(9);
  });
});
