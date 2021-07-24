import { Router } from 'express'
import { getConnection } from '../module/db'

const router = Router({ mergeParams: true })

router.get('/', async (req, rsp) => {
  const conn = await getConnection()
  let r = await conn.execute('SELECT * FROM classrooms')
  let rows = r[0]

  rsp.send(rows)
})

router.get('/all/assignments', async (req, rsp) => {
  const conn = await getConnection()
  let r = await conn.execute('SELECT * FROM assignments')
  let rows = r[0]

  rsp.send(rows)
})

router.get('/{class_id}/assignments', async (req, rsp) => {
  const conn = await getConnection()
  let r = await conn.execute('SELECT * FROM assignments')
  let rows = r[0]

  rsp.send(rows)
})

router.get('/{class_id}/boards', async (req, rsp) => {
  const conn = await getConnection()
  let r = await conn.execute('SELECT * FROM boards')
  let rows = r[0]

  rsp.send(rows)
})

router.get('/{class_id}/boards/{board_id}/list', async (req, rsp) => {
  const conn = await getConnection()
  let r = await conn.execute('SELECT * FROM boards')
  let rows = r[0]

  rsp.send(rows)
})
export default router