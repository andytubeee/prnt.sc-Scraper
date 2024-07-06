import { NextResponse } from 'next/server';
import xpath from 'xpath';
import { DOMParser } from 'xmldom';
import fetch from 'node-fetch';

async function fetchHtml(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const html = await response.text();
      return html;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching the HTML:', error);
    return null;
  }
}

export async function GET() {
  // Replace with the URL you want to scrape
  let url = `https://prnt.sc/${generateRoute()}`;
  let imageSrc = await getImageSrcFromUrl(url);

  while (!imageSrc) {
    url = `https://prnt.sc/${generateRoute()}`;
    imageSrc = await getImageSrcFromUrl(url);
  }

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
async function getImageSrcFromUrl(url) {
  const html = await fetchHtml(url);
  if (html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const xpathExpression = '//*[@id="screenshot-image"]';
    const nodes = xpath.select(xpathExpression, doc);
    if (nodes.length > 0) {
      const node = nodes[0];
      if (node.nodeName.toLowerCase() === 'img') {
        const src = node.getAttribute('src');
        if (src && (await isValidImageUrl(src))) {
          return src;
        }
      }
    }
  }
  return null;
}
export const revalidate = 0;
