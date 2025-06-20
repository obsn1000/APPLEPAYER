"use strict";
(() => {
var exports = {};
exports.id = 401;
exports.ids = [401];
exports.modules = {

/***/ 113:
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ 642:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var _utils_kban__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(251);
/* harmony import */ var _utils_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(171);
/// FILE: /pages/api/kban/generate.ts


function handler(req, res) {
    if (!(0,_utils_auth__WEBPACK_IMPORTED_MODULE_1__/* .requireApiKey */ .m)(req, res)) return;
    if (req.method !== "POST") return res.status(405).end();
    const kban = (0,_utils_kban__WEBPACK_IMPORTED_MODULE_0__/* .generateKban */ .Hh)();
    res.status(200).json({
        kban
    });
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [171,251], () => (__webpack_exec__(642)));
module.exports = __webpack_exports__;

})();