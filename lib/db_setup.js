import pg from "pg";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { Redis } from "ioredis"
dotenv.config()
import fs from 'fs'
import { log } from "console";


const isProduction = process.env.NODE_ENV === 'production';
/**
 * Update this path with path of your certifcate in production
 */
const caCert = fs.readFileSync('/Users/jatinmalav/Downloads/ca.pem')
/** import your models here whenever ypu defined any new */

const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    dialect: "postgres",
    port: process.env.PG_PORT,
    pool: {
      max: 10, // Maximum number of connections in the pool
      min: 0, // Minimum number of connections in the pool
      acquire: 30000, // Maximum time (ms) to acquire a connection before throwing error
      idle: 10000, // Maximum time (ms) that a connection can be idle before being released
    },
    dialectOptions: isProduction ? {
      ssl: {
        ca: caCert
      }
    } : {}
  }
);

const sequelizeConnect = async ()=>{
    try{
      await sequelize.authenticate()
      console.log("sequelizer successfully connected");
      
    }
    catch(error){
      throw new Error(`Error while connecting sequelizer: ${error} `);
    }
};



/**
 * Redis connection
 */

let redisWrite;
let redisRead;

async function initializeRedis() {
  try {
    redisWrite =new Redis({
      port: process.env.REDIS_PORT, // Redis port
      host: process.env.REDIS_HOST, // Redis host
      username: process.env.REDIS_USER, // needs Redis >= 6
      password: process.env.REDIS_PASSWORD,
      db: 0, // Defaults to 0
    });
    
    redisRead = redisWrite; // Assign redisRead to redisWrite

    // Optionally test the connection
    await redisWrite.ping(); // Ping the Redis server to check if it's connected
    console.log('Redis connected successfully');
  } catch (error) {
    throw new Error('Error initializing Redis:', error);
  }
}

// Example usage
const redisInitializationPromise = initializeRedis();

 export  {sequelize,sequelizeConnect,redisWrite,redisRead,redisInitializationPromise};


