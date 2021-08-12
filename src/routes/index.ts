import { Router } from 'express';
import passport from 'passport';
import auth from './auth';
import classrooms from './classrooms';
import users from './users';

const router = Router({ mergeParams: true });
router.use('/auth', auth);
router.use(
  '/classrooms',
  passport.authenticate('jwt', { session: false }),
  classrooms
);
router.use('/users', passport.authenticate('jwt', { session: false }), users);

export default router;
