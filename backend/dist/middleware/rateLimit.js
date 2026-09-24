"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.aiRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 40, // limit each IP to 40 requests per windowMs
    message: {
        success: false,
        message: 'Too many AI inquiries generated. Please pause for a moment to absorb the artwork.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
