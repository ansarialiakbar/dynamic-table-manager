##      Dynamic Data Table Manager

A React-based web application for managing tabular data with features like sorting, searching, inline editing, CSV import/export, dynamic column management, and light/dark mode toggling. Built with Vite, Redux Toolkit, Material UI, and Tailwind CSS, this project is optimized for deployment on Netlify.

## Features

**Table View:** Displays data in a Material UI table with sorting (click headers for ASC/DESC), global search, and pagination (10 rows/page).

**Dynamic Columns:** Add new columns or toggle visibility via a modal, with state persisted in localStorage.
CSV Import/Export: Import CSV files with required columns (name, email, age, role) and export visible columns using PapaParse and FileSaver.

**Inline Editing:** Double-click rows to edit fields, with validation for numeric age.

**Row Actions:** Delete rows with confirmation prompts.

**Theme Toggle:** Switch between light and dark modes, persisted in localStorage, styled with Tailwind CSS and Material UI.

**Responsive Design:** Mobile-friendly layout using Tailwind CSS.

## Tech Stack

**Frontend:** React 18, Redux Toolkit, Material UI, Tailwind CSS

**Build Tool:** Vite

**Dependencies:** @reduxjs/toolkit, react-redux, @mui/material, @mui/icons-material, @emotion/react, @emotion/styled, papaparse, file-saver, react-hook-form

**Dev Dependencies:** @vitejs/plugin-react, tailwindcss, postcss, autoprefixer, vite


## Setup Instructions

**1. Clone the Repository:**
```
git clone https://github.com/ansarialiakbar/dynamic-table-manager.git

cd dynamic-table-manager
```

Replace yourusername with your GitHub username.

**2. Install Dependencies:**
```
npm install
```


**3. Run Locally:**
```
npm run dev
```

Open http://localhost:5173 in your browser to view the app.

**4. Build for Production:**|
```
npm run build
```

This generates the dist folder with production-ready files.


## Project Structure
```
dynamic-table-manager/
├── public/
│   ├── index.html
│   └── _redirects (optional for SPA routing)
├── src/
│   ├── components/
│   │   ├── DataTable.jsx
│   │   └── ManageColumnsModal.jsx
│   ├── redux/
│   │   ├── store.js
│   │   └── tableSlice.js
│   ├── App.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Deployment on Netlify

**1. Push to GitHub:**

Initialize a Git repository if not already done:
```
git init

git add .

git commit -m "Initial commit"
```


Create a GitHub repository (e.g., dynamic-table-manager).

Push to GitHub:
```
git remote add origin https://github.com/yourusername/dynamic-table-manager.git

git branch -M main

git push -u origin main
```




**2. Deploy to Netlify:**

**.** Log in to app.netlify.com.

**.** Click New site from Git > GitHub > Select dynamic-table-manager.

**.** Configure:

**Branch:** main

**Build Command:** npm run build

**Publish Directory:** dist


**.** Click Deploy site.
Netlify assigns a URL (e.g., https://random-name.netlify.app). Customize it under Site configuration > Site details > Change site name.


## Contributing

**1.** Fork the repository.

**2.** Create a branch:
```
git checkout -b feature/your-feature
```


**3.** Commit changes:
```
git commit -m "Add your feature"
```


**4.** Push and create a pull request:
```
git push origin feature/your-feature
```

## License

MIT License. See LICENSE for details.
