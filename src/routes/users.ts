import { Router } from 'express';
import { getConnection } from '../module/db';
import { User } from '../types/users';

const router = Router({ mergeParams: true });

router.get('/me', (req, res) => {
  const data: User = {
    userId: req.user.userId,
    name: req.user.name,
    orgName: req.user.orgName,
  };

  res.json(data);
});

export default router;
