import pg from "pg";
import dotenv from "dotenv";
dotenv.config()
const postgresClient = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
});

export async function dbConnection() {
  try{  
    await postgresClient.connect()
  }
  catch(error){
    throw(error);
  } 
};


export { postgresClient };
