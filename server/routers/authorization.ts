import express, {Request, Response, NextFunction } from 'express';
import mongodb, { MongoClient, ObjectId } from 'mongodb';
import { Account, Order, Seller } from '../interfaces';


const Router = (MongoObject:{
    databases: {
        data: mongodb.Db;
        log: mongodb.Db;
    };
    collections: {
        Sellers: mongodb.Collection<Seller>;
        Orders: mongodb.Collection<Order>;
        Accounts: mongodb.Collection<Account>;
        Applications: mongodb.Collection<mongodb.BSON.Document>;
        Transactions: mongodb.Collection<mongodb.BSON.Document>;
        ClosedApplications: mongodb.Collection<mongodb.BSON.Document>;
    }}) => {
    const AuthorizationRouter = express.Router();

        const InputValidator = async (req:Request, res:Response, next:NextFunction) => {
            next();
        };

    AuthorizationRouter.post("/account", InputValidator, async (req:Request, res:Response) => {
       try{
            var user = await MongoObject.collections.Accounts.findOne({$and:[
                {username:req.body.username},
                {password:req.body.password}
            ]});
            var sessionid = makeid(14);
            if (user)
            {
               var updatevar = await MongoObject.collections.Accounts.updateOne({_id:user._id}, {$set:{sessionid:sessionid}})
                if (updatevar.acknowledged)
                {
                    res.status(200);
                    return res.json({
                        err:false,
                        accountType:user.type,
                        sessionid:sessionid
                    });    
                }
                throw new Error("unable to update sessionid");
            }
            else
            {
                res.status(500);
                return res.json({
                    err:true,
                    msg:"no user found",
                    not:null // number of tries left
                });
            }
        }
        catch(exeption)
        {
            res.status(500);
            return res.json({
                err:true,
                msg:"unable to verify user",
                not:null // number of tries left
            });
        }
    });

    function makeid(length:number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    return AuthorizationRouter;
}




export default Router;
