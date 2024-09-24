import { Router } from "express";
import { ChatRoom } from "../../../models/chatRooms.js";
import { DATE, Op } from "sequelize";
const router = new Router();

router.post('/api/v1/createRoom',async (req,res)=>{
    try{
        var {roomName}= req.body;
        var result=ChatRoom.createRoom(roomName);
        res.status(201).json({ message: `${roomName} created successfully`, roomId: result });
    }
    catch(error){
        console.error('Error creating room:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/api/v1/joinroom',async (req,res)=>{
    try{
        const {roomId, userId}= req.query.code;
        const user=ChatRoom.addUser()
        return result;
    }
    catch(error){
        console.error('Error while adding user in room', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})