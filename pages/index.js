import Head from 'next/head'
import { useState, useEffect } from 'react'
import DOMPurify from 'isomorphic-dompurify'

export default function Home() {
  const [generatedKban, setGeneratedKban] = useState(null);
  const [resultContent, setResultContent] = useState('');
  const [resultType, setResultType] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showActions, setShowActions] = useState(false);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name="description" content="ApplePaySDK Demo - Simulate Apple Pay, generate K/BAN codes, and download mobile configurations" />
        <title>Apple Pay Demo</title>
        <style>{`
          :root {
            --primary-color: #0070c9;
            --secondary-color: #333;
            --accent-color: #5ac8fa;
            --success-color: #34c759;
            --error-color: #ff3b30;
            --text-color: #fff;
            --background-color: #f5f5f7;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            text-align: center;
            padding: 50px 20px;
            margin: 0;
            background-color: var(--background-color);
            color: var(--secondary-color);
            line-height: 1.5;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
          }
          
          .button {
            font-size: 18px;
            padding: 15px 30px;
            background-color: var(--primary-color);
            color: var(--text-color);
            border: none;
            border-radius: 10px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin: 10px;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
          }
          
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
          }
          
          .button:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .button:focus {
            outline: 2px solid var(--accent-color);
            outline-offset: 2px;
          }
          
          .button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          
          .button img {
            height: 24px;
            margin-right: 10px;
          }
          
          .input-section {
            margin: 30px 0;
            padding: 25px;
            background-color: white;
            border-radius: 15px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          
          .input-section h2 {
            margin-bottom: 15px;
            color: var(--secondary-color);
            font-size: 20px;
            font-weight: 500;
          }
          
          .input-container {
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .pass-input {
            flex: 1;
            min-width: 300px;
            padding: 15px 20px;
            font-size: 16px;
            border: 2px solid #ddd;
            border-radius: 10px;
            background-color: #fafafa;
            transition: all 0.2s ease;
            font-family: monospace;
          }
          
          .pass-input:focus {
            outline: none;
            border-color: var(--accent-color);
            background-color: white;
            box-shadow: 0 0 0 3px rgba(0, 112, 201, 0.1);
          }
          
          .pass-input::placeholder {
            color: #999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }
          
          .integration-info {
            margin-top: 15px;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid var(--accent-color);
          }
          
          .integration-info small {
            color: #666;
            line-height: 1.4;
          }

          .button-container {
            margin-top: 30px;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
          }
          
          h1 {
            margin-bottom: 20px;
            font-weight: 600;
          }
          
          .result {
            margin-top: 30px;
            padding: 20px;
            border-radius: 10px;
            background-color: white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            min-height: 60px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          
          .result.success {
            border-left: 5px solid var(--success-color);
          }
          
          .result.error {
            border-left: 5px solid var(--error-color);
          }
          
          .kban-details {
            margin: 15px 0;
            padding: 15px;
            background: rgba(0, 112, 201, 0.05);
            border-radius: 10px;
            border: 1px solid rgba(0, 112, 201, 0.2);
          }
          
          .kban-details code {
            background: rgba(0, 0, 0, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 14px;
          }
          
          .status-valid {
            color: #38a169;
            font-weight: 500;
          }
          
          .next-steps, .troubleshoot {
            margin-top: 20px;
          }
          
          .next-steps h4, .troubleshoot h4 {
            margin-bottom: 10px;
            color: var(--secondary-color);
            font-size: 16px;
          }
          
          .next-steps ul, .troubleshoot ul {
            list-style: none;
            padding-left: 0;
          }
          
          .next-steps li, .troubleshoot li {
            padding: 5px 0;
            padding-left: 20px;
            position: relative;
          }
          
          .next-steps li:before {
            content: "→";
            position: absolute;
            left: 0;
            color: var(--accent-color);
            font-weight: bold;
          }
          
          .troubleshoot li:before {
            content: "•";
            position: absolute;
            left: 0;
            color: #e53e3e;
            font-weight: bold;
          }

          .hidden {
            display: none;
          }
          
          .spinner {
            width: 24px;
            height: 24px;
            border: 3px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top-color: var(--accent-color);
            animation: spin 1s ease-in-out infinite;
            margin-right: 10px;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            background-color: var(--primary-color);
            color: var(--text-color);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
          }
          
          .notification.show {
            opacity: 1;
            transform: translateY(0);
          }
          
          .notification.success {
            background-color: var(--success-color);
          }
          
          .notification.error {
            background-color: var(--error-color);
          }
          
          @media (max-width: 600px) {
            .button-container {
              flex-direction: column;
              align-items: center;
            }
            
            .button {
              width: 100%;
              max-width: 300px;
            }
          }
        `}</style>
      </Head>

      <div className="container">
        <h1>ApplePaySDK Demo</h1>
        
        <div className="input-section" style={{display: 'block', visibility: 'visible'}}>
          <h2>🍎 Apple Merchant Integration</h2>
          <p>Paste the AMID (Apple Merchant ID) JSON data from reapware after successful merchant provisioning:</p>
          <div className="input-container">
            <textarea 
              id="reapware-pass-input" 
              placeholder='Paste AMID JSON from reapware:
{"amid": "M90160068-4578440258079768", "bank_name": "", "account_number": "0258079768", ...}'
              className="pass-input"
              rows="4"
            ></textarea>
            <button id="process-pass-button" className="button" aria-label="Process Apple Pay AMID">
              <span aria-hidden="true">🔐</span> Validate AMID
            </button>
          </div>
          <div className="integration-info">
            <small>
              <strong>Flow:</strong> Reapware → Apple Pay API → AMID Generation → Merchant Validation → Wallet Integration
            </small>
          </div>
        </div>

        <div className="button-container">
          <button id="pay-button" className="button" aria-label="Simulate Apple Pay payment">
            <span aria-hidden="true">🍎</span> 
            Simulate Apple Pay
          </button>

          <button id="download-config-button" className="button" aria-label="Setup mobile access">
            <span aria-hidden="true">📱</span> Setup Mobile Access
          </button>
          
          <button id="generate-kban-button" className="button" aria-label="Generate a new K/BAN code">
            <span aria-hidden="true">🔑</span> Generate K/BAN
          </button>
        </div>

        {showResult && (
          <div className={`result ${resultType}`}>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(resultContent) }} />
            {showActions && (
              <div className="button-container">
                <button id="create-pass-button" className="button" aria-label="Create Apple Wallet pass">
                  Create Wallet Pass
                </button>
                <button id="copy-kban-button" className="button" aria-label="Copy K/BAN to clipboard">
                  Copy K/BAN
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div id="notification" className="notification" role="alert"></div>
    </>
  )

  // Custom hooks and effects
  useEffect(() => {
    // Notification system
    const showNotification = (message, type = 'info') => {
      const notification = document.getElementById('notification');
      if (notification) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        
        // Remove notification after 3 seconds
        setTimeout(() => {
          notification.classList.remove('show');
        }, 3000);
      }
    };

    // Button loading state handler
    const setButtonLoading = (buttonId, isLoading) => {
      const button = document.getElementById(buttonId);
      if (!button) return;
      
      if (isLoading) {
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        button.prepend(spinner);
        button.disabled = true;
      } else {
        const spinner = button.querySelector('.spinner');
        if (spinner) {
          button.removeChild(spinner);
        }
        button.disabled = false;
      }
    };

    // Display result content
    const displayResult = (content, type = '') => {
      setResultContent(content);
      setResultType(type);
      setShowResult(true);
    };

    // Hide result
    const hideResultDisplay = () => {
      setShowResult(false);
      setShowActions(false);
    };

    // Process AMID validation
    const processAmid = async () => {
      try {
        const passInput = document.getElementById('reapware-pass-input');
        if (!passInput) return;
        
        const passValue = passInput.value.trim();
        
        if (!passValue) {
          throw new Error('Please enter a pass/code from reapware');
        }
        
        // Try to parse JSON if it's in JSON format
        try {
          JSON.parse(passValue);
        } catch (e) {
          // If not valid JSON, check if it's at least a valid string format
          if (!passValue.match(/^[A-Za-z0-9-]+$/)) {
            throw new Error('Please enter valid AMID data');
          }
        }
        
        hideResultDisplay();
        setButtonLoading('process-pass-button', true);
        
        // Validate the pass
        const validateResponse = await fetch('/api/kban/validate', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            // Use environment variable in production
            'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || 'test_api_key_for_development'
          },
          body: JSON.stringify({ kban: passValue })
        });
        
        if (!validateResponse.ok) {
          const errorData = await validateResponse.json();
          throw new Error(errorData.error || `Validation failed with status ${validateResponse.status}`);
        }
        
        const validationData = await validateResponse.json();
        
        if (validationData.valid) {
          const data = validationData.data;
          
          if (data.type === 'amid') {
            // Display AMID merchant data
            showNotification('Apple Merchant ID validated!', 'success');
            displayResult(`
              <h3>✅ Apple Merchant ID (AMID) Validated</h3>
              <div class="kban-details">
                <p><strong>AMID:</strong> <code>${data.amid}</code></p>
                <p><strong>Status:</strong> <span class="status-valid">${data.isValid ? 'Valid Merchant' : 'Pending'}</span></p>
                <p><strong>Account:</strong> ${data.accountNumber}</p>
                <p><strong>Bank Code:</strong> ${data.bankCode}</p>
                <p><strong>Merchant ID:</strong> ${data.merchantId}</p>
              </div>
              <div class="next-steps">
                <h4>Available Actions:</h4>
                <ul>
                  <li>📱 Create Apple Wallet Pass</li>
                  <li>📋 Copy AMID to clipboard</li>
                  <li>💳 Process merchant payment</li>
                  <li>🏪 Configure merchant settings</li>
                </ul>
              </div>
            `, 'success');
            
            // Store the AMID for pass generation
            setGeneratedKban(data.amid);
          } else {
            // Display simple pass validation
            showNotification('Pass validated successfully!', 'success');
            displayResult(`
              <h3>✅ Pass Validated</h3>
              <div class="kban-details">
                <p><strong>Pass:</strong> <code>${data.value}</code></p>
                <p><strong>Status:</strong> <span class="status-valid">Valid</span></p>
              </div>
              <div class="next-steps">
                <h4>Available Actions:</h4>
                <ul>
                  <li>📱 Create Apple Wallet Pass</li>
                  <li>📋 Copy to clipboard</li>
                </ul>
              </div>
            `, 'success');
            
            setGeneratedKban(data.value);
          }
          
          // Show action buttons
          setShowActions(true);
          
          // Clear the input
          passInput.value = '';
        } else {
          showNotification('Invalid K/BAN', 'error');
          displayResult(`
            <h3>❌ K/BAN Validation Failed</h3>
            <p>The K/BAN code is not valid or may have expired.</p>
            <div class="troubleshoot">
              <h4>Troubleshooting:</h4>
              <ul>
                <li>Ensure reapware completed successfully</li>
                <li>Check if K/BAN was copied completely</li>
                <li>Verify Apple Pay provisioning succeeded</li>
              </ul>
            </div>
          `, 'error');
        }
        
      } catch (error) {
        console.error('Error processing pass:', error);
        showNotification('Failed to process pass', 'error');
        displayResult(`<h3>Processing Failed</h3><p>${error.message}</p>`, 'error');
      } finally {
        setButtonLoading('process-pass-button', false);
      }
    };

    // Generate K/BAN
    const generateKban = async () => {
      try {
        hideResultDisplay();
        setButtonLoading('generate-kban-button', true);
        
        const response = await fetch('/api/kban/generate', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || 'test_api_key_for_development'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed with status ${response.status}`);
        }
        
        const data = await response.json();
        showNotification('K/BAN generated successfully', 'success');
        displayResult(`<h3>Generated K/BAN</h3><p id="kban-value">${data.kban}</p><p>Generated at: ${data.timestamp || new Date().toISOString()}</p>`, 'success');
        
        // Show action buttons
        setShowActions(true);
        
        // Store the K/BAN for later use
        setGeneratedKban(data.kban);
      } catch (error) {
        console.error('Error generating K/BAN:', error);
        showNotification('Failed to generate K/BAN', 'error');
        displayResult(`<h3>K/BAN Generation Failed</h3><p>${error.message}</p>`, 'error');
      } finally {
        setButtonLoading('generate-kban-button', false);
      }
    };

    // Download mobile config
    const downloadMobileConfig = () => {
      try {
        hideResultDisplay();
        setButtonLoading('download-config-button', true);
        
        showNotification('Downloading configuration file...', 'info');
        
        // Create a download link instead of iframe
        const link = document.createElement('a');
        link.href = '/api/generate-mobileconfig';
        link.download = 'apple-pay-config.mobileconfig';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => {
          setButtonLoading('download-config-button', false);
          showNotification('Download started', 'success');
          displayResult('<h3>Configuration File</h3><p>Your mobile configuration file download has started.</p>', 'success');
        }, 1000);
      } catch (error) {
        console.error('Download error:', error);
        showNotification('Download failed', 'error');
        displayResult(`<h3>Download Failed</h3><p>${error.message}</p>`, 'error');
        setButtonLoading('download-config-button', false);
      }
    };

    // Create wallet pass
    const createWalletPass = async () => {
      try {
        if (!generatedKban) {
          throw new Error('No K/BAN available');
        }
        
        setButtonLoading('create-pass-button', true);
        showNotification('Creating Apple Wallet pass...', 'info');
        
        // Create a download link instead of iframe
        const link = document.createElement('a');
        link.href = `/api/pass/create?kban=${generatedKban}`;
        link.download = 'apple-wallet-pass.pkpass';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => {
          setButtonLoading('create-pass-button', false);
          showNotification('Pass download started', 'success');
        }, 1000);
      } catch (error) {
        console.error('Error creating pass:', error);
        showNotification('Failed to create pass', 'error');
        setButtonLoading('create-pass-button', false);
      }
    };

    // Copy K/BAN to clipboard
    const copyKbanToClipboard = () => {
      try {
        if (!generatedKban) {
          throw new Error('No K/BAN available to copy');
        }
        
        navigator.clipboard.writeText(generatedKban)
          .then(() => {
            showNotification('K/BAN copied to clipboard', 'success');
          })
          .catch((error) => {
            console.error('Clipboard error:', error);
            showNotification('Failed to copy to clipboard', 'error');
          });
      } catch (error) {
        showNotification(error.message, 'error');
      }
    };

    // Simulate Apple Pay
    const simulateApplePay = () => {
      showNotification('Apple Pay simulation would require real certificates', 'info');
      displayResult('<h3>Apple Pay Demo</h3><p>This would initiate Apple Pay in a real environment with proper certificates.</p>', 'success');
    };

    // Set up event listeners
    const processButton = document.getElementById('process-pass-button');
    if (processButton) {
      processButton.addEventListener('click', processAmid);
    }

    const passInput = document.getElementById('reapware-pass-input');
    if (passInput) {
      passInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          processAmid();
        }
      });
    }

    const generateButton = document.getElementById('generate-kban-button');
    if (generateButton) {
      generateButton.addEventListener('click', generateKban);
    }

    const downloadButton = document.getElementById('download-config-button');
    if (downloadButton) {
      downloadButton.addEventListener('click', downloadMobileConfig);
    }

    const createPassButton = document.getElementById('create-pass-button');
    if (createPassButton) {
      createPassButton.addEventListener('click', createWalletPass);
    }

    const copyButton = document.getElementById('copy-kban-button');
    if (copyButton) {
      copyButton.addEventListener('click', copyKbanToClipboard);
    }

    const payButton = document.getElementById('pay-button');
    if (payButton) {
      payButton.addEventListener('click', simulateApplePay);
    }

    // Cleanup function to remove event listeners
    return () => {
      if (processButton) processButton.removeEventListener('click', processAmid);
      if (passInput) passInput.removeEventListener('keypress', processAmid);
      if (generateButton) generateButton.removeEventListener('click', generateKban);
      if (downloadButton) downloadButton.removeEventListener('click', downloadMobileConfig);
      if (createPassButton) createPassButton.removeEventListener('click', createWalletPass);
      if (copyButton) copyButton.removeEventListener('click', copyKbanToClipboard);
      if (payButton) payButton.removeEventListener('click', simulateApplePay);
    };
  }, [generatedKban]); // Re-run effect when generatedKban changes
}