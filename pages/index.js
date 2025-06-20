import Head from 'next/head'
import { useState, useEffect } from 'react'
import DOMPurify from 'isomorphic-dompurify'

export default function Home() {
  const [generatedKban, setGeneratedKban] = useState(null);
  const [resultContent, setResultContent] = useState('');
  const [resultType, setResultType] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Generate a new K/BAN
  const generateKban = async () => {
    try {
      setResultContent('Generating K/BAN...');
      setResultType('success');
      setShowResult(true);
      
      const response = await fetch('/api/kban/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      if (data.kban) {
        setGeneratedKban(data.kban);
        setResultContent(`<h3>✅ K/BAN Generated Successfully</h3><pre>${data.kban}</pre>`);
        setShowActions(true);
      } else {
        setResultContent('<h3>❌ Failed to generate K/BAN</h3>');
        setResultType('error');
      }
    } catch (error) {
      setResultContent(`<h3>❌ Error generating K/BAN</h3><p>${error.message}</p>`);
      setResultType('error');
    }
  };

  // Generate a PKPass for a K/BAN
  const createPass = async (kban) => {
    try {
      setResultContent('Creating Apple Wallet pass...');
      setResultType('success');
      setShowResult(true);
      
      const response = await fetch('/api/pass/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kban })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${kban}.pkpass`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        
        setResultContent('<h3>✅ Apple Wallet Pass Created</h3><p>Download should start automatically.</p>');
      } else {
        setResultContent('<h3>❌ Failed to generate PKPass</h3>');
        setResultType('error');
      }
    } catch (error) {
      setResultContent(`<h3>❌ Error creating pass</h3><p>${error.message}</p>`);
      setResultType('error');
    }
  };

  // Process AMID data
  const processAmid = async () => {
    const input = document.getElementById('reapware-pass-input');
    let amidData = input.value.trim();
    
    if (!amidData) {
      setResultContent('<h3>❌ Please enter AMID data</h3>');
      setResultType('error');
      setShowResult(true);
      return;
    }

    // Add braces if missing
    if (!amidData.startsWith('{')) {
      amidData = '{' + amidData + '}';
    }

    // Clean up JSON formatting
    amidData = amidData
      .replace(/'/g, '"')
      .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
      .replace(/:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*([,}])/g, ': "$1"$2')
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .replace(/("amid_isvalid"\s*:\s*"Valid"\s*,\s*)"amid_isvalid"(\s*:\s*"[^"]*")/g, '$1"merchant_id"$2');

    try {
      const parsedData = JSON.parse(amidData);
      
      // Validate AMID structure
      if (!parsedData.amid) {
        setResultContent('<h3>❌ Invalid AMID format</h3><p>Missing "amid" field in JSON data.</p>');
        setResultType('error');
        setShowResult(true);
        return;
      }

      // Validate AMID format (M + digits + dash + digits)
      const amidPattern = /^M\d+-\d+$/;
      if (!amidPattern.test(parsedData.amid)) {
        setResultContent('<h3>❌ Invalid AMID format</h3><p>AMID should be in format: M[numbers]-[numbers]</p>');
        setResultType('error');
        setShowResult(true);
        return;
      }

      // Success - show validated data
      setResultContent(`<h3>✅ AMID Validated Successfully</h3>
        <div style="margin: 15px 0;">
          <strong>AMID:</strong> ${parsedData.amid}<br>
          <strong>Account:</strong> ${parsedData.account_number || 'N/A'}<br>
          <strong>Bank Code:</strong> ${parsedData.bank_code || 'N/A'}<br>
          <strong>Status:</strong> ${parsedData.amid_isvalid || 'Unknown'}<br>
          <strong>Merchant ID:</strong> ${parsedData.merchant_id || 'N/A'}
        </div>
        <details>
          <summary>View Full JSON Data</summary>
          <pre>${JSON.stringify(parsedData, null, 2)}</pre>
        </details>`);
      setResultType('success');
      setShowResult(true);
      
    } catch (error) {
      setResultContent(`<h3>❌ Invalid JSON format</h3>
        <p><strong>Error:</strong> ${error.message}</p>
        <p><strong>Tips:</strong></p>
        <ul>
          <li>Make sure all keys and string values are in double quotes</li>
          <li>Remove any trailing commas</li>
          <li>Check for missing brackets or braces</li>
        </ul>
        <details>
          <summary>Your Input (first 200 chars)</summary>
          <pre>${amidData.substring(0, 200)}${amidData.length > 200 ? '...' : ''}</pre>
        </details>`);
      setResultType('error');
      setShowResult(true);
    }
  };

  // Simulate Apple Pay
  const simulateApplePay = async () => {
    setResultContent('<h3>🍎 Simulating Apple Pay...</h3><p>Processing payment request...</p>');
    setResultType('success');
    setShowResult(true);
    
    setTimeout(() => {
      setResultContent('<h3>✅ Apple Pay Simulation Complete</h3><p>Payment would be processed in a real environment.</p>');
    }, 2000);
  };

  // Download mobile config - CRITICAL FUNCTION
  const downloadMobileConfig = async () => {
    try {
      setResultContent('Opening mobile setup instructions...');
      setResultType('success');
      setShowResult(true);
      
      // Open the mobile config page in a new window/tab
      window.open('/api/generate-mobileconfig', '_blank');
      
      setResultContent('<h3>✅ Mobile Setup Instructions Opened</h3><p>A new tab has opened with mobile setup instructions. Follow the steps to add ApplePaySDK to your home screen.</p>');
      
    } catch (error) {
      setResultContent(`<h3>❌ Error opening mobile setup</h3><p>${error.message}</p>`);
      setResultType('error');
    }
  };

  // Copy K/BAN to clipboard
  const copyKban = async () => {
    if (generatedKban) {
      try {
        await navigator.clipboard.writeText(generatedKban);
        setResultContent(resultContent + '<p><strong>✅ K/BAN copied to clipboard!</strong></p>');
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

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
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 10px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
            font-weight: 500;
          }
          
          .button:hover {
            background-color: #005bb5;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 112, 201, 0.3);
          }
          
          .button:active {
            transform: translateY(0);
          }
          
          .button-container {
            margin: 30px 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
          }
          
          .pass-input {
            width: 100%;
            max-width: 500px;
            height: 120px;
            padding: 15px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            resize: vertical;
            background-color: #f9f9f9;
            margin-bottom: 15px;
          }
          
          .pass-input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(0, 112, 201, 0.1);
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
          }
          
          .integration-info {
            margin-top: 15px;
            padding: 10px;
            background-color: #f0f8ff;
            border-radius: 8px;
            border-left: 4px solid var(--primary-color);
          }
          
          .result {
            margin: 30px 0;
            padding: 20px;
            border-radius: 10px;
            text-align: left;
            max-width: 100%;
            overflow-wrap: break-word;
          }
          
          .result.success {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
          }
          
          .result.error {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
          }
          
          .result pre {
            background-color: rgba(0, 0, 0, 0.05);
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            font-size: 12px;
            margin: 10px 0;
          }
          
          .result h3 {
            margin-top: 0;
            color: inherit;
          }
          
          .result ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          
          .result li {
            margin: 5px 0;
          }
          
          .result strong {
            font-weight: 600;
          }
          
          h1 {
            color: var(--secondary-color);
            margin-bottom: 20px;
            font-size: 2.5em;
            font-weight: 300;
          }
          
          .logo {
            width: 60px;
            height: 60px;
            margin: 0 auto 20px;
            display: block;
          }
          
          @media (max-width: 768px) {
            body {
              padding: 20px 10px;
            }
            
            .button {
              font-size: 16px;
              padding: 12px 20px;
              margin: 5px;
            }
            
            .button-container {
              flex-direction: column;
              align-items: center;
            }
            
            .pass-input {
              font-size: 12px;
            }
            
            h1 {
              font-size: 2em;
            }
            
            .input-container {
              flex-direction: column;
              align-items: stretch;
            }
            
            .input-section {
              padding: 20px;
            }
          }
          
          @media (max-width: 480px) {
            .container {
              padding: 0 10px;
            }
            
            .input-section {
              margin: 20px 0;
              padding: 15px;
            }
            
            .pass-input {
              height: 100px;
            }
          }
        `}</style>
      </Head>

      <div className="container">
        <h1>ApplePaySDK Demo</h1>
        
        <div className="input-section">
          <h2>🍎 Apple Merchant Integration</h2>
          <p>Paste the AMID (Apple Merchant ID) JSON data from reapware after successful merchant provisioning:</p>
          <div className="input-container">
            <textarea 
              id="reapware-pass-input" 
              placeholder='Paste AMID JSON from reapware:
{
  "amid": "M32662659-1976148969917405",
  "bank_name": "",
  "account_number": "8969917405",
  "bank_code": "M32",
  "country": "",
  "checksum": "",
  "bban": "",
  "amid_isvalid": "Valid",
  "merchant_id": "merchant.APPLEPAYER"
}'
              className="pass-input"
              rows="6"
            ></textarea>
            <button id="process-pass-button" className="button" aria-label="Process Apple Pay AMID" onClick={processAmid}>
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
          <button id="pay-button" className="button" aria-label="Simulate Apple Pay payment" onClick={simulateApplePay}>
            <span aria-hidden="true">🍎</span> 
            Simulate Apple Pay
          </button>

          <button id="download-config-button" className="button" aria-label="Setup mobile access" onClick={downloadMobileConfig}>
            <span aria-hidden="true">📱</span> Setup Mobile Access
          </button>
          
          <button id="generate-kban-button" className="button" aria-label="Generate a new K/BAN code" onClick={generateKban}>
            <span aria-hidden="true">🔑</span> Generate K/BAN
          </button>
        </div>

        {showResult && (
          <div className={`result ${resultType}`}>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(resultContent) }} />
            {showActions && (
              <div className="button-container">
                <button id="create-pass-button" className="button" aria-label="Create Apple Wallet pass" onClick={() => createPass(generatedKban)}>
                  Create Wallet Pass
                </button>
                <button id="copy-kban-button" className="button" aria-label="Copy K/BAN to clipboard" onClick={copyKban}>
                  Copy K/BAN
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}