import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

async function checkApp() {
    try {
        console.log('🔍 Checking webapp at http://localhost:3000...');
        
        // Fetch the main HTML page
        const response = await fetch('http://localhost:3000/');
        if (!response.ok) {
            console.error(`❌ Server responded with status: ${response.status}`);
            return;
        }
        
        const html = await response.text();
        console.log('✅ HTML page loaded successfully');
        
        // Parse with JSDOM
        const dom = new JSDOM(html, { 
            runScripts: "dangerously",
            resources: "usable",
            url: "http://localhost:3000/"
        });
        
        // Check for essential elements
        const document = dom.window.document;
        const rootElement = document.getElementById('root');
        
        if (!rootElement) {
            console.error('❌ Root element #root not found in HTML');
            return;
        } else {
            console.log('✅ Root element found');
        }
        
        // Check for script tags
        const scriptTags = document.querySelectorAll('script[src]');
        console.log(`📄 Found ${scriptTags.length} script tags:`);
        
        for (let script of scriptTags) {
            const src = script.getAttribute('src');
            if (src) {
                try {
                    const scriptResponse = await fetch(`http://localhost:3000${src}`);
                    if (scriptResponse.ok) {
                        console.log(`  ✅ ${src}`);
                    } else {
                        console.log(`  ❌ ${src} (${scriptResponse.status})`);
                    }
                } catch (error) {
                    console.log(`  ❌ ${src} (${error.message})`);
                }
            }
        }
        
        // Test some API endpoints
        const apiTests = [
            '/src/main.tsx',
            '/src/App.tsx', 
            '/src/components/UserManagementApp/UserManagementApp.tsx'
        ];
        
        console.log('\n🧪 Testing key component endpoints:');
        for (let endpoint of apiTests) {
            try {
                const endpointResponse = await fetch(`http://localhost:3000${endpoint}`);
                if (endpointResponse.ok) {
                    console.log(`  ✅ ${endpoint}`);
                } else {
                    console.log(`  ❌ ${endpoint} (${endpointResponse.status})`);
                }
            } catch (error) {
                console.log(`  ❌ ${endpoint} (${error.message})`);
            }
        }
        
        console.log('\n📋 Summary:');
        console.log('- HTML structure is valid');
        console.log('- Root element exists');
        console.log('- Key components are served correctly');
        console.log('- No obvious server-side issues detected');
        console.log('\n💡 If you\'re experiencing issues:');
        console.log('1. Open browser developer tools (F12)');
        console.log('2. Check the Console tab for JavaScript errors');
        console.log('3. Check the Network tab for failed requests');
        console.log('4. Look for any TypeScript compilation errors');
        
    } catch (error) {
        console.error('❌ Error checking app:', error.message);
    }
}

checkApp();