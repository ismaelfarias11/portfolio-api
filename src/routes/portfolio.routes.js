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

// =========================
// Admin: actualizar About
// =========================

router.patch(
  "/admin/profile",
  authMiddleware,
  async (req, res) => {
    const {
      about_title,
      about_paragraph_1,
      about_paragraph_2,
    } = req.body;

    try {
      const result = await db.query(
        `
        UPDATE profile
        SET
          about_title = $1,
          about_paragraph_1 = $2,
          about_paragraph_2 = $3
        WHERE id = (
          SELECT id
          FROM profile
          LIMIT 1
        )
        RETURNING *
        `,
        [
          about_title,
          about_paragraph_1,
          about_paragraph_2,
        ]
      );

      return res.json({
        ok: true,
        data: result.rows[0],
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        ok: false,
        message: "Error interno",
      });
    }
  }
); 

// =========================
// Admin: crear tecnología
// =========================
router.post('/admin/technologies', authMiddleware, async (req, res) => {
  const { name, category, position } = req.body;

  if (!name) {
    return res.status(400).json({
      ok: false,
      message: 'name es obligatorio',
    });
  }

  try {
    const result = await db.query(
      `
      INSERT INTO technologies (name, category, position)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [name, category || null, position || 0]
    );

    return res.json({
      ok: true,
      message: 'Tecnología creada',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creando tecnología:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno',
    });
  }
});

// =========================
// Admin: actualizar tecnología
// =========================
router.patch('/admin/technologies/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, category, position } = req.body;

  if (!name) {
    return res.status(400).json({
      ok: false,
      message: 'name es obligatorio',
    });
  }

  try {
    const result = await db.query(
      `
      UPDATE technologies
      SET
        name = $1,
        category = $2,
        position = $3
      WHERE id = $4
      RETURNING *
      `,
      [name, category || null, position || 0, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'Tecnología no encontrada',
      });
    }

    return res.json({
      ok: true,
      message: 'Tecnología actualizada',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error actualizando tecnología:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno',
    });
  }
});

// =========================
// Admin: eliminar tecnología
// =========================
router.delete('/admin/technologies/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `
      DELETE FROM technologies
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'Tecnología no encontrada',
      });
    }

    return res.json({
      ok: true,
      message: 'Tecnología eliminada',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error eliminando tecnología:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno',
    });
  }
});

// =========================
// Admin: crear proyecto
// =========================
router.post('/admin/projects', authMiddleware, async (req, res) => {
  const {
    name,
    slug,
    type,
    status,
    summary,
    description,
    live_url,
    api_url,
    github_url,
    featured,
    position,
  } = req.body;

  if (!name || !slug || !summary) {
    return res.status(400).json({
      ok: false,
      message: 'name, slug y summary son obligatorios',
    });
  }

  try {
    const result = await db.query(
      `
      INSERT INTO projects (
        name,
        slug,
        type,
        status,
        summary,
        description,
        live_url,
        api_url,
        github_url,
        featured,
        position
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
      `,
      [
        name,
        slug,
        type || null,
        status || null,
        summary,
        description || null,
        live_url || null,
        api_url || null,
        github_url || null,
        Boolean(featured),
        Number(position) || 0,
      ]
    );

    return res.json({
      ok: true,
      message: 'Proyecto creado',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creando proyecto:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno',
    });
  }
});

// =========================
// Admin: actualizar proyecto
// =========================
router.patch('/admin/projects/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  const {
    name,
    slug,
    type,
    status,
    summary,
    description,
    live_url,
    api_url,
    github_url,
    featured,
    position,
  } = req.body;

  if (!name || !slug || !summary) {
    return res.status(400).json({
      ok: false,
      message: 'name, slug y summary son obligatorios',
    });
  }

  try {
    const result = await db.query(
      `
      UPDATE projects
      SET
        name = $1,
        slug = $2,
        type = $3,
        status = $4,
        summary = $5,
        description = $6,
        live_url = $7,
        api_url = $8,
        github_url = $9,
        featured = $10,
        position = $11,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *
      `,
      [
        name,
        slug,
        type || null,
        status || null,
        summary,
        description || null,
        live_url || null,
        api_url || null,
        github_url || null,
        Boolean(featured),
        Number(position) || 0,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'Proyecto no encontrado',
      });
    }

    return res.json({
      ok: true,
      message: 'Proyecto actualizado',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error actualizando proyecto:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno',
    });
  }
});

// =========================
// Admin: eliminar proyecto
// =========================
router.delete('/admin/projects/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `
      DELETE FROM projects
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'Proyecto no encontrado',
      });
    }

    return res.json({
      ok: true,
      message: 'Proyecto eliminado',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error eliminando proyecto:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno',
    });
  }
});

// =========================
// Admin: crear contact link
// =========================
router.post('/admin/contact-links', authMiddleware, async (req, res) => {
  const { label, value, href, position } = req.body;

  if (!label || !value || !href) {
    return res.status(400).json({
      ok: false,
      message: 'label, value y href son obligatorios',
    });
  }

  try {
    const result = await db.query(
      `
      INSERT INTO contact_links (label, value, href, position)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [label, value, href, Number(position) || 0]
    );

    return res.json({
      ok: true,
      message: 'Link creado',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creando contact link:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno',
    });
  }
});

// =========================
// Admin: actualizar contact link
// =========================
router.patch('/admin/contact-links/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { label, value, href, position } = req.body;

  if (!label || !value || !href) {
    return res.status(400).json({
      ok: false,
      message: 'label, value y href son obligatorios',
    });
  }

  try {
    const result = await db.query(
      `
      UPDATE contact_links
      SET
        label = $1,
        value = $2,
        href = $3,
        position = $4
      WHERE id = $5
      RETURNING *
      `,
      [label, value, href, Number(position) || 0, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'Link no encontrado',
      });
    }

    return res.json({
      ok: true,
      message: 'Link actualizado',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error actualizando contact link:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno',
    });
  }
});

// =========================
// Admin: eliminar contact link
// =========================
router.delete('/admin/contact-links/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `
      DELETE FROM contact_links
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'Link no encontrado',
      });
    }

    return res.json({
      ok: true,
      message: 'Link eliminado',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error eliminando contact link:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno',
    });
  }
});

module.exports = router;