"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiController_js_1 = require("../controllers/aiController.js");
const router = (0, express_1.Router)();
router.post('/chat', aiController_js_1.handleAIChat);
exports.default = router;
