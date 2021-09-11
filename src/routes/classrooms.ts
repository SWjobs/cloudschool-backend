import { Router } from 'express';
import { getConnection } from '../module/db';
import {
  Classroom,
  Debate,
  DebateComment,
  Notice,
  TimeTableCell,
} from '../types/classrooms';
import { User } from '../types/users';
import { randomUUID } from 'crypto';
import { format } from 'mysql2';

const router = Router({ mergeParams: true });

router.get('/', async (req, res) => {
  try {
    const conn = await getConnection();
    const r = await conn.execute(
      'SELECT classrooms.* FROM classrooms, users_classrooms WHERE classrooms.class_id = users_classrooms.class_id AND users_classrooms.user_id = ?',
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
      'SELECT classrooms.* FROM classrooms, users_classrooms WHERE classrooms.class_id = users_classrooms.class_id = ? AND users_classrooms.user_id = ?',
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

router.get('/:class_id/members', async (req, res) => {
  try {
    const conn = await getConnection();
    const r = await conn.execute(
      'SELECT users.* FROM users, users_classrooms WHERE users_classrooms.class_id = ? AND users_classrooms.user_id = users.user_id',
      [req.params.class_id]
    );
    const rows = r[0] as any[];

    const datas = rows.map((row) => {
      const d: User = {
        userId: row.user_id,
        name: row.name,
        orgName: row.orgname,
      };
      return d;
    });

    res.send(datas);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

router.get('/:class_id/timetable', async (req, res) => {
  try {
    const conn = await getConnection();
    const r = await conn.execute(
      'SELECT timetables.* FROM timetables, users_classrooms WHERE timetables.class_id = users_classrooms.class_id = ? AND users_classrooms.user_id = ?',
      [req.params.class_id, req.user.userId]
    );
    const rows = r[0] as any[];

    const datas = rows.map((row) => {
      const d: TimeTableCell = {
        uuid: row.uuid,
        classId: row.class_id,
        dayweek: row.dayweek,
        period: row.period,
        subject: row.subject,
        teacher: row.teacher,
      };
      return d;
    });

    res.send(datas);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

router.get('/:class_id/notices', async (req, res) => {
  try {
    const conn = await getConnection();
    const r = await conn.execute(
      'SELECT notices.* FROM notices, users_classrooms WHERE notices.class_id = users_classrooms.class_id = ? AND users_classrooms.user_id = ?',
      [req.params.class_id, req.user.userId]
    );
    const rows = r[0] as any[];

    const datas = rows.map((row) => {
      const d: Notice = {
        noticeId: row.notice_id,
        classId: row.class_id,
        title: row.title,
        content: row.content,
        writerId: row.writer_id,
        created_at: row.created_at,
      };
      return d;
    });

    res.send(datas);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

router.get('/:class_id/notices/:notice_id', async (req, res) => {
  try {
    const conn = await getConnection();
    const r = await conn.execute(
      'SELECT notices.* FROM notices, users_classrooms WHERE notices.class_id = users_classrooms.class_id = ? AND users_classrooms.user_id = ? AND notices.notice_id = ?',
      [req.params.class_id, req.user.userId, req.params.notice_id]
    );
    const [row] = r[0] as any[];

    const data: Notice = {
      noticeId: row.notice_id,
      classId: row.class_id,
      title: row.title,
      content: row.content,
      writerId: row.writer_id,
      created_at: row.created_at,
    };

    res.send(data);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

router.post('/:class_id/debates', async (req, res) => {
  const data: Omit<
    Debate,
    'debateId' | 'classId' | 'status' | 'created_by' | 'created_at'
  > = req.body;

  try {
    const conn = await getConnection();

    const uid = randomUUID().replace(/-/gi, '');
    const now = new Date();

    await conn.execute(
      format('INSERT INTO debates SET ?', [
        {
          debate_id: uid,
          class_id: req.params.class_id,
          name: data.name,
          description: data.description,
          status: 'open',
          subject: data.subject,
          created_by: req.user.userId,
          created_at: now,
        },
      ])
    );

    const d: Debate = {
      debateId: uid,
      classId: req.params.class_id,
      name: data.name,
      description: data.description,
      status: 'open',
      subject: data.subject,
      created_by: req.params.class_id,
      created_at: now.toISOString(),
    };

    res.send(d);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

router.get('/:class_id/debates', async (req, res) => {
  try {
    const conn = await getConnection();
    const r = await conn.execute(
      'SELECT debates.* FROM debates, users_classrooms WHERE debates.class_id = users_classrooms.class_id = ? AND users_classrooms.user_id = ?',
      [req.params.class_id, req.user.userId]
    );
    const rows = r[0] as any[];

    const datas = rows.map((row) => {
      const d: Debate = {
        debateId: row.debate_id,
        classId: row.class_id,
        name: row.name,
        description: row.description,
        status: row.status,
        subject: row.subject,
        created_by: row.created_by,
        created_at: row.created_at,
      };
      return d;
    });

    res.send(datas);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

router.get('/:class_id/debates/:debate_id', async (req, res) => {
  try {
    const conn = await getConnection();
    const r = await conn.execute(
      'SELECT debates.* FROM debates, users_classrooms WHERE debates.class_id = users_classrooms.class_id = ? AND users_classrooms.user_id = ? AND debates.debate_id = ?',
      [req.params.class_id, req.user.userId, req.params.debate_id]
    );
    const [row] = r[0] as any[];

    const data: Debate = {
      debateId: row.debate_id,
      classId: row.class_id,
      name: row.name,
      description: row.description,
      status: row.status,
      subject: row.subject,
      created_by: row.created_by,
      created_at: row.created_at,
    };

    res.send(data);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

router.get('/:class_id/debates/:debate_id/comments', async (req, res) => {
  try {
    const conn = await getConnection();
    const r = await conn.execute(
      `SELECT debates_comments.* FROM debates, debates_comments, users_classrooms
      WHERE users_classrooms.class_id = ?
        AND users_classrooms.user_id = ?
        AND users_classrooms.class_id = debates.class_id
        AND debates.debate_id = debates_comments.debate_id
        AND debates_comments.debate_id = ?
      ORDER BY debates_comments.created_at ASC`,
      [req.params.class_id, req.user.userId, req.params.debate_id]
    );
    const rows = r[0] as any[];

    const datas = rows.map((row) => {
      const d: DebateComment = {
        commentId: row.comment_id,
        debateId: row.debate_id,
        userId: row.user_id,
        content: row.content,
        created_at: row.created_at,
      };
      return d;
    });

    res.send(datas);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

router.post('/:class_id/debates/:debate_id', async (req, res) => {
  try {
    const conn = await getConnection();

    const created_at = new Date();
    const data: DebateComment = {
      commentId: randomUUID().replace(/-/gi, ''),
      debateId: req.params.debate_id,
      userId: req.user.userId,
      content: req.body.content,
      created_at: created_at.toISOString(),
    };

    await conn.execute(
      `INSERT INTO debates_comments SET comment_id=?, debate_id=?, user_id=?, content=?, created_at=?`,
      [
        data.commentId,
        req.params.debate_id,
        req.user.userId,
        req.body.content,
        created_at,
      ]
    );

    res.json(data);
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
