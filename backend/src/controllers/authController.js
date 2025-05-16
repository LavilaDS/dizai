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
        const { refreshToken, token, manager } = await authService.login(email, password);

        res.cookie('token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, 
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, 
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
            res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'strict',
      });
      res.sendStatus(204); // No Content
    } catch (err) {
      next(err);
    }
  }

async function refreshToken(req, res, next) {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token não fornecido.' });
        }
        const {token, manager} = await authService.refreshAccessToken(refreshToken);
        res.cookie('token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, 
        });
        res.status(200).json(manager);
    } catch (err) {
        next(err);
    }
}

module.exports = { 
    login,
    logout, 
    validateSession,
    refreshToken
};