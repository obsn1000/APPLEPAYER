"use strict";
exports.id = 251;
exports.ids = [251];
exports.modules = {

/***/ 251:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ds": () => (/* binding */ validateKban),
/* harmony export */   "Hh": () => (/* binding */ generateKban),
/* harmony export */   "eD": () => (/* binding */ parseReapwareInput)
/* harmony export */ });
/* unused harmony export validateAmidData */
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(113);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);
/// FILE: /utils/kban.ts

/**
 * Generates a new K/BAN (Key/Bank Account Number) code using cryptographically secure random generation
 * 
 * @returns {string} A new K/BAN code in the format KBAN-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 * @example
 * const kban = generateKban();
 * // Returns: "KBAN-AB12CD34EF56GH78IJ90KL12MN34OP56"
 */ function generateKban() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "KBAN-";
    const randomBytes = crypto__WEBPACK_IMPORTED_MODULE_0___default().randomBytes(32);
    for(let i = 0; i < 32; i++){
        const randomIndex = randomBytes[i] % chars.length;
        result += chars[randomIndex];
    }
    return result;
}
/**
 * Validates if a string is a properly formatted pass/code or AMID JSON from reapware
 * 
 * @param {string} input - The pass/code or JSON to validate
 * @returns {boolean} True if the input is valid, false otherwise
 * @example
 * validateKban("KBAN-AB12CD34EF56GH78IJ90KL12MN34OP56"); // Returns: true
 * validateKban('{"amid": "M90160068-4578440258079768", ...}'); // Returns: true
 * validateKban(""); // Returns: false
 */ function validateKban(input) {
    if (!input || typeof input !== "string") {
        return false;
    }
    // Remove whitespace
    const cleanInput = input.trim();
    // Empty string is invalid
    if (cleanInput.length === 0) {
        return false;
    }
    // Try to parse as JSON first (AMID data from reapware)
    try {
        const jsonData = JSON.parse(cleanInput);
        if (validateAmidData(jsonData)) {
            return true;
        }
    } catch (e) {
    // Not JSON, continue with other validations
    }
    // Check for our standard KBAN format
    const standardPattern = /^KBAN-[A-Z0-9]{32}$/;
    if (standardPattern.test(cleanInput)) {
        return true;
    }
    // For reapware compatibility, accept:
    // - Alphanumeric strings with dashes/underscores
    // - Length between 8 and 64 characters
    // - Various pass formats
    const flexiblePattern = /^[A-Za-z0-9\-_]{8,64}$/;
    if (flexiblePattern.test(cleanInput)) {
        return true;
    }
    // Accept hex patterns (common in reapware)
    const hexPattern = /^[A-Fa-f0-9]{16,64}$/;
    if (hexPattern.test(cleanInput)) {
        return true;
    }
    // Accept Base64-like patterns
    const base64Pattern = /^[A-Za-z0-9+/]{16,}={0,2}$/;
    if (base64Pattern.test(cleanInput)) {
        return true;
    }
    return false;
}
/**
 * Validates AMID (Apple Merchant ID) data structure from reapware
 * 
 * @param {any} data - The parsed JSON data to validate
 * @returns {boolean} True if valid AMID data structure
 */ function validateAmidData(data) {
    if (!data || typeof data !== "object") {
        return false;
    }
    // Check for required AMID fields
    if (!data.amid || typeof data.amid !== "string") {
        return false;
    }
    // Validate AMID format (M + digits + dash + digits)
    const amidPattern = /^M\d+-\d+$/;
    if (!amidPattern.test(data.amid)) {
        return false;
    }
    // Check for validity status
    if (data.amid_isvalid && data.amid_isvalid !== "Valid") {
        return false;
    }
    return true;
}
/**
 * Parses and extracts merchant information from reapware input
 * 
 * @param {string} input - The input from reapware (JSON or simple string)
 * @returns {object} Parsed merchant data or simple pass info
 */ function parseReapwareInput(input) {
    try {
        const jsonData = JSON.parse(input);
        if (validateAmidData(jsonData)) {
            return {
                type: "amid",
                amid: jsonData.amid,
                bankName: jsonData.bank_name || "Unknown",
                accountNumber: jsonData.account_number || "",
                bankCode: jsonData.bank_code || "",
                country: jsonData.country || "Unknown",
                isValid: jsonData.amid_isvalid === "Valid",
                merchantId: jsonData.merchant_id || jsonData.amid_isvalid,
                raw: jsonData
            };
        }
    } catch (e) {
    // Not JSON, treat as simple pass
    }
    return {
        type: "simple",
        value: input.trim(),
        raw: input
    };
}


/***/ })

};
;