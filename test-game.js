#!/usr/bin/env node
import puppeteer from 'puppeteer';

async function testGame() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1400, height: 900 }
  });

  try {
    const page = await browser.newPage();

    console.log('Navigating to http://localhost:5173/...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });

    console.log('Waiting for Start AI button...');
    await page.waitForSelector('button');

    console.log('Taking screenshot of initial state...');
    await page.screenshot({ path: '/tmp/game-before-start.png' });

    console.log('Clicking Start AI button...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const startButton = buttons.find(btn => btn.textContent.includes('Start AI'));
      if (startButton) startButton.click();
    });

    console.log('Waiting 5 seconds to observe the game running...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('Taking screenshot after 5 seconds...');
    await page.screenshot({ path: '/tmp/game-running-5s.png' });

    console.log('Waiting another 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('Taking screenshot after 10 seconds...');
    await page.screenshot({ path: '/tmp/game-running-10s.png' });

    console.log('Test complete! Browser will stay open for inspection.');
    console.log('Press Ctrl+C to close.');

    // Keep browser open
    await new Promise(() => {});

  } catch (error) {
    console.error('Error:', error);
    await browser.close();
  }
}

testGame();
