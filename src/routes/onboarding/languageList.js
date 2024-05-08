import { Router } from "express";

const router = new Router();

router.get('/api/v1/language_list',(req,res)=>{
    return res.send("list of languages");
})

export {router};