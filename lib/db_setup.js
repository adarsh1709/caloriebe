import pg from "pg";
import dotenv from "dotenv";
dotenv.config()

const postgresClient =async function dbConnection() {
  const pgClient = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT,
  });
  try{  
    await pgClient.connect()
    return pgClient;
  }
  catch(error){
    throw(error);
  } 
};

export {postgresClient};
