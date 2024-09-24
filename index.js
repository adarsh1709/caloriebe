import express from "express";
import pg from "pg"
import { config } from "dotenv";
import { useRoutes } from "./lib/readRoutes.js";
import { printRoutes } from "./src/utils/listOfPaths.js";
import { socketInstance } from "./src/chat-application/server.js";
import path from 'path'
// import {xyz,wordTrie} from "./src/utils/suggestion.js";
// import { start } from "repl";
import { sequelize,redisRead,redisWrite,redisInitializationPromise } from "./lib/db_setup.js";
import cors from "cors"
import { User } from "./models/user.js";
import { ChatRoom } from "./models/chatRooms.js";
import { UserConnections } from "./models/userConnections.js";
import { Message } from "./models/message.js";
config();
const port = "5431";

/** initializing io */
let io;

async function startServer()
{ 
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const routesDirectory = path.join(__dirname, "./src/routes");  
  try{
    /** adding all the routes using app.use() */
    const app = express();
    app.use(express.json());

    await useRoutes(routesDirectory, app);

    const server = app.listen(port, async () => {
      console.log("Server running on port:", port);
      try {
        await sequelize.sync({force:true});

        // const random = await xyz();
        //initilizing redis 
        await redisInitializationPromise;
        
        /** intitializing socket server with http server */
        socketInstance.io.attach(server, {
          cors: {
            origin: ["http://localhost:3000","http://localhost:3001"], // Replace with your frontend URL
            methods: ["GET", "POST"],
          },
        });
        console.log("Socket.io initialized");

        socketInstance.initListners();
        /** printing all available routes in console*/
        /** In routes folder file should not be blank */
        printRoutes(app);
      } catch (err) {
        console.error("An error occurred during startup:", err);
      }
    });

    // Handle server error event
    server.on("error", (err) => {
      console.error("Server error:", err);
    });

  } catch(err){
     console.error("Failed to start server:", err);
  }
  
};

startServer();
export { startServer, io };

