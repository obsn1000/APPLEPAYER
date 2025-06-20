"use strict";
(() => {
var exports = {};
exports.id = 99;
exports.ids = [99];
exports.modules = {

/***/ 635:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/**
 * Generates a mobile configuration file for iOS devices
 * This allows for easier configuration of Apple Pay settings
 * 
 * @param {NextApiRequest} req - The Next.js API request object
 * @param {NextApiResponse} res - The Next.js API response object
 */ function handler(req, res) {
    try {
        // Only allow GET requests
        if (req.method !== "GET") {
            return res.status(405).json({
                error: "Method not allowed"
            });
        }
        // For development - redirect to add to home screen instead of unsigned profile
        // This avoids signature validation issues
        const baseUrl = req.headers.host ? `https://${req.headers.host}` : "https://applepaysdk.vercel.app";
        // Return HTML with instructions instead of .mobileconfig
        const instructionHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ApplePaySDK - Mobile Setup</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
                padding: 20px; 
                max-width: 500px; 
                margin: 0 auto;
                background: #f5f5f7;
            }
            .card {
                background: white;
                border-radius: 12px;
                padding: 24px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-bottom: 16px;
            }
            .button {
                display: inline-block;
                background: #007AFF;
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                text-decoration: none;
                text-align: center;
                font-weight: 500;
                margin: 8px 0;
                width: 100%;
                box-sizing: border-box;
            }
            .step {
                margin: 12px 0;
                padding: 12px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #007AFF;
            }
            .emoji { font-size: 24px; margin-right: 8px; }
        </style>
    </head>
    <body>
        <div class="card">
            <h1><span class="emoji">🍎</span>ApplePaySDK Mobile</h1>
            <p>Add ApplePaySDK to your iPhone home screen for easy AMID processing:</p>
            
            <div class="step">
                <strong>Step 1:</strong> Tap the Share button <span style="font-size: 18px;">⎘</span> in Safari
            </div>
            
            <div class="step">
                <strong>Step 2:</strong> Select "Add to Home Screen" 
            </div>
            
            <div class="step">
                <strong>Step 3:</strong> Tap "Add" to confirm
            </div>
            
            <a href="${baseUrl}" class="button">
                🚀 Open ApplePaySDK App
            </a>
            
            <div style="margin-top: 20px; padding: 16px; background: #fff3cd; border-radius: 8px; font-size: 14px;">
                <strong>Note:</strong> Mobile configuration profiles require signing certificates for production use. 
                For development, using "Add to Home Screen" provides the same functionality.
            </div>
        </div>
        
        <script>
            // Auto-redirect to main app after 5 seconds
            setTimeout(() => {
                window.location.href = '${baseUrl}';
            }, 5000);
        </script>
    </body>
    </html>`;
        // Set HTML headers
        res.setHeader("Content-Type", "text/html");
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        // Send the instruction page
        res.status(200).send(instructionHTML);
    } catch (error) {
        console.error("Error generating mobile setup:", error);
        res.status(500).json({
            error: "Failed to generate mobile setup",
            message:  false ? 0 : undefined
        });
    }
}
/**
 * Generate a UUID for the mobile configuration
 */ function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === "x" ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(635));
module.exports = __webpack_exports__;

})();