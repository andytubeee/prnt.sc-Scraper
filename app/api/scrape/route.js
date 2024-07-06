import { NextResponse } from 'next/server';
import xpath from 'xpath';
import { DOMParser } from 'xmldom';
// import chrome from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

const LOCAL_CHROME_EXECUTABLE =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

if (process.env.AWS_REGION === '1') {
  let chrome = require('chrome-aws-lambda');
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
  //   console.log(options);
  //   Launch the browser
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  // Replace with the URL you want to scrape
  const url = `https://prnt.sc/${generateRoute()}`;
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
  let result = [];
  nodes.forEach((node) => {
    if (node.nodeName.toLowerCase() === 'img') {
      const src = node.getAttribute('src');
      result.push(src);
    }
  });

  // Close the browser
  await browser.close();

  //   Respond with the scraped data
  return NextResponse.json({ imageSrc: result[0] });
  //   return NextResponse.json({ test: 1 });
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
