import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';

export default (req, res, next) => {
  const guestPaths = ['/', '/proof/session'];
  if (guestPaths.includes(req.path)) return next();

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: true, message: 'Token not informed' });
  }

  //Pegando apenas o token do array
  const [, token] = authHeader.split(' ');

  try {
    jwt.verify(token, authConfig.secret, async (error, response) => {
      if (!error && response) {
        return next();
      } else {
        return res.status(401).json({ error: true, message: 'Invalid token' });
      }
    });
  } catch (error) {
    return res.status(401).json({ error: true, message: 'Invalid Token' });
  }
}