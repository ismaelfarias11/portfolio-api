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
    console.error('Error obteniendo hero:', error);

    return res.status(500).json({
        ok: false,
        message: 'Error interno',
        error: error.message,
    });
    }
    });

router.get('/hero', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM hero
      LIMIT 1
    `);

    return res.json({
      ok: true,
      data: result.rows[0] || null,
    });
    } catch (error) {
    console.error('Error obteniendo hero:', error);

    return res.status(500).json({
        ok: false,
        message: 'Error interno',
        error: error.message,
    });
    }
});

router.get('/strengths', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM strengths
      ORDER BY position ASC
    `);

    return res.json({
      ok: true,
      data: result.rows,
    });
    } catch (error) {
    console.error('Error obteniendo strengths:', error);

    return res.status(500).json({
        ok: false,
        message: 'Error interno',
        error: error.message,
    });
    }
});

router.get('/contact-links', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM contact_links
      ORDER BY position ASC
    `);

    return res.json({
      ok: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno',
    });
  }
});

const authMiddleware = require('../middleware/auth.middleware');

// =========================
// Admin: actualizar Hero
// =========================
router.patch('/admin/hero', authMiddleware, async (req, res) => {
  const {
    badge,
    title_top,
    title_accent,
    description,
  } = req.body;

  if (!badge || !title_top || !title_accent || !description) {
    return res.status(400).json({
      ok: false,
      message: 'Todos los campos son obligatorios',
    });
  }

  try {
    const result = await db.query(
      `
      UPDATE hero
      SET
        badge = $1,
        title_top = $2,
        title_accent = $3,
        description = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = (
        SELECT id
        FROM hero
        LIMIT 1
      )
      RETURNING *
      `,
      [badge, title_top, title_accent, description]
    );

    return res.json({
      ok: true,
      message: 'Hero actualizado correctamente',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error actualizando hero:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno',
    });
  }
});

module.exports = router;