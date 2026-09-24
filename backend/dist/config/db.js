"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbStore = void 0;
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const seedData_js_1 = require("../data/seedData.js");
// In-Memory Database Store
class DatabaseStore {
    galleries = JSON.parse(JSON.stringify(seedData_js_1.seedGalleries));
    exhibits = JSON.parse(JSON.stringify(seedData_js_1.seedExhibits));
    visitors = JSON.parse(JSON.stringify(seedData_js_1.seedVisitors));
    analytics = JSON.parse(JSON.stringify(seedData_js_1.seedAnalytics));
    tickets = JSON.parse(JSON.stringify(seedData_js_1.seedTickets));
    isConnectedToMongo = false;
    reset() {
        this.galleries = JSON.parse(JSON.stringify(seedData_js_1.seedGalleries));
        this.exhibits = JSON.parse(JSON.stringify(seedData_js_1.seedExhibits));
        this.visitors = JSON.parse(JSON.stringify(seedData_js_1.seedVisitors));
        this.analytics = JSON.parse(JSON.stringify(seedData_js_1.seedAnalytics));
        this.tickets = JSON.parse(JSON.stringify(seedData_js_1.seedTickets));
    }
}
exports.dbStore = new DatabaseStore();
async function connectDB() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri || process.env.DEMO_MODE === 'true') {
        console.log('🏛️  [Database] Operating in Standalone In-Memory Museum Store (Demo Mode)');
        exports.dbStore.isConnectedToMongo = false;
        return;
    }
    try {
        await mongoose_1.default.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });
        exports.dbStore.isConnectedToMongo = true;
        console.log('✅ [Database] Successfully connected to MongoDB Atlas');
    }
    catch (err) {
        console.warn('⚠️  [Database] Could not connect to MongoDB Atlas (' + (err.message || err) + '). Seamlessly falling back to In-Memory Museum Store.');
        exports.dbStore.isConnectedToMongo = false;
    }
}
