"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticketController_js_1 = require("../controllers/ticketController.js");
const router = (0, express_1.Router)();
router.get('/', ticketController_js_1.getTickets);
router.post('/', ticketController_js_1.createTicket);
exports.default = router;
