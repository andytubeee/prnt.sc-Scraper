# prnt.sc Scraper

The scraper fetches a random screenshot from the prnt.sc website.

## Features

- Scrapes random screenshots from prnt.sc
- Utilizes Next.js 14's App Router for API route handling
- Server-side web scraping with Puppeteer
- XPath for element selection

## Installation

To get started, clone the repository and install the dependencies:

```
git clone https://github.com/andytubeee/prntsc-scraper.git
cd prntsc-scraper
npm install
```

## Usage

Run the development server:

`npm run dev`

Open your browser and navigate to `http://localhost:3000/api/scrape` to fetch a random screenshot.

## How It Works

1.  **Random URL Generation:** The `generateRandomString` function creates a random prnt.sc URL.
2.  **Page Navigation:** Puppeteer navigates to the generated URL.
3.  **Content Parsing:** The page content is parsed using `DOMParser`.
4.  **XPath Selection:** The XPath expression selects the screenshot image element.
5.  **Attribute Extraction:** The `src` attribute of the image is extracted and returned in the API response.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
