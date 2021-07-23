import { Router } from "express";
import passport from "passport";
import jwt from 'jsonwebtoken'

const router = Router({ mergeParams: true })

router.post('/login', (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user) => {
    if (err || !user) return res.status(400).end();
    req.login(user, { session: false }, (error) => {
      if (error) next(error);
      const token = jwt.sign(
        {
          uid: user.uid,
        },
        process.env.SECRET_KEY!,
        { expiresIn: "7d" }
      );
      return res.json({ token });
    });
  })(req, res);
})

export default router