'use strict';
import bcrypt from 'bcryptjs';
import { sequelize } from '../lib/db_setup.js';
import { DataTypes,Sequelize } from 'sequelize';

/*
    DROP TABLE IF EXISTS "Users" CASCADE

    CREATE TABLE IF NOT EXISTS "Users" (
      "userid" SERIAL PRIMARY KEY,
      "username" VARCHAR(255) NOT NULL UNIQUE,
      "phnumber" VARCHAR(20) NOT NULL UNIQUE,
      "firstname" VARCHAR(255) NOT NULL,
      "lastname" VARCHAR(255) NOT NULL,
      "dateofbirth" DATE NOT NULL,
      "gender" VARCHAR(255) NOT NULL,
      "password" VARCHAR(255) NOT NULL,
      "createdat" DATE,
      "lastupdated" DATE,
      "verificationcode" VARCHAR(255),
      "verificationexpires" TIMESTAMP WITH TIME ZONE,
      "emailverified" BOOLEAN DEFAULT false,
      "age" INTEGER NOT NULL,
      "email" VARCHAR(255) NOT NULL UNIQUE,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
    )
 */

class User extends Sequelize.Model {

  // Initialize the User model schema
  static initModel(sequelize) {
    User.init({
      userid: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
      },
      username: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING
      },
      phnumber: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING(20)
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      dateofbirth: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      verificationcode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      verificationexpires: {
        type: DataTypes.DATE,
        allowNull: true
      },
      emailverified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      age: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      email: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING
      }
    }, {
      sequelize,  // Pass the Sequelize instance
      modelName: 'User',  // Name of the model
      hooks: {
        beforeCreate: async (user) => {
          try {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          } catch (error) {
            throw error;
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        }
      }
    });
  }

  // Static method to validate password
  async validatePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

// Initialize the model
User.initModel(sequelize);

// Export the class to use in other parts of the app
export { User };
