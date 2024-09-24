'use strict';
import { sequelize } from '../lib/db_setup.js';
import { DataTypes,Op,Sequelize } from 'sequelize';

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
class Message extends Sequelize.Model {
  // Initialize the Message model schema
  static initModel(sequelize) {
    Message.init({
      messageid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      senderid: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      receiverid: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      chatroomid: {
        allowNull: true,
        type: DataTypes.STRING
      },
      content: {
        allowNull: true,
        type: DataTypes.TEXT
      },
      dt: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: DataTypes.NOW
      }
    }, {
      sequelize,  // Pass the Sequelize instance
      modelName: 'message',  // Name of the model (used as table name)
      hooks: {
        beforeCreate: async (message) => {
          try {
            console.log(message);
          } catch (error) {
            throw error;
          }
        }
      }
    });
  }

  // Static method to retrieve 2-year-old data
  static async getOldMessages(roomid, receiverid, senderid) {
    if (roomid) {
      try {
        const query = {
          where: {
            chatroomid: roomid,
            dt: {
              [Op.gte]: Sequelize.literal('DATE_SUB(CURDATE(), INTERVAL 2 YEAR)')  // Adjusted to 2 years
            }
          }
        };
        const result = await Message.findAll(query);  // Use Message class instead of message
        return result;
      } catch (error) {
        throw new Error('Error while fetching old data:', error);
      }
    }
  }

  // Static method to store a new message in the database
  static async storeMessageToDatabase(senderid, recipientid, content, chatroomid) {
    const messageObj = {
      senderid: senderid,
      receiverid: recipientid,
      chatroomid: chatroomid,
      content: content
    };
    try {
      const returnedMessage = await Message.create(messageObj);  // Use Message class to create
      return returnedMessage;
    } catch (error) {
      throw new Error('Error while storing message:', error);
    }
  }
}

// Initialize the model
Message.initModel(sequelize);

// Export the class to use in other parts of the app
export { Message };
