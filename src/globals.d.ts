import { AuthData } from './types/authtypes';

declare global {
  namespace Express {
    interface Request {
      user: AuthData;
    }
  }
}
