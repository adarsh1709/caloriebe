// import { redisRead,redisWrite } from "../../lib/db_setup.js";
// // Handle errors
// // redis.on('error', (err) => console.error('Redis error:', err));

// // Function to add a message to the chatroom list
// async function sendMessage(roomId, socketID) {
//   // Store the message in a Redis list
//   try{
//       return await redis.sadd(roomId, socketID);
//   }
//   catch(e){
//     console.log(`error while adding user ${socketID} to list of online users`);
    
//   }
// }

// // Function to get chat messages
// async function getMessages(roomId) {
//   const listKey = `chatroom:${roomId}:messages`;

//   // Get all messages from Redis list
//   client.lrange(listKey, 0, -1, (err, messages) => {
//     if (err) {
//       console.error('Error retrieving messages:', err);
//     } else {
//       console.log('Chat messages:', messages);
//     }
//   });
// }


