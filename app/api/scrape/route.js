import { NextResponse } from 'next/server';
import xpath from 'xpath';
import { DOMParser } from 'xmldom';
// import chrome from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

const LOCAL_CHROME_EXECUTABLE =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

let chrome;

if (process.env.AWS_REGION === '1') {
  chrome = require('chrome-aws-lambda');
}

const options =
  process.env.AWS_REGION === '1'
    ? {
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
      }
    : {
        args: [],
        executablePath:
          process.platform === 'win32'
            ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
            : process.platform === 'linux'
            ? '/usr/bin/google-chrome'
            : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      };
export async function GET() {
  // Replace with the URL you want to scrape
  let imageSrc = null;

  const browser = await puppeteer.launch(options);

  while (!imageSrc) {
    let url = `https://prnt.sc/${generateRoute()}`;
    imageSrc = await scrape(browser, url);

    if (!(await isValidImageUrl(imageSrc))) {
      imageSrc = null;
    }
  }

  // Close the browser
  await browser.close();

  // Respond with the scraped data
  return NextResponse.json({ imageSrc });
}

function generateRoute() {
  // Generate 2 random letters
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const randomLetters = Array.from(
    { length: 2 },
    () => letters[Math.floor(Math.random() * letters.length)]
  ).join('');

  // Generate 4 random numbers
  const randomNumbers = Math.floor(1000 + Math.random() * 9000).toString();

  // Combine letters and numbers
  return randomLetters + randomNumbers;
}

async function isValidImageUrl(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return response.ok && contentType && contentType.startsWith('image/');
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    return false;
  }
}

async function scrape(browser, url) {
  const page = await browser.newPage();

  await page.goto(url);

  // Get the page content
  const content = await page.content();

  // Parse the content using DOMParser
  const doc = new DOMParser().parseFromString(content, 'text/html');

  // Define the XPath expression
  const xpathExpression = '//*[@id="screenshot-image"]';

  // Evaluate the XPath expression
  const nodes = xpath.select(xpathExpression, doc);

  // Extract the src attribute from the node(s)
  let imageUrl = null;
  if (nodes.length > 0) {
    const node = nodes[0];
    if (node.nodeName.toLowerCase() === 'img') {
      const src = node.getAttribute('src');
      if (src && (await isValidImageUrl(src))) {
        imageUrl = src;
      }
    }
  }

  // Close the page
  await page.close();
  return imageUrl;
}
