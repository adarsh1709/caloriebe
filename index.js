import Express from "express";
import pg from "pg"
import dotenv from "dotenv"
dotenv.config()

const app = Express();
const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT,
  });
  
app.listen(3000,()=>{
    console.log("Server running");
    db.connect().then(()=>{
        console.log("succesfully connected to postgres")
    }).catch((e)=>{
        console.log(e)
    });
})