const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');

const googleClient = new OAuth2Client(process.env.AUTH_GOOGLE_ID);

function generateToken(user) {
  return jwt.sign(
    {
      email: user.email,
      name: user.name,
      picture: user.picture,
      role: 'admin',
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
}

router.post('/google', async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({
      ok: false,
      message: 'credential es obligatorio',
    });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.AUTH_GOOGLE_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(401).json({
        ok: false,
        message: 'No se pudo obtener email de Google',
      });
    }

    if (payload.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        ok: false,
        message: 'No autorizado',
      });
    }

    const user = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      role: 'admin',
    };

    const token = generateToken(user);

    return res.json({
      ok: true,
      message: 'Login admin correcto',
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error('Error Google Auth:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error autenticando con Google',
    });
  }
});

router.get('/me', authMiddleware, (req, res) => {
  return res.json({
    ok: true,
    data: {
      user: req.user,
    },
  });
});

module.exports = router;