import { Router } from "express";
import { postgresClient } from "../../../lib/db_setup.js";

const router = new Router();

router.get('/api/v1/onboarding/jobtype', async (req, res) => {
    try{
      const joblist = await postgresClient.query("SELECT job_name FROM jobtype_list");
      const jobs= joblist.rows
      res.json(jobs);
    }
    catch(e){
        res.send(e);
    }
    
  });


export {router};