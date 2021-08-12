import { Router } from 'express';
import { getConnection } from '../module/db';

const router = Router({ mergeParams: true });

router.get('/', async (req, rsp) => {
  const conn = await getConnection();
  const r = await conn.execute('SELECT * FROM classrooms');
  const rows = r[0];

  rsp.send(rows);
});

router.get('/all/assignments', async (req, rsp) => {
  const conn = await getConnection();
  const r = await conn.execute('SELECT * FROM assignments');
  const rows = r[0];

  rsp.send(rows);
});

router.get('/{class_id}/assignments', async (req, rsp) => {
  const conn = await getConnection();
  const r = await conn.execute('SELECT * FROM assignments');
  const rows = r[0];

  rsp.send(rows);
});

router.get('/{class_id}/boards', async (req, rsp) => {
  const conn = await getConnection();
  const r = await conn.execute('SELECT * FROM boards');
  const rows = r[0];

  rsp.send(rows);
});

router.get('/{class_id}/boards/{board_id}/list', async (req, rsp) => {
  const conn = await getConnection();
  const r = await conn.execute('SELECT * FROM boards');
  const rows = r[0];

  rsp.send(rows);
});
export default router;
