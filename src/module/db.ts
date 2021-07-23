import mysql, { Connection } from 'mysql2/promise';
import dotenv from 'dotenv'

if (process.env.NODE_ENV === 'production') dotenv.config({ path: '.env' })
else dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

export interface DBconnectionType {
  dbUser: string
  dbPassword: string
  host: string
  dbName: string
}

const conf: DBconnectionType = {
  dbUser: process.env.DB_USER!,
  dbName: process.env.DB_NAME!,
  dbPassword: process.env.DB_PASSWORD!,
  host: process.env.DB_HOST!
}

const pool = mysql.createPool({
  host: conf.host,
  user: conf.dbUser,
  password: conf.dbPassword,
  database: conf.dbName,
  connectionLimit: 10000,
  supportBigNumbers: true,
  timezone: 'Z',
  bigNumberStrings: true,
  namedPlaceholders: true
});

export function getConnection(): Promise<Connection> {
  return new Promise((resolve, reject) => {
    try {
      pool.getConnection()
        .then(conn => {
          resolve(conn);
          conn.release();
        })
    }
    catch (e) {
      reject(e);
    }
  })
}