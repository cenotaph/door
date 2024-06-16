import { Pool, Client } from 'pg'
import type { Nfc } from './types/nfc'

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPPASSWORD,
  port: process.env.PGPORT
})

export const checkTag = async (tag: string): Promise<any> => {
  const theTag = await pool.query(`SELECT * FROM nfcs WHERE tag = '${tag}'`)
  if (!theTag.rows[0]) return false
  else return theTag.rows[0]
}

export const insertNewTag = async (tag: string): Promise<any> => {
  try {
    const insert = await pool.query(`INSERT INTO nfcs (tag, active) VALUES ('${tag}', true)`)
    return insert
  } catch (error) {
    console.log(error)
    return { rowCount: 0 }
  }
}

export const logEntry = async (tagId: number): Promise<any> => {
  try {
    const insert = await pool.query(`INSERT INTO entries (timestamp, nfc_id) VALUES (now(), '${tagId}')`)
    return insert
  } catch (error) { 
    console.log(error)
    return { rowCount: 0 }
  }
}
