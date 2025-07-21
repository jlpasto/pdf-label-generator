# PDF Label Generator

A Node.js application that provides a simple web interface for generating PDF label sheets in 4x6 paper size. Users can dynamically fill out a form and generate a PDF with either a single large label or multiple small labels, ready for download.

---

## Overview
This project allows users to:
- Select between two label formats: **Big Labels** and **Small Labels**
- Dynamically add or remove label fields for small labels
- Generate a PDF in 4x6 inch format (288pt x 432pt)
- Download the generated PDF with a single click

---

## Tech Stack
- **Backend:** Node.js with Express (CommonJS modules only)
- **Frontend:** HTML, CSS, vanilla JavaScript, and EJS templating
- **PDF Generation:** [PDFKit](https://pdfkit.org/docs/guide.pdf)

---

## Features
- **Form Elements:**
  - ComboBox for template selection (Big Labels or Small Labels)
  - Conditional fields:
    - **Big Labels:** Title and Short Description
    - **Small Labels:** Label 1 (with option to add more labels dynamically)
  - [+ Add Label] button to add more label fields on the fly
  - Generate PDF button
- **Form Validation:**
  - All visible fields are required
  - Maximum of 12 labels (6 per page, multiple pages supported)
- **PDF Output:**
  - 4x6 inch (288pt x 432pt) paper size
  - Downloadable PDF upon generation

---

## PDF Output Requirements
### Big Labels
- Single centered label
- Layout:
  ```
  ----------------------------
        [Big Font Title]
        [Small Font Description]
  ----------------------------
  ```

### Small Labels
- 6 evenly divided rectangles per page (2 columns, 3 rows)
- Each box contains one label
- Multiple pages supported if more than 6 labels
- Layout Grid:
  ```
  -------------------------——---
   Label 1         |    Label 2
  -----------------——-----------
   Label 3         |    Label 4
  --------------——---------------
   Label 5         |    Label 6
  ---------------——--------------
  ```

---

## Usage

### 1. Install dependencies
```bash
npm install
```

### 2. Start the server
```bash
node server.js
```

### 3. Open in your browser
Go to [http://localhost:3000](http://localhost:3000)

### 4. Fill out the form
- Select a template size
- Enter required fields
- For Small Labels, use [+ Add Label] to add up to 12 labels (6 per page)

### 5. Generate PDF
- Click **Generate PDF**
- The PDF will be generated and downloaded automatically

---

## Project Structure
```
PDF Label Generator using Node.js/
├── public/
│   ├── main.js         # Frontend JS (vanilla, not a module)
│   └── style.css       # Styles
├── views/
│   └── index.ejs       # EJS template for the form
├── server.js           # Express backend (CommonJS)
├── package.json
└── README.md
```

---

## Notes
- **CommonJS Only:** All backend code uses `const xxx = require('xxx')`. No ESM imports.
- **Validation:** Only visible fields are required, preventing browser errors on hidden fields.
- **PDFKit:** For more on PDFKit, see the [official guide](https://pdfkit.org/docs/guide.pdf).

---

Contact Repo Owner:
Jhon Loyd Pastorin @ jhonloydpastorin.03@gmail.com