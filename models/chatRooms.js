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
        type: DataTypes.ARRAY(DataTypes.INTEGER)
      }
    }, {
      sequelize, // Pass the connection instance
      modelName: 'chatRoom',
    });
  }

  // Static method using this.getTableName()
  static async addUser(roomId, userId) {
    try {
      const query = `
        UPDATE ${this.getTableName()}  -- Dynamically get the table name
        SET userlist = array_append(userlist, ${userId})
        WHERE id = ${roomId}
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
        select userlist from ${this.getTableName()}
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

  static async createRoom(roomName) {

    try{
        /** creating new room and saving it to database*/
      let roomObject={
        roomname: roomName,
        userlist: null
      }
      await this.getTableName().create(roomObject);
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