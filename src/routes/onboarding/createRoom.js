import { Router } from "express";
import { ChatRoom } from "../../../models/chatRooms.js";
import { DATE, Op } from "sequelize";
import { ValidationError } from "../../utils/exception.js";
const router = new Router();

/** creating a room whenever:
 *  1. User types first message between individual chat
 *  2. Whenever someone creates the new room
 */
router.get('/api/v1/createRoom',async (req,res)=>{
    try{
        var {roomName,isgroup,userid1,userid2}= req.query;
        if(roomName==null && isgroup)throw new ValidationError("missing roomName while creating room for group chat",401);// check if roomName is present in creating gropu room 
        var result=await ChatRoom.createRoom(roomName,userid1,userid2);
        res.status(201).json({ message: `${roomName} created successfully`, roomId: result });
    }
    catch(e){
        res.status(401).json({ message: e.message,code:e.code });
    }
})

router.get('/api/v1/joinroom',async (req,res)=>{
    try{
        const {roomId, userId}= req.query;
        const result=await ChatRoom.addUser(roomId, userId)
        res.status(201).json({ message: `${userId} successfully joined the room` });
    }
    catch(error){
        console.error('Error while adding user in room', error);
        res.status(500).json({ error: error });
    }
})


router.get('/api/v1/leaveroom',async (req,res)=>{
    try{
        const {roomId, userId}= req.query;
        const result=await ChatRoom.removeUser(roomId, userId)
        res.status(201).json({ message: `${userId} successfully removed from the room` });
    }
    catch(error){
        console.error('Error while removing user from the room', error);
        res.status(500).json({ error: error });
    }
})
export {router};