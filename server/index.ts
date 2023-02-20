import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app: Express = express();
app.use(express.json());

//database init
import mongodb, {MongoClient} from 'mongodb';
const mongostring = process.env.MongoCluster || "";
const client = new MongoClient(mongostring);
const data = client.db("data");
const log = client.db("log");

// data collections
const Accounts = data.collection("Accounts");
const Orders = data.collection("Orders");
const Applications = data.collection("Applications");
const Sellers = data.collection("Sellers");

// log collections
const Transactions = log.collection("Transactions");
const ClosedApplications = log.collection("ClosedApplications");

// MongoDB Object
// should be passed to global router!
const MongoObject = {
  databases:{
    data:data,
    log:log
  }, 
  collections:{
    Sellers:Sellers,
    Orders:Orders,
    Accounts:Accounts,
    Applications:Applications,
    Transactions:Transactions,
    ClosedApplications:ClosedApplications
  }
}

//routing
import AuthorizationRouter from "./routers/authorization";
import publicRouter from "./routers/public";
app.use('/public', publicRouter(MongoObject));
app.use('/authorization', AuthorizationRouter(MongoObject));



// running
app.listen(8000, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:8000`);
});