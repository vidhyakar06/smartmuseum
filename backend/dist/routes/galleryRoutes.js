"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const galleryController_js_1 = require("../controllers/galleryController.js");
const router = (0, express_1.Router)();
router.get('/', galleryController_js_1.getGalleries);
router.get('/:id', galleryController_js_1.getGalleryById);
router.patch('/:id/occupancy', galleryController_js_1.updateGalleryOccupancy);
exports.default = router;
