import { Server } from "socket.io";
import { Message } from "../../models/message.js";
import { UserConnections } from "../../models/userConnections.js";
import { ChatRoom } from "../../models/chatRooms.js";
// import { redisRead,redisWrite } from "../../lib/db_setup.js";
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
          redisRead.set(userId,`user:${socket.id}`);

          /** update the redis table for the rooms available for given user */
          socket.on('enter room',async(roomId,userId)=>{
              // updated the table where we keep userIds in given room
              try{
                socket.join(roomId);
                await redisRead.sadd(`room:${roomId}`,userId)
              }
              catch(error){
                console.log(`error in entering the room: ${error}`);
              }
          }) 
          
          socket.on('leave room',async(roomId,userId)=>{
              try{
                socket.leave(roomId);
                redis.srem(`room:${roomId}`,userId);
              }
              catch(error){
                console.log(`error in entering the room: ${error}`);
              }

          })
        
          socket.on("Private Message", async ({ senderid, roomId, content})=>{
            /** created room between two persons */
            console.log(senderid,"-----",socket.id);
            
            try{
            console.log(senderid,"--------",recipientid);

            /** save message to database  Apache implementation needed*/
            const returnedMessage=await Message.storeMessageToDatabase(senderid,null,content,roomId);
            
            /** after receiving message sending back to group of two people  except sender */
            io.to(roomId).emit("Message from user",{senderid:senderid,data:content});
            //io.to("N6qpet-Y1IiE9HQGAAAJ").emit('Message from user', 'for your eyes only')
            }
            catch(error){
              console.log(`error in sending private message from server to client : ${error}`);
            }
          })




          socket.on('disconnect', async()=>{
            redisRead.del(userId);
          })


        });
    }
}



/** exporting it as singleton instance */
export const socketInstance=new SocketService();

