# Tech Companies Scraper

This project is a web scraper built using Puppeteer to extract information about software development companies in Canada from [Tech Reviewer](https://techreviewer.co/). The scraper collects company names and their websites, and outputs the data in both JSON and CSV formats.

---

## Features

- Scrapes company names and websites from Tech Reviewer.
- Handles pagination automatically to scrape data from all available pages.
- Exports data as:
  - JSON (`techreviewerComp.json`)
  - CSV (`techreviewerComp.csv`)

---

## Prerequisites

Before running the project, ensure the following:

1. **Node.js** is installed (recommended version 14 or later).
2. The following Node.js modules are installed:
   - `puppeteer`
   - `fs`
   - `path`

To install the required modules, run:

```bash
npm install puppeteer
```
