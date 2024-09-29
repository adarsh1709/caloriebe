'use strict';
import bcrypt from 'bcryptjs';
import { sequelize } from '../lib/db_setup.js';
import { DataTypes,Sequelize } from 'sequelize';

/*
    DROP TABLE IF EXISTS "chatRooms" CASCADE

    CREATE TABLE IF NOT EXISTS "chatRooms" (
      "chatroomid" SERIAL PRIMARY KEY,
      "roomname" VARCHAR(255) NOT NULL,
      "createdat" DATE,
      "userlist" INTEGER[],
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
    )
 */
class ChatRoom extends Sequelize.Model {
  static initModel(sequelize) {
    return ChatRoom.init({
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
      },
      roomname: {
        allowNull: true,
        type: DataTypes.STRING
      },
      userlist: {
        allowNull: true,
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: []
      },
      userid1:{
        allowNull: true,
        type: DataTypes.INTEGER,
        defaultValue: null
      },
      userid2:{
        allowNull: true,
        type: DataTypes.INTEGER,
        defaultValue: null
      }
    }, {
      sequelize, // Pass the connection instance
      modelName: 'chatRoom',
    });
  }

  // Static method using this.getTableName()
  static async removeUser(roomId, userId) {
    try {
      const query = `
        UPDATE "chatRooms" 
        SET "userlist" = array_remove(userlist, ${userId})
        WHERE "id" = ${roomId}
      `;

      const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.UPDATE
      });
      return result;
    } catch (error) {
      throw new Error(`Error while removing user from room list: ${error}`);
    }
  }

  // remove user from room users list
  static async addUser(roomId, userId) {
    try {
      const query = `
        UPDATE "chatRooms" 
        SET "userlist" = array_append(userlist, ${userId})
        WHERE "id" = ${roomId}
      `;

      const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.UPDATE
      });
      
      return result;
    } catch (error) {
      throw new Error(`Error while adding new user to room list: ${error}`);
    }
  }

  // Example to add a user
  static async getUserList(roomId) {
    try {
      const query = `
        select userlist from ${getTableName()}
        where id=${roomId}
      `;

      const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT
      });
      return result;
    } catch (error) {
      throw new Error(`Error while fetching the list of users in room: ${error}`);
    }
  }

  static async createRoom(roomName,userid1,userid2) {

    try{
        /** creating new room and saving it to database*/
      let roomObject={
        roomname: roomName,
        userlist: null,
        userid1:userid1,
        userid2:userid2
      }
      
      const result=await ChatRoom.create(roomObject);
      const roomId=result.dataValues.id;
      console.log(roomId);
      return roomId;
    }
    catch(error){
      throw new Error(`error while creating room: ${error}`); 
    }
  }
}

// Initialize the model
ChatRoom.initModel(sequelize);

export { ChatRoom };