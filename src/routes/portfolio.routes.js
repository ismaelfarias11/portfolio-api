const express = require('express');
const router = express.Router();
const db = require('../config/db');

// =========================
// Health
// =========================
router.get('/health', async (req, res) => {
  return res.json({
    ok: true,
    message: 'Portfolio API funcionando',
  });
});

// =========================
// Profile
// =========================
router.get('/profile', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM profile
      LIMIT 1
    `);

    return res.json({
      ok: true,
      data: result.rows[0] || null,
    });
  } catch (error) {
    console.error('Error obteniendo profile:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno',
    });
  }
});

// =========================
// Projects
// =========================
router.get('/projects', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM projects
      ORDER BY position ASC
    `);

    return res.json({
      ok: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error obteniendo projects:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno',
    });
  }
});

// =========================
// Featured projects
// =========================
router.get('/projects/featured', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM projects
      WHERE featured = true
      ORDER BY position ASC
    `);

    return res.json({
      ok: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error obteniendo featured projects:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno',
    });
  }
});

// =========================
// Technologies
// =========================
router.get('/technologies', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM technologies
      ORDER BY position ASC
    `);

    return res.json({
      ok: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error obteniendo technologies:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno',
    });
  }
});

module.exports = router;