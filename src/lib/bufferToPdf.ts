
import PDFParser from 'pdf2json';

export async function parsePdfFromBuffer(buffer: Buffer) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, true);

    pdfParser.on('pdfParser_dataError', (errData) => {
      reject(errData.parserError);
    });

    pdfParser.on('pdfParser_dataReady', () => {
      resolve(pdfParser.getRawTextContent());
    });

    pdfParser.parseBuffer(buffer);
  });
}
