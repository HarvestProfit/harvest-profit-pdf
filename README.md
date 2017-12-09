<div style="text-align: center">
  <img src="https://www.harvestprofit.com/logo.png" alt="Harvest Profit"></img>
</div>

[![Build Status](https://travis-ci.org/HarvestProfit/harvest-profit-pdf.svg?branch=master)](https://travis-ci.org/HarvestProfit/harvest-profit-pdf)

## Installation

To add this, simply run:
```bash
npm install harvest-profit-pdf
```
Or
```bash
yarn add harvest-profit-pdf
```

## Usage

Like most Harvest Profit NPM packages, you can just include the pieces you need, and let your webpack tree shaking ignore unused code paths.

```js
import {
  HarvestProfitPDFHeader,
  HarvestProfitPDFFooter,
  PDFBuilder,
} from 'harvest-profit-pdf';
import saveAs from 'save-as';

export default function generate() {
  const builder = new PDFBuilder({
    header: new HarvestProfitPDFHeader(2017),
    footer: new HarvestProfitPDFFooter({
      message: 'Something here'
    }),
    margins: {
      bottom: -30,
      left: 30,
      right: 30,
      top: 30
    },
    subHeadingFontColor: '#555555',
    subHeadingFontSize: 10,
    includePageNumber: true,
    title: 'Harvest Profit Is Awesome'
  });

  builder.generateBlob().then((blob) => {
    saveAs(blob, 'Test.pdf');
  });
}
```
