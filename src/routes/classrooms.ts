import { Router } from 'express';
import { getConnection } from '../module/db';
import { Classroom } from '../types/classrooms';

const router = Router({ mergeParams: true });

router.get('/', async (req, res) => {
  try {
    const conn = await getConnection();
    const r = await conn.execute(
      'SELECT * FROM classrooms, users_classrooms WHERE classrooms.class_id = users_classrooms.class_id AND users_classrooms.user_id = ?',
      [req.user.userId]
    );
    const rows = r[0] as any[];

    const datas = rows.map((row) => {
      const d: Classroom = {
        classId: row.class_id,
        name: row.name,
        description: row.description,
        ownerId: row.owner_id,
      };
      return d;
    });

    res.send(datas);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

router.get('/:class_id', async (req, res) => {
  try {
    const conn = await getConnection();
    const r = await conn.execute(
      'SELECT * FROM classrooms, users_classrooms WHERE classrooms.class_id = users_classrooms.class_id = ? AND users_classrooms.user_id = ?',
      [req.params.class_id, req.user.userId]
    );
    const [row] = r[0] as any[];

    const data: Classroom = {
      classId: row.class_id,
      name: row.name,
      description: row.description,
      ownerId: row.owner_id,
    };

    res.send(data);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
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
