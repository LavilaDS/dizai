const authService = require('../services/authService');

async function validateSession(req, res) {
    res.sendStatus(200);
  }
  

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }
        const { token, manager } = await authService.login(email, password);

        res.cookie('token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, 
        });
        res.status(200).json({ manager });
    } catch (err) {
        next(err);
    }
}

async function logout(req, res, next) {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'strict',
      });
      res.sendStatus(204); // No Content
    } catch (err) {
      next(err);
    }
  }

module.exports = { 
    login,
    logout, 
    validateSession
};