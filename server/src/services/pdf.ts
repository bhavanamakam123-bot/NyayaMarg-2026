import PDFDocument from "pdfkit";
import { DISCLAIMER } from "../data/knowledge.js";

export function renderPdf(title: string, lines: string[]) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 54, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.fillColor("#0B1F3A").fontSize(18).text("NyayaMarg", { continued: false });
    doc.moveDown(0.2);
    doc.fontSize(14).text(title);
    doc.moveDown(0.4);
    doc.fontSize(9).fillColor("#5c4a1d").text(DISCLAIMER);
    doc.moveDown(0.8);
    doc.fillColor("#1c2b3a").fontSize(11);
    for (const line of lines) {
      doc.text(line, { paragraphGap: 6 });
      doc.moveDown(0.35);
    }
    doc.end();
  });
}
