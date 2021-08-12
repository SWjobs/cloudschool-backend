import { Router } from 'express';
import { getConnection } from '../module/db';

const router = Router({ mergeParams: true });

router.get('/me', (req, res) => {
  console.log(req.user);
});

export default router;
