/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import passport from 'passport';
import passportJWT from 'passport-jwt';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import { getConnection } from '../module/db';

const JWTStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;
const LocalStrategy = passportLocal.Strategy;

const passportConfig = () => {
  const LocalStrategyOption = {
    usernameField: 'uid',
    passwordField: 'password',
  };

  const jwtStrategyOption = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY ?? '',
  };

  passport.use(
    new LocalStrategy(LocalStrategyOption, async (uid, password, done) => {
      let user;
      try {
        const conn = await getConnection();

        const r = await conn.execute(
          'SELECT * FROM users WHERE `user_id` = ?',
          [uid]
        );
        const row = (r[0] as any)[0];
        user = {
          userId: row.user_id,
          name: row.name,
          password: row.password,
          orgName: row.orgname,
        };

        if (!user) return done(null, false);
        const isSamePassword = await bcrypt.compare(password, user.password);
        if (!isSamePassword) return done(null, false);
      } catch (e) {
        done(e);
      }
      return done(null, user);
    })
  );

  passport.use(
    new JWTStrategy(jwtStrategyOption, async (payload, done) => {
      let user;
      try {
        const conn = await getConnection();

        const r = await conn.execute(
          'SELECT * FROM users WHERE `user_id` = ?',
          [payload.uid]
        );
        const row = (r[0] as any)[0];
        user = {
          userId: row.user_id,
          name: row.name,
          password: row.password,
          orgName: row.orgname,
        };

        if (!user) return done(null, false);
      } catch (e) {
        return done(e);
      }
      return done(null, user);
    })
  );
};

export default passportConfig;
