import {
  HarvestProfitPDFHeader,
  HarvestProfitPDFFooter,
  PDFBuilder,
} from 'harvest-profit-pdf';
import saveAs from 'save-as';

export default function generate() {
  const builder = new PDFBuilder({
    header: new HarvestProfitPDFHeader(),
    footer: new HarvestProfitPDFFooter({
      message: 'Something here',
    }),
    margins: {
      bottom: -30,
      left: 30,
      right: 30,
      top: 30,
    },
    subHeadingFontColor: '#555555',
    subHeadingFontSize: 10,
    includePageNumber: true,
    title: 'Harvest Profit Is Awesome',
    metadata: {
      year: 2017
    }
  });

  builder.generateBlob().then((blob) => {
    saveAs(blob, 'Test.pdf');
  });
}
