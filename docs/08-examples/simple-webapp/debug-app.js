const puppeteer = require('puppeteer');

async function debugApp() {
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: false, 
      defaultViewport: null,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Listen for console messages
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      console.log(`[BROWSER ${type.toUpperCase()}]: ${text}`);
    });
    
    // Listen for page errors
    page.on('pageerror', (error) => {
      console.error('[PAGE ERROR]:', error.message);
    });
    
    // Listen for request failures
    page.on('requestfailed', (request) => {
      console.error('[REQUEST FAILED]:', request.url(), request.failure().errorText);
    });
    
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait for React to load
    await page.waitForTimeout(2000);
    
    // Check if React app root exists
    const reactRoot = await page.$('#root');
    if (!reactRoot) {
      console.error('[ERROR]: React root element not found!');
    } else {
      console.log('[SUCCESS]: React root element found');
    }
    
    // Check if main content is rendered
    const appContent = await page.$('.App');
    if (!appContent) {
      console.error('[ERROR]: Main App component not rendered!');
    } else {
      console.log('[SUCCESS]: Main App component rendered');
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'webapp-debug.png', fullPage: true });
    console.log('[INFO]: Screenshot saved as webapp-debug.png');
    
    // Get page title
    const title = await page.title();
    console.log('[INFO]: Page title:', title);
    
    // Check for specific errors
    const errorMessages = await page.evaluate(() => {
      const errors = [];
      
      // Check for React errors
      if (window.React === undefined) {
        errors.push('React is not loaded');
      }
      
      // Check for console errors
      return errors;
    });
    
    if (errorMessages.length > 0) {
      console.error('[RUNTIME ERRORS]:', errorMessages);
    } else {
      console.log('[SUCCESS]: No obvious runtime errors detected');
    }
    
  } catch (error) {
    console.error('[SCRIPT ERROR]:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

debugApp();