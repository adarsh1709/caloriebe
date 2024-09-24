import { Router } from "express";
import { sequelize } from "../../../lib/db_setup.js";
import { UserConnections } from "../../../models/userConnections.js";
const router = new Router();

router.get('/api/v1/homepage/list', async (req, res) => {
    try{
      let userid=req.query.userid
      const homePageList = await UserConnections.listForHomePage(userid);
      res.json(homePageList);
    }
    catch(e){
        res.send(e);
    }
});


export {router};