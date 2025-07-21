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
  const doc = new PDFDocument({ size: [288, 432], margin: 0 });

  if (templateSize === 'Big Labels') {
    // Big Label: Centered Title and Description with 40pt left/right margin
    const pageWidth = 288;
    const pageHeight = 432;
    const marginLeft = 40;
    const marginRight = 40;
    const contentWidth = pageWidth - marginLeft - marginRight;
    const titleText = title || '';
    const descText = description || '';

    // Set font sizes
    doc.fontSize(28);
    const titleHeight = doc.heightOfString(titleText, { width: contentWidth, align: 'center' });
    doc.fontSize(16);
    const descHeight = doc.heightOfString(descText, { width: contentWidth, align: 'center' });
    const gap = 16; // space between title and description
    const totalTextHeight = titleHeight + gap + descHeight;
    const startY = (pageHeight - totalTextHeight) / 2;

    // Draw title
    doc.fontSize(28).text(titleText, marginLeft, startY, { width: contentWidth, align: 'center' });
    // Draw description
    doc.fontSize(16).text(descText, marginLeft, startY + titleHeight + gap, { width: contentWidth, align: 'center' });
  } else if (templateSize === 'Small Labels') {
    // Small Labels: 6 grid, multi-page
    let labelArr = Array.isArray(labels) ? labels : [labels];
    let page = 0;
    while (labelArr.length > 0) {
      const pageLabels = labelArr.splice(0, 6);
      if (page > 0) doc.addPage();
      for (let i = 0; i < 6; i++) {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 10 + col * (288 / 2);
        const y = 10 + row * (432 / 3);
        doc.rect(x, y, (288 / 2) - 20, (432 / 3) - 20).stroke();
        doc.fontSize(16).text(pageLabels[i] || '', x + 10, y + 30, {
          width: (288 / 2) - 40,
          height: (432 / 3) - 60,
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