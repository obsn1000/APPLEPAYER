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
    </>
  )
}