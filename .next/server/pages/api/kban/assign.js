"use strict";
(() => {
var exports = {};
exports.id = 642;
exports.ids = [642];
exports.modules = {

/***/ 72:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ handler)
});

// EXTERNAL MODULE: ./utils/auth.ts
var auth = __webpack_require__(171);
;// CONCATENATED MODULE: ./utils/store.ts
const store = new Map();
const kbanStore = {
    get: (id)=>store.get(id),
    set: (id, data)=>store.set(id, data),
    delete: (id)=>store.delete(id)
};

;// CONCATENATED MODULE: ./pages/api/kban/assign.ts
/// FILE: /pages/api/kban/assign.ts


function handler(req, res) {
    if (!(0,auth/* requireApiKey */.m)(req, res)) return;
    if (req.method !== "POST") return res.status(405).end();
    const { kban , assigned_to  } = req.body;
    const existing = kbanStore.get(kban);
    if (!existing) return res.status(404).json({
        error: "K/BAN not found"
    });
    kbanStore.set(kban, {
        ...existing,
        assigned_to
    });
    res.status(200).json({
        success: true,
        message: "K/BAN assigned."
    });
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [171], () => (__webpack_exec__(72)));
module.exports = __webpack_exports__;

})();