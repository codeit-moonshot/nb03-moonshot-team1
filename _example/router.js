"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController = __importStar(require("./controller"));
const commentController = __importStar(require("../controllers/commentController.js"));
const validator_1 = require("./validator");
const commentValidator_js_1 = require("../middlewares/commentValidator.js");
const authMiddleware_js_1 = require("../auth/authMiddleware.js");
const authorizeMiddleware_js_1 = require("../auth/authorizeMiddleware.js");
const likeController_js_1 = require("../controllers/likeController.js");
const router = (0, express_1.Router)();
// Product CRUD
router
    .route('/')
    .post(authMiddleware_js_1.authMiddleware, validator_1.validateProductCreate, productController.createProducts)
    .get(productController.listProducts);
router
    .route('/:id')
    .get(productController.getProductById)
    .patch(authMiddleware_js_1.authMiddleware, (0, authorizeMiddleware_js_1.authorize)('product'), validator_1.validateProductUpdate, productController.updateProduct)
    .delete(authMiddleware_js_1.authMiddleware, (0, authorizeMiddleware_js_1.authorize)('product'), productController.deleteProduct);
// Product comment
router
    .route('/:productId/comments')
    .post(authMiddleware_js_1.authMiddleware, commentValidator_js_1.validateComment, commentController.createProductComment)
    .get(commentController.getProductComments);
router.route('/:id/like').post(authMiddleware_js_1.authMiddleware, likeController_js_1.postProductLike).delete(authMiddleware_js_1.authMiddleware, likeController_js_1.deleteProductLike);
exports.default = router;
