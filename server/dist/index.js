"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stores = exports.Accounts = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
var privateKey = fs_1.default.readFileSync('ssl/key.pem', 'utf8');
var certificate = fs_1.default.readFileSync('ssl/cert.pem', 'utf8');
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
//database init
const mongodb_1 = require("mongodb");
const mongostring = process.env.MongoCluster || "";
const client = new mongodb_1.MongoClient(mongostring);
const data = client.db("data");
const log = client.db("log");
// data collections
exports.Accounts = data.collection("Accounts");
const Orders = data.collection("Orders");
const Applications = data.collection("Applications");
exports.Stores = data.collection("Stores");
// log collections
const Transactions = log.collection("Transactions");
const ClosedApplications = log.collection("ClosedApplications");
// MongoDB Object
// should be passed to global router!
const MongoObject = {
    databases: {
        data: data,
        log: log
    },
    collections: {
        Stores: exports.Stores,
        Orders: Orders,
        Accounts: exports.Accounts,
        Applications: Applications,
        Transactions: Transactions,
        ClosedApplications: ClosedApplications
    }
};
//routing
const authorization_1 = __importDefault(require("./routers/authorization"));
const delivery_1 = __importDefault(require("./routers/delivery"));
const buyer_1 = __importDefault(require("./routers/buyer"));
const publicBuyer_1 = __importDefault(require("./routers/publicBuyer"));
const seller_1 = __importDefault(require("./routers/seller"));
app.use('/buyer', (0, buyer_1.default)(MongoObject));
app.use('/publicbuyer', (0, publicBuyer_1.default)(MongoObject));
app.use('/delivery', (0, delivery_1.default)(MongoObject));
app.use('/authorization', (0, authorization_1.default)(MongoObject));
app.use('/seller', (0, seller_1.default)(MongoObject));
// running
app.listen(8000, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:8000`);
});
