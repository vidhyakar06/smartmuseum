"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQRCodeDataUrl = generateQRCodeDataUrl;
const qrcode_1 = __importDefault(require("qrcode"));
async function generateQRCodeDataUrl(text) {
    try {
        return await qrcode_1.default.toDataURL(text, {
            errorCorrectionLevel: 'M',
            margin: 2,
            scale: 8,
            color: {
                dark: '#0B0D10',
                light: '#FFFFFF'
            }
        });
    }
    catch (err) {
        console.error('Failed to generate QR code', err);
        throw new Error('QR generation failed');
    }
}
