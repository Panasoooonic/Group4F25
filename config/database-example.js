import mysql from "mysql2";

export const sqlPool = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "NHL",
  })
  .promise();
