"use strict";
(() => {
var exports = {};
exports.id = 764;
exports.ids = [764];
exports.modules = {

/***/ 455:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ handler)
});

// EXTERNAL MODULE: ./utils/auth.ts
var auth = __webpack_require__(171);
;// CONCATENATED MODULE: external "passbook"
const external_passbook_namespaceObject = require("passbook");
var external_passbook_default = /*#__PURE__*/__webpack_require__.n(external_passbook_namespaceObject);
;// CONCATENATED MODULE: external "fs"
const external_fs_namespaceObject = require("fs");
var external_fs_default = /*#__PURE__*/__webpack_require__.n(external_fs_namespaceObject);
;// CONCATENATED MODULE: external "path"
const external_path_namespaceObject = require("path");
var external_path_default = /*#__PURE__*/__webpack_require__.n(external_path_namespaceObject);
;// CONCATENATED MODULE: ./utils/passkit.ts



// Path to certificates
const certPath = external_path_default().resolve("./certs");
// Load certificates once at module level
const CERTS = {
    wwdr: external_fs_default().readFileSync(external_path_default().join(certPath, "wwdr.pem")),
    signerCert: external_fs_default().readFileSync(external_path_default().join(certPath, "signingCert.pem")),
    signerKey: external_fs_default().readFileSync(external_path_default().join(certPath, "signingKey.pem"))
};
// Get configuration from environment variables or use defaults
const TEAM_ID = process.env.APPLE_TEAM_ID || "REPLACE_WITH_YOUR_TEAM_ID";
const PASS_TYPE_ID = process.env.PASS_TYPE_ID || "pass.com.applepayer";
const CERT_PASSPHRASE = process.env.CERT_PASSPHRASE || "";
const ORG_NAME = process.env.ORGANIZATION_NAME || "APPLEPAYER";
// Create a template for generating passes
const template = new (external_passbook_default())({
    model: external_path_default().join(process.cwd(), "assets/pass"),
    certificates: {
        wwdr: CERTS.wwdr,
        signerCert: CERTS.signerCert,
        signerKey: CERTS.signerKey,
        signerKeyPassphrase: CERT_PASSPHRASE
    },
    overrides: {
        serialNumber: `applepayer-${Date.now()}`,
        teamIdentifier: TEAM_ID,
        passTypeIdentifier: PASS_TYPE_ID
    }
});
/**
 * Generates an Apple Wallet pass for a given K/BAN code
 * 
 * @param {string} kban - The K/BAN code to include in the pass
 * @returns {Promise<Buffer>} A promise that resolves to the generated .pkpass file as a Buffer
 * @throws {Error} If pass generation fails
 */ async function generatePass(kban) {
    try {
        // Validate input
        if (!kban || typeof kban !== "string") {
            throw new Error("Invalid K/BAN provided");
        }
        // Create a unique serial number for this pass
        const serialNumber = `applepayer-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
        // Create the pass with the provided K/BAN
        const pass = template.createPass({
            serialNumber,
            description: `${ORG_NAME} Wallet K/BAN`,
            organizationName: ORG_NAME,
            logoText: "K/BAN",
            foregroundColor: "rgb(255, 255, 255)",
            backgroundColor: "rgb(0, 0, 0)",
            generic: {
                primaryFields: [
                    {
                        key: "kban",
                        label: "K/BAN",
                        value: kban
                    }
                ],
                secondaryFields: [
                    {
                        key: "created",
                        label: "CREATED",
                        value: new Date().toLocaleDateString()
                    }
                ],
                auxiliaryFields: [
                    {
                        key: "status",
                        label: "STATUS",
                        value: "ACTIVE"
                    }
                ]
            },
            // Add a QR code containing the K/BAN
            barcode: {
                message: kban,
                format: "PKBarcodeFormatQR",
                messageEncoding: "iso-8859-1",
                altText: kban
            }
        });
        // Generate the pass and return it as a Buffer
        return await pass.generate();
    } catch (error) {
        console.error("Error generating pass:", error);
        throw new Error(`Failed to generate pass: ${error.message}`);
    }
}

;// CONCATENATED MODULE: ./pages/api/pass/create.ts


async function handler(req, res) {
    if (!(0,auth/* requireApiKey */.m)(req, res)) return;
    if (req.method !== "POST") return res.status(405).end();
    const { kban  } = req.body;
    if (!kban) return res.status(400).json({
        error: "K/BAN required"
    });
    try {
        const pkpassBuffer = await generatePass(kban);
        res.setHeader("Content-Type", "application/vnd.apple.pkpass");
        res.setHeader("Content-Disposition", `attachment; filename=${kban}.pkpass`);
        res.status(200).send(pkpassBuffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to generate Wallet pass"
        });
    }
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [171], () => (__webpack_exec__(455)));
module.exports = __webpack_exports__;

})();