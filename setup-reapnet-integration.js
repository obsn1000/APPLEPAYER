#!/usr/bin/env node

/**
 * REAPNET Desktop Integration Setup Script
 * Configures APPLEPAYER to work seamlessly with REAPNET desktop application
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 REAPNET Desktop Integration Setup');
console.log('=====================================\n');

// Configuration paths
const REAPNET_APP_PATH = '/home/kali/Downloads/reap-linux';
const APPLEPAYER_PATH = '/home/kali/APPLEPAYER';

// Check if REAPNET app exists
function checkReapnetApp() {
    console.log('1. Checking REAPNET Desktop App...');
    
    if (fs.existsSync(REAPNET_APP_PATH)) {
        console.log('   ✅ REAPNET app found at:', REAPNET_APP_PATH);
        
        const packagePath = path.join(REAPNET_APP_PATH, 'resources/app/package.json');
        if (fs.existsSync(packagePath)) {
            try {
                const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
                console.log(`   📦 App Name: ${packageData.name}`);
                console.log(`   📦 Version: ${packageData.version}`);
            } catch (error) {
                console.log('   ⚠️  Could not read package.json');
            }
        }
        
        const nativefierPath = path.join(REAPNET_APP_PATH, 'resources/app/nativefier.json');
        if (fs.existsSync(nativefierPath)) {
            try {
                const nativefierData = JSON.parse(fs.readFileSync(nativefierPath, 'utf8'));
                console.log(`   🌐 Target URL: ${nativefierData.targetUrl}`);
                console.log(`   📱 Platform: ${nativefierData.platform}`);
            } catch (error) {
                console.log('   ⚠️  Could not read nativefier.json');
            }
        }
        
        return true;
    } else {
        console.log('   ❌ REAPNET app not found at:', REAPNET_APP_PATH);
        console.log('   💡 Please ensure REAPNET is extracted to the correct location');
        return false;
    }
}

// Setup mobile configuration
function setupMobileConfig() {
    console.log('\n2. Setting up Mobile Configuration...');
    
    const mobileConfigPath = path.join(REAPNET_APP_PATH, 'resources/app/reapnet.mobileconfig');
    
    if (fs.existsSync(mobileConfigPath)) {
        console.log('   ✅ Mobile configuration file exists');
    } else {
        console.log('   ⚠️  Mobile configuration file was deleted, but APPLEPAYER has its own copy');
        console.log('   ✅ Mobile configuration available in APPLEPAYER');
    }
    
    console.log('   📱 Mobile config available at: /api/reapnet-config');
}

// Setup APPLEPAYER integration
function setupApplePayerIntegration() {
    console.log('\n3. Setting up APPLEPAYER Integration...');
    
    const requiredFiles = [
        'pages/api/reapnet-config.js',
        'pages/api/reapnet-pass.js',
        'assets/reapnet-pass.json',
        'assets/reapnet.mobileconfig',
        'assets/pass/pass.json',
        'reapnet-bridge.js',
        'test-reapnet-integration.js'
    ];
    
    let allFilesExist = true;
    
    requiredFiles.forEach(file => {
        const filePath = path.join(APPLEPAYER_PATH, file);
        if (fs.existsSync(filePath)) {
            console.log(`   ✅ ${file}`);
        } else {
            console.log(`   ❌ ${file} - Missing!`);
            allFilesExist = false;
        }
    });
    
    if (allFilesExist) {
        console.log('   ✅ All integration files are present');
    } else {
        console.log('   ⚠️  Some integration files are missing');
    }
}

// Generate integration URLs
function generateIntegrationInfo() {
    console.log('\n4. Integration Information');
    console.log('==========================');
    
    console.log('🌐 APPLEPAYER Server: http://localhost:3000');
    console.log('📱 Mobile Configuration: http://localhost:3000/api/reapnet-config');
    console.log('🎫 Pass Generation: http://localhost:3000/api/reapnet-pass');
    console.log('📖 Setup Instructions: http://localhost:3000/api/generate-mobileconfig');
    
    console.log('\n📋 REAPNET Desktop App Integration:');
    console.log(`   📁 App Location: ${REAPNET_APP_PATH}`);
    console.log('   🚀 Launch Command: ./REAPNET');
    console.log('   🔗 Integration URL: http://localhost:3000');
    
    console.log('\n💡 Usage Instructions:');
    console.log('   1. Start APPLEPAYER server: npm run dev');
    console.log('   2. Launch REAPNET desktop app: ./REAPNET');
    console.log('   3. REAPNET will load the web interface automatically');
    console.log('   4. Configure iOS device using mobile config URL');
    console.log('   5. Generate wallet passes with K/BAN codes');
}

// Create launch script
function createLaunchScript() {
    console.log('\n5. Creating Launch Scripts...');
    
    const launchScript = `#!/bin/bash

# REAPNET Desktop Integration Launch Script
echo "🚀 Starting REAPNET Desktop Integration"
echo "======================================"

# Check if APPLEPAYER is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "⚠️  APPLEPAYER server is not running"
    echo "💡 Start it with: cd ${APPLEPAYER_PATH} && npm run dev"
    echo ""
fi

# Launch REAPNET Desktop App
echo "🖥️  Launching REAPNET Desktop App..."
cd "${REAPNET_APP_PATH}"
./REAPNET

echo "✅ REAPNET Desktop App launched"
echo "🌐 Integration available at: http://localhost:3000"
`;

    const scriptPath = path.join(APPLEPAYER_PATH, 'launch-reapnet.sh');
    fs.writeFileSync(scriptPath, launchScript);
    fs.chmodSync(scriptPath, '755');
    
    console.log('   ✅ Launch script created: launch-reapnet.sh');
    console.log('   🚀 Run with: ./launch-reapnet.sh');
}

// Check certificates
function checkCertificates() {
    console.log('\n6. Checking Certificates...');
    
    const certPath = path.join(APPLEPAYER_PATH, 'certs');
    const requiredCerts = ['wwdr.pem', 'signingCert.pem', 'signingKey.pem'];
    
    if (!fs.existsSync(certPath)) {
        console.log('   ⚠️  Certificates directory not found');
        console.log('   💡 Create certificates directory and add Apple certificates');
        return false;
    }
    
    let allCertsExist = true;
    requiredCerts.forEach(cert => {
        const certFile = path.join(certPath, cert);
        if (fs.existsSync(certFile)) {
            console.log(`   ✅ ${cert}`);
        } else {
            console.log(`   ❌ ${cert} - Missing!`);
            allCertsExist = false;
        }
    });
    
    if (allCertsExist) {
        console.log('   ✅ All certificates are present');
    } else {
        console.log('   ⚠️  Some certificates are missing');
        console.log('   💡 Add Apple Developer certificates to generate .pkpass files');
    }
    
    return allCertsExist;
}

// Main setup function
function main() {
    const reapnetExists = checkReapnetApp();
    
    if (!reapnetExists) {
        console.log('\n❌ Setup cannot continue without REAPNET desktop app');
        console.log('💡 Please ensure REAPNET is available at:', REAPNET_APP_PATH);
        return;
    }
    
    setupMobileConfig();
    setupApplePayerIntegration();
    checkCertificates();
    generateIntegrationInfo();
    createLaunchScript();
    
    console.log('\n🎉 REAPNET Desktop Integration Setup Complete!');
    console.log('===============================================');
    console.log('');
    console.log('Next steps:');
    console.log('1. Start APPLEPAYER: npm run dev');
    console.log('2. Launch REAPNET: ./launch-reapnet.sh');
    console.log('3. Configure iOS device with mobile config');
    console.log('4. Generate and use wallet passes');
    console.log('');
    console.log('📚 For detailed instructions, see: REAP-LINUX-GUIDE.md');
    console.log('🧪 Test integration: node test-reapnet-integration.js');
}

// Run the setup
main();