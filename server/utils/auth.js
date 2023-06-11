const jwt = require('jsonwebtoken');

// Set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // Middleware function for authenticating requests
  authMiddleware: function (req, res, next) {
    // Allows token to be sent via req.query or headers
    let token = req.headers.authorization || '';

    // ["Bearer", "<tokenvalue>"]
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    if (!token) {
      console.log('No token found!');
      return res.status(400).json({ message: 'You have no token!' });
    }

    try {
      // Verify token and get user data out of it
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      next();
    } catch (err) {
      console.log('Invalid token');
      return res.status(400).json({ message: 'Invalid token!' });
    }
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
