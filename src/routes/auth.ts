import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { getConnection } from '../module/db';
import { AuthData } from '../types/authtypes';
import { hash, genSalt } from 'bcrypt';

const router = Router({ mergeParams: true });

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err || !user) return res.status(400).end();
    req.login(user, { session: false }, (error) => {
      if (error) next(error);
      console.log(user);
      const token = jwt.sign(
        {
          uid: user.userId,
        },
        process.env.SECRET_KEY ?? '',
        { expiresIn: '7d' }
      );
      return res.json({ token, expires_in: 7 * 24 * 60 * 60 });
    });
  })(req, res);
});

router.get('/check-duplicate', async (req, res) => {
  try {
    const { user_id } = req.query;

    const conn = await getConnection();
    const r = await conn.execute('SELECT * FROM users WHERE `user_id` = ?', [
      user_id,
    ]);
    const rows = r[0] as any[];

    if (rows.length) return res.json({ isDuplicate: true });
    res.json({ isDuplicate: false });
  } catch (e) {
    console.error(e);
    res.status(500).json({ code: 'DB_QUERY_ERROR', errData: e });
  }
});

router.post('/register', async (req, res) => {
  const { userId, name, password, orgName } = req.body as AuthData;

  try {
    const conn = await getConnection();
    const r = await conn.execute('SELECT * FROM users WHERE `user_id` = ?', [
      userId,
    ]);
    const rows = r[0] as any[];

    if (rows.length)
      return res.status(400).json({
        code: 'USER_ALREADY_EXISTS',
        message: '해당 유저가 이미 존재합니다. 다른 아이디를 사용하십시오.',
      });

    await conn.execute(
      'INSERT INTO users SET user_id = ?, name = ?, password = ?, orgname = ?',
      [userId, name, await hash(password, await genSalt()), orgName ?? null]
    );
    res.json({ code: 'OK' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ code: 'DB_QUERY_ERROR', errData: e });
  }
});

export default router;
