const express = require('express');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Home page with form
app.get('/', (req, res) => {
  res.render('index');
});

// PDF generation endpoint
app.post('/generate', (req, res) => {
  const { templateSize, title, description, labels } = req.body;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=label.pdf');

  const pageWidth = 432;
  const pageHeight = 288;
  const doc = new PDFDocument({ size: [pageWidth, pageHeight], margin: 0 });

  if (templateSize === 'Big Labels') {
    // Support multiple Big Labels
    const pageWidth = 432;
    const pageHeight = 288;
    let titles = req.body.titles || [];
    let descriptions = req.body.descriptions || [];
    // Fallback for single set (old form)
    if (!Array.isArray(titles)) titles = [title || ''];
    if (!Array.isArray(descriptions)) descriptions = [description || ''];
    for (let i = 0; i < titles.length; i++) {
      if (i > 0) doc.addPage({ size: [pageWidth, pageHeight], margin: 0 });
      const marginLeft = 40;
      const marginRight = 40;
      const contentWidth = pageWidth - marginLeft - marginRight;
      const titleText = titles[i] || '';
      const descText = descriptions[i] || '';
      doc.fontSize(28);
      const titleHeight = doc.heightOfString(titleText, { width: contentWidth, align: 'center' });
      doc.fontSize(16);
      const descHeight = doc.heightOfString(descText, { width: contentWidth, align: 'center' });
      const gap = 16;
      const totalTextHeight = titleHeight + gap + descHeight;
      const startY = (pageHeight - totalTextHeight) / 2;
      doc.fontSize(28).text(titleText, marginLeft, startY, { width: contentWidth, align: 'center' });
      doc.fontSize(16).text(descText, marginLeft, startY + titleHeight + gap, { width: contentWidth, align: 'center' });
    }
  } else if (templateSize === 'Small Labels') {
    // Small Labels: 6 grid, multi-page (6x4 inch = 432pt x 288pt)
    let labelArr = Array.isArray(labels) ? labels : [labels];
    let page = 0;
    const cols = 2;
    const rows = 3;
    const cellWidth = pageWidth / cols;
    const cellHeight = pageHeight / rows;
    while (labelArr.length > 0) {
      if (page > 0) doc.addPage({ size: [pageWidth, pageHeight], margin: 0 });
      const pageLabels = labelArr.splice(0, 6);
      for (let i = 0; i < 6; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = col * cellWidth + 10;
        const y = row * cellHeight + 10;
        doc.rect(col * cellWidth + 10, row * cellHeight + 10, cellWidth - 20, cellHeight - 20).stroke();
        doc.fontSize(16).text(pageLabels[i] || '', x + 10, y + 30, {
          width: cellWidth - 40,
          height: cellHeight - 60,
          align: 'center',
          valign: 'center'
        });
      }
      page++;
    }
  }
  doc.end();
  doc.pipe(res);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 