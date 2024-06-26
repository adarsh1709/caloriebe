import Express from "express";
import pg from "pg"
import dotenv from "dotenv"
import { postgresClient, dbConnection } from "./lib/db_setup.js";
import { useRoutes } from "./lib/readRoutes.js";
import { printRoutes } from "./src/utils/listOfPaths.js";
import path from 'path'
import {xyz,wordTrie} from "./src/utils/suggestion.js";
dotenv.config()
const port = "5431";


var app = Express();

(async () =>
{ 
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const routesDirectory = path.join(__dirname, "./src/routes");  
  try{
    /** adding all the routes using app.use() */
    app =await useRoutes(routesDirectory, app); 

    app.listen(port, async () => {
      console.log("Server running on port:", port);
      try {
        const result = await dbConnection();
        const random = await xyz();

        console.log("postgres successfully connected");

        /** printing all available routes in console*/
        printRoutes(app);
        
      } catch (e) {
        throw e;
      }
    })
    
    

  } catch(e){
    throw e;s
  }
  
})();

