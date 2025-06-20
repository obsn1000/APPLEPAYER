#!/usr/bin/env node

/**
 * REAPNET Bridge Script
 * Helps integrate REAPNET output with APPLEPAYER
 */

const fs = require('fs');
const path = require('path');

console.log('🔗 REAPNET-APPLEPAYER Bridge');
console.log('============================');

// Check if REAPNET output file exists
const reapnetOutputPath = process.argv[2] || '/tmp/reapnet-output.json';

if (fs.existsSync(reapnetOutputPath)) {
    try {
        const reapnetData = JSON.parse(fs.readFileSync(reapnetOutputPath, 'utf8'));
        console.log('✅ Found REAPNET output data');
        
        // Extract AMID if present
        if (reapnetData.amid) {
            console.log(`📱 AMID: ${reapnetData.amid}`);
            console.log(`🏦 Bank: ${reapnetData.bank_name || 'Unknown'}`);
            console.log(`🔢 Account: ${reapnetData.account_number || 'N/A'}`);
            
            // Save for APPLEPAYER
            const applePayData = {
                amid: reapnetData.amid,
                bank_name: reapnetData.bank_name,
                account_number: reapnetData.account_number,
                bank_code: reapnetData.bank_code,
                country: reapnetData.country,
                amid_isvalid: reapnetData.amid_isvalid,
                timestamp: new Date().toISOString()
            };
            
            fs.writeFileSync('/tmp/applepay-input.json', JSON.stringify(applePayData, null, 2));
            console.log('💾 Saved data for APPLEPAYER at /tmp/applepay-input.json');
            console.log('\n📋 Copy this JSON to APPLEPAYER:');
            console.log(JSON.stringify(applePayData, null, 2));
        }
        
    } catch (error) {
        console.error('❌ Error processing REAPNET data:', error.message);
    }
} else {
    console.log('ℹ️  Usage: node reapnet-bridge.js [path-to-reapnet-output.json]');
    console.log('ℹ️  Or run REAPNET and save output to /tmp/reapnet-output.json');
}

console.log('\n🌐 APPLEPAYER is running at: http://localhost:3000');
console.log('📱 Paste the JSON data into the AMID input field');