'use strict';
import bcrypt from 'bcryptjs';
import { sequelize } from '../lib/db_setup.js';
import { DataTypes } from 'sequelize';

/*
    DROP TABLE IF EXISTS "UserConnections" CASCADE

    CREATE TABLE IF NOT EXISTS "UserConnections" (
      "userid" SERIAL PRIMARY KEY,
      "createdAt" DATE,
      "individualid" INTEGER,
      "chatroomid" INTEGER,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
    )
 */

const UserConnections = 
    sequelize.define('UserConnections',{
        userid: {
            allowNull:false,
            autoIncrement: true,
            primaryKey:true,
            type: DataTypes.INTEGER
        },
        chatroomid:{
            allowNull:true,
            type: DataTypes.INTEGER
        }
    },{
      hooks: {
        beforeCreate: async (user)=>{    
          try{     
            
          }
          catch(error){
            throw(error);
          }
        }
      }
    }
)

UserConnections.listForHomePage= async function(userid){
    try {
        let query=`
            with t1 as (
                select userid,username from Users
            ),
            t2 as (
                select chatroomid,roomname from chatRoom
            ),
            
                select chatroomid from UserConnections where userid='${userid}'
            )
            select t1.username as name,
                   t1.userid,
                   Null as chatroomid
                   from 
                   t1 inner join t3 
                   on t1.userid=t3.individualid
                   
                   union 

                   t2.roomname as name,
                   Null as userid,
                   t2.chatroomid
                   from 
                   t2 inner join t3 
                   on t2.chatroomid=t3.chatroomid 
        `
        const result = await sequelize.query(
          query,
          {
            type: sequelize.QueryTypes.SELECT // Specify the query type
          }
        );
      } catch (error) {
        console.error('Error in getting list of name for home page :', error);
      }
}

UserConnections.checkIfConnectionExist=async function(senderid,receiverid) {

  let queryObject={
    where:{
      userid: senderid,
      individualid: receiverid
    }
  }
  const result=await UserConnections.findOne(queryObject);
  console.log(result);
  
  if(!result){
    try{
      let UserConnectionsObject=[
        {
        userid:senderid,
        individualid:receiverid,
        chatroomid:null
        },
        {
          userid:receiverid,
          individualid:senderid,
          chatroomid:null
        } 
      ]
      const result=await UserConnections.bulkCreate(UserConnectionsObject);
    }
    catch(e){
      throw new Error(`error while inserting into UserConnections: ${e}`)
    }
  }

}

export {UserConnections}
