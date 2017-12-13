import PDFTestHelper, { chunks } from './helper';

describe('parseHarvestProfitPDFFooter', () => {
  it('should parse the footer title and page from the chunks', () => {
    const pdfFooter = PDFTestHelper.parseHarvestProfitPDFFooter(chunks, 9);
    expect(pdfFooter.titleAndPage).toEqual('Inputs Usage - 1');
  });

  it('should parse the footer center message from the chunks', () => {
    const pdfFooter = PDFTestHelper.parseHarvestProfitPDFFooter(chunks, 9);
    expect(pdfFooter.message).toEqual('');
  });

  it('should return the correct last index', () => {
    const pdfFooter = PDFTestHelper.parseHarvestProfitPDFFooter(chunks, 9);
    expect(pdfFooter.index).toEqual(10);
  });
});
