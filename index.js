import Express from "express";
import pg from "pg"
const app = Express();
const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });
  db.connect();
app.listen(3000,()=>{
    console.log("Server running");
})