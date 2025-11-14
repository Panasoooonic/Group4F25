const {sqlPool} = require('../config/database');

const User = {

    create:async(firstName, lastName, email, password) =>{
        const [result] = await sqlPool.query(
            'INSERT INTO Users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
            [firstName, lastName, email, password]  
        )
    },

    findbyEmail:async(email)=>{
        const [rows] = await sqlPool.query(
            'SELECT * FROM Users WHERE email = ?',
            [email]
        );
        return rows[0];
        }

    };

module.exports = User;