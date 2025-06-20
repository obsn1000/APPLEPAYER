#!/usr/bin/env node

/**
 * Test script for REAPNET integration
 * Verifies that all endpoints and files are working correctly
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing REAPNET Integration');
console.log('==============================\n');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_KBAN = 'TEST123456789';

// Test functions
async function testEndpoint(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'REAPNET-Test/1.0'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: body
                });
            });
        });

        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

async function runTests() {
    console.log('1. Testing Mobile Configuration Endpoint...');
    try {
        const response = await testEndpoint(`${BASE_URL}/api/reapnet-config`);
        if (response.statusCode === 200) {
            console.log('   ✅ REAPNET Config endpoint working');
            console.log(`   📄 Content-Type: ${response.headers['content-type']}`);
        } else {
            console.log(`   ❌ REAPNET Config failed: ${response.statusCode}`);
        }
    } catch (error) {
        console.log(`   ❌ REAPNET Config error: ${error.message}`);
    }

    console.log('\n2. Testing General Mobile Config Endpoint...');
    try {
        const response = await testEndpoint(`${BASE_URL}/api/generate-mobileconfig`);
        if (response.statusCode === 200) {
            console.log('   ✅ General mobile config working');
            console.log(`   📄 Content-Type: ${response.headers['content-type']}`);
        } else {
            console.log(`   ❌ General mobile config failed: ${response.statusCode}`);
        }
    } catch (error) {
        console.log(`   ❌ General mobile config error: ${error.message}`);
    }

    console.log('\n3. Testing Wallet Pass Generation...');
    try {
        const response = await testEndpoint(`${BASE_URL}/api/reapnet-pass`, 'POST', {
            kban: TEST_KBAN,
            deviceId: 'test-device-123',
            reapnetId: 'test-session-456'
        });
        if (response.statusCode === 200) {
            console.log('   ✅ REAPNET Pass generation working');
            console.log(`   📄 Content-Type: ${response.headers['content-type']}`);
        } else {
            console.log(`   ❌ REAPNET Pass failed: ${response.statusCode}`);
            console.log(`   📝 Response: ${response.body.substring(0, 200)}...`);
        }
    } catch (error) {
        console.log(`   ❌ REAPNET Pass error: ${error.message}`);
    }

    console.log('\n4. Checking Required Files...');
    const requiredFiles = [
        'assets/reapnet.mobileconfig',
        'assets/pass/pass.json',
        'pages/api/reapnet-config.js',
        'pages/api/reapnet-pass.js',
        'pages/api/generate-mobileconfig.js',
        'reapnet-bridge.js'
    ];

    requiredFiles.forEach(file => {
        const fullPath = path.join(__dirname, file);
        if (fs.existsSync(fullPath)) {
            console.log(`   ✅ ${file}`);
        } else {
            console.log(`   ❌ ${file} - Missing!`);
        }
    });

    console.log('\n5. Testing Main App Endpoint...');
    try {
        const response = await testEndpoint(BASE_URL);
        if (response.statusCode === 200) {
            console.log('   ✅ Main app endpoint working');
        } else {
            console.log(`   ❌ Main app failed: ${response.statusCode}`);
        }
    } catch (error) {
        console.log(`   ❌ Main app error: ${error.message}`);
    }

    console.log('\n📋 Integration Test Summary');
    console.log('============================');
    console.log('🔗 REAPNET Desktop App should load: http://localhost:3000');
    console.log('📱 iOS Mobile Config: http://localhost:3000/api/reapnet-config');
    console.log('🎫 Pass Generation: POST to http://localhost:3000/api/reapnet-pass');
    console.log('📖 Setup Instructions: http://localhost:3000/api/generate-mobileconfig');
    
    console.log('\n💡 Next Steps:');
    console.log('1. Start APPLEPAYER: npm run dev');
    console.log('2. Launch REAPNET desktop app');
    console.log('3. Configure iOS device using mobile config');
    console.log('4. Generate wallet passes with K/BAN codes');
}

// Check if server is running
console.log('🔍 Checking if APPLEPAYER server is running...');
testEndpoint(BASE_URL)
    .then(() => {
        console.log('✅ Server is running, starting tests...\n');
        runTests();
    })
    .catch(() => {
        console.log('❌ Server is not running!');
        console.log('💡 Start the server with: npm run dev');
        console.log('   Then run this test again.\n');
    });