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
        a.download = `kban-${kban.substring(0, 8)}.pkpass`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        setResultContent('<h3>✅ Apple Wallet Pass Created</h3><p>Pass downloaded successfully!</p>');
      } else {
        const errorData = await response.json();
        setResultContent(`<h3>❌ Failed to create pass</h3><p>${errorData.error}</p>`);
        setResultType('error');
      }
    } catch (error) {
      setResultContent(`<h3>❌ Error creating pass</h3><p>${error.message}</p>`);
      setResultType('error');
    }
  };

  // Download mobile configuration
  const downloadMobileConfig = async () => {
    try {
      setResultContent('Generating mobile configuration...');
      setResultType('success');
      setShowResult(true);
      
      const response = await fetch('/api/generate-mobileconfig');
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'applepay-setup.mobileconfig';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        setResultContent('<h3>✅ Mobile Configuration Downloaded</h3><p>Install the profile on your iOS device to enable Apple Pay integration.</p>');
      } else {
        setResultContent('<h3>❌ Failed to generate mobile configuration</h3>');
        setResultType('error');
      }
    } catch (error) {
      setResultContent(`<h3>❌ Error downloading configuration</h3><p>${error.message}</p>`);
      setResultType('error');
    }
  };

  // Initiate Apple Pay card addition
  const initiateApplePayCardAddition = async () => {
    try {
      setResultContent('Initiating Apple Pay card addition...');
      setResultType('success');
      setShowResult(true);
      
      // Check if Apple Pay is available
      if (!window.ApplePaySession || !ApplePaySession.canMakePayments()) {
        setResultContent('<h3>❌ Apple Pay Not Available</h3><p>Apple Pay is not supported on this device or browser.</p>');
        setResultType('error');
        return;
      }
      
      // For card provisioning, we need to use the PassKit JS API
      // This is a simplified version - actual implementation would require proper merchant setup
      const response = await fetch('/api/provision-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'provision',
          deviceId: navigator.userAgent 
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResultContent('<h3>✅ Card Addition Initiated</h3><p>Follow the prompts to add your card to Apple Pay.</p>');
      } else {
        setResultContent(`<h3>❌ Card Addition Failed</h3><p>${data.error}</p>`);
        setResultType('error');
      }
    } catch (error) {
      setResultContent(`<h3>❌ Error initiating card addition</h3><p>${error.message}</p>`);
      setResultType('error');
    }
  };

  return (
    <div className="container">
      <Head>
        <title>APPLEPAYER - Apple Pay Integration</title>
        <meta name="description" content="Apple Pay integration with K/BAN support" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="main">
        <h1 className="title">
          🍎 APPLEPAYER
        </h1>
        
        <p className="description">
          Apple Pay Integration with K/BAN Support
        </p>

        <div className="input-section">
          <h2>🔑 K/BAN Generation</h2>
          <p>Generate a new K/BAN code for Apple Pay integration:</p>
          <div className="button-container">
            <button onClick={generateKban} className="button">
              <span aria-hidden="true">🔑</span> Generate K/BAN
            </button>
          </div>
        </div>

        {showResult && (
          <div className={`result ${resultType}`}>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(resultContent) }} />
            
            {showActions && generatedKban && (
              <div className="action-buttons">
                <button onClick={() => createPass(generatedKban)} className="button">
                  <span aria-hidden="true">📱</span> Create Wallet Pass
                </button>
                <button onClick={() => navigator.clipboard.writeText(generatedKban)} className="button">
                  <span aria-hidden="true">📋</span> Copy K/BAN
                </button>
              </div>
            )}
          </div>
        )}

        <div className="input-section">
          <h2>📱 Mobile Setup</h2>
          <p>Download and install the mobile configuration profile to enable Apple Pay on iOS:</p>
          <div className="button-container">
            <button onClick={downloadMobileConfig} className="button">
              <span aria-hidden="true">📱</span> Setup Mobile Access
            </button>
          </div>
          <div className="integration-info">
            <small>
              <strong>Instructions:</strong> Download the .mobileconfig file and open it on your iOS device to install the Apple Pay configuration.
            </small>
          </div>
        </div>

        <div className="input-section">
          <h2>🍎 Apple Pay Integration</h2>
          <p>Add your card to Apple Pay for seamless payments:</p>
          <div className="button-container">
            <button onClick={initiateApplePayCardAddition} className="button">
              <span aria-hidden="true">🍎</span> Add Card to Apple Pay
            </button>
          </div>
          <div className="integration-info">
            <small>
              <strong>Requirements:</strong> iOS device with Apple Pay support, valid payment card, and merchant configuration.
            </small>
          </div>
        </div>

        <div className="input-section">
          <h2>🔧 Reapware Integration</h2>
          <p>Connect with Reapware for advanced Apple Pay merchant services:</p>
          <div className="button-container">
            <button onClick={() => window.open('https://reapware.com', '_blank')} className="button">
              <span aria-hidden="true">🔧</span> Open Reapware
            </button>
          </div>
          <div className="integration-info">
            <small>
              <strong>Flow:</strong> Reapware → Apple Pay API → AMID Generation → Merchant Validation → Wallet Integration
            </small>
          </div>
        </div>

        <div className="input-section">
          <h2>🔗 REAPNET Integration</h2>
          <p>Connect with REAPNET desktop application for seamless K/BAN and Apple Pay integration:</p>
          <div className="button-container">
            <a href="/reapnet.html" className="button" target="_blank">
              <span aria-hidden="true">🖥️</span> Open REAPNET Interface
            </a>
            <button onClick={() => window.open('/api/reapnet-config', '_blank')} className="button">
              <span aria-hidden="true">📄</span> Download REAPNET Config
            </button>
          </div>
          <div className="integration-info">
            <small>
              <strong>REAPNET Flow:</strong> Desktop App → K/BAN Generation → Mobile Config → Wallet Pass → Apple Pay Integration
            </small>
          </div>
        </div>

        <div className="button-container">
          <button id="pay-button" className="button" aria-label="Add Card to Apple Pay" onClick={initiateApplePayCardAddition}>
            <span aria-hidden="true">🍎</span> 
            Add Card to Apple Pay
          </button>

          <button id="download-config-button" className="button" aria-label="Setup mobile access" onClick={downloadMobileConfig}>
            <span aria-hidden="true">📱</span> Setup Mobile Access
          </button>
          
          <button id="generate-kban-button" className="button" aria-label="Generate a new K/BAN code" onClick={generateKban}>
            <span aria-hidden="true">🔑</span> Generate K/BAN
          </button>
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-width: 800px;
          width: 100%;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
          text-align: center;
          color: white;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .description {
          text-align: center;
          line-height: 1.5;
          font-size: 1.5rem;
          color: rgba(255,255,255,0.8);
          margin-bottom: 2rem;
        }

        .input-section {
          background: rgba(255,255,255,0.95);
          border-radius: 15px;
          padding: 2rem;
          margin: 1rem 0;
          width: 100%;
          max-width: 600px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          backdrop-filter: blur(10px);
        }

        .input-section h2 {
          color: #333;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .input-section p {
          color: #666;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .button-container {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          margin: 2rem 0;
        }

        .button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }

        .button:active {
          transform: translateY(0);
        }

        .result {
          background: rgba(255,255,255,0.95);
          border-radius: 15px;
          padding: 2rem;
          margin: 2rem 0;
          width: 100%;
          max-width: 600px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          backdrop-filter: blur(10px);
        }

        .result.success {
          border-left: 5px solid #4CAF50;
        }

        .result.error {
          border-left: 5px solid #f44336;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .integration-info {
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(0,0,0,0.05);
          border-radius: 8px;
        }

        .integration-info small {
          color: #666;
          line-height: 1.4;
        }

        pre {
          background: #f5f5f5;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.9rem;
        }

        @media (max-width: 600px) {
          .title {
            font-size: 2.5rem;
          }
          
          .input-section {
            padding: 1.5rem;
            margin: 0.5rem;
          }
          
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
    </div>
  )
}