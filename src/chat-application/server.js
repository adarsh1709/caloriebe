import { Server } from "socket.io";
import { Message } from "../../models/message.js";
import { UserConnections } from "../../models/userConnections.js";
import { ChatRoom } from "../../models/chatRooms.js";
import { redisRead,redisWrite } from "../../lib/db_setup.js";
class SocketService{
    constructor(){
        console.log("intitalizing socket service");
        this.io= new Server();
    }

    get getio(){
        return this.io;
    }

    initListners(){
        const io= this.io
        console.log("init Listners");
        io.on("connection", (socket,userId) => {
          console.log(`User Connected : ${socket.id} `);
          // add user id and socketId mapping to the redis 
          redisRead.set(`user:${userId}`,socket.id);

          /******** Group Chat ***********/
          /** update the redis table for the rooms available for given user */
          socket.on('enter room',async(data,callback)=>{
              // updated the table where we keep userIds in given room
              try{
                const {roomId,userId}=data;
                socket.join(roomId);
                
                await redisRead.srem(`room:${roomId}`,userId);
                callback(`Successfully joined room: ${roomId}`);
              }
              catch(error){
                console.log(`error in entering the room: ${error}`);
                callback(`error in entering the room: ${error}`);
              }
          }) 
          
          socket.on('leave room',async(data,callback)=>{
              try{
                const {roomId,userId}=data;
                socket.leave(roomId);                
                await redisRead.sadd(`room:${roomId}`,userId)
                callback(`Successfully removed from room: ${roomId}`);
              }
              catch(error){
                console.log(`error in entering the room: ${error}`);
              }
          })
        
          socket.on("room message", async (data)=>{
            /** created room between two persons */
            
            try{
            const {senderid,roomId,content}=data;
            console.log(data);
            

            /** save message to database  Apache implementation needed*/
            // const returnedMessage=await Message.storeMessageToDatabase(senderid,null,content,roomId);
            console.log({whoissending:senderid,content:content});
            
            io.to(roomId).emit("message in room",{whoissending:senderid,content:content}); }
            catch(error){
              console.log(`error in sending private message from server to client : ${error}`);
            }
          })


          /******** 1-1 Chat*********/
          socket.on("user message", async())  


          socket.on('disconnect', async()=>{
            redisRead.del(`user:${userId}`,socket.id);
          })
        });
    }
}



/** exporting it as singleton instance */
export const socketInstance=new SocketService();

