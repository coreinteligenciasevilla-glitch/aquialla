import express from 'express';
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { spawn } from 'child_process';
import crypto from 'crypto';
import { INITIAL_ITEMS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES } from './src/initialData';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize SQLite database
const dbPath = path.join(process.cwd(), 'aqui_alla.db');
console.log(`Conectando a la base de datos SQLite en: ${dbPath}`);
const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

// Safe migration check: If any legacy table exists without archived column, wipe them
let needsSchemaReset = false;
try {
  // Test querying legacy tables
  db.prepare('SELECT archived FROM items LIMIT 1').get();
} catch (e) {
  needsSchemaReset = true;
}

if (needsSchemaReset) {
  console.log('Detectada base de datos con esquema antiguo (falta archived). Recreando base de datos para multi-usuario con soporte de archivo...');
  db.exec('DROP TABLE IF EXISTS likes;');
  db.exec('DROP TABLE IF EXISTS settings;');
  db.exec('DROP TABLE IF EXISTS items;');
  db.exec('DROP TABLE IF EXISTS subcategories;');
  db.exec('DROP TABLE IF EXISTS categories;');
  db.exec('DROP TABLE IF EXISTS users;');
}

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    createdAt TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS subcategories (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    name TEXT NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    contentType TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    category_id TEXT,
    subcategory_id TEXT,
    user_id TEXT NOT NULL,
    archived INTEGER DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY(subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS likes (
    user_id TEXT NOT NULL,
    item_id TEXT NOT NULL,
    PRIMARY KEY(user_id, item_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(item_id) REFERENCES items(id) ON DELETE CASCADE
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    user_id TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT,
    PRIMARY KEY(user_id, key),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

// Middleware
app.use(express.json());

// Authentication Middleware
const requireAuth = (req: any, res: any, next: any) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'No autorizado. Cabecera x-user-id ausente.' });
  }
  
  // Verify user exists in the database
  try {
    const stmt = db.prepare('SELECT id FROM users WHERE id = ?');
    const user = stmt.get(userId);
    if (!user) {
      return res.status(401).json({ error: 'Sesión inválida o usuario inexistente.' });
    }
    req.userId = userId;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Error interno en la autenticación' });
  }
};

// Helper mapper to cast SQLite 0/1 integers to boolean
const mapItem = (row: any) => {
  if (!row) return row;
  return {
    ...row,
    archived: row.archived === 1
  };
};

// --- AUTHENTICATION ENDPOINTS ---

// POST /api/auth/register: Register a new user and seed their default sandbox
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y PIN de seguridad requeridos.' });
    }
    
    if (!/^\d{4}$/.test(password)) {
      return res.status(400).json({ error: 'La contraseña debe ser un PIN de exactamente 4 números.' });
    }
    
    // Check if user already exists
    const checkUserStmt = db.prepare('SELECT COUNT(*) as count FROM users WHERE email = ?');
    const userCount = checkUserStmt.get(email.toLowerCase().trim()) as { count: number };
    
    if (userCount.count > 0) {
      return res.status(409).json({ error: 'El correo electrónico ya se encuentra registrado.' });
    }
    
    const userId = 'usr_' + crypto.randomUUID().replace(/-/g, '');
    const createdAt = new Date().toISOString();
    
    // Insert new user
    const insertUserStmt = db.prepare(`
      INSERT INTO users (id, email, password, createdAt)
      VALUES (?, ?, ?, ?)
    `);
    insertUserStmt.run(userId, email.toLowerCase().trim(), password, createdAt);
    
    console.log(`Usuario registrado con éxito: ${email} (${userId}). Inicializando datos demo...`);
    
    // Seed default categories
    const insertCatStmt = db.prepare('INSERT INTO categories (id, name, type, user_id) VALUES (?, ?, ?, ?)');
    for (const cat of INITIAL_CATEGORIES) {
      insertCatStmt.run(cat.id + '_' + userId, cat.name, cat.type, userId);
    }
    
    // Seed default subcategories
    const insertSubcatStmt = db.prepare('INSERT INTO subcategories (id, category_id, name, user_id) VALUES (?, ?, ?, ?)');
    for (const sub of INITIAL_SUBCATEGORIES) {
      insertSubcatStmt.run(sub.id + '_' + userId, sub.category_id + '_' + userId, sub.name, userId);
    }
    
    // Seed default items
    const insertItemStmt = db.prepare(`
      INSERT INTO items (id, url, title, description, category, contentType, createdAt, category_id, subcategory_id, user_id, archived)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);
    
    for (const item of INITIAL_ITEMS) {
      insertItemStmt.run(
        item.id + '_' + userId,
        item.url,
        item.title,
        item.description || '',
        item.category,
        item.contentType,
        item.createdAt,
        item.category_id ? item.category_id + '_' + userId : null,
        item.subcategory_id ? item.subcategory_id + '_' + userId : null,
        userId
      );
    }
    
    // Seed default likes
    const insertLikeStmt = db.prepare('INSERT INTO likes (user_id, item_id) VALUES (?, ?)');
    const defaultLikes = ['1', '3', '5'];
    for (const likeId of defaultLikes) {
      insertLikeStmt.run(userId, likeId + '_' + userId);
    }
    
    // Seed default theme
    const insertThemeStmt = db.prepare('INSERT OR REPLACE INTO settings (user_id, key, value) VALUES (?, ?, ?)');
    insertThemeStmt.run(userId, 'theme', 'light');
    
    res.status(201).json({
      id: userId,
      email: email.toLowerCase().trim(),
      createdAt
    });
  } catch (error: any) {
    console.error('Error en /api/auth/register:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/login: Authenticate user by email & PIN
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y PIN requeridos.' });
    }
    
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email.toLowerCase().trim()) as any;
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'El correo electrónico o el PIN de 4 números son incorrectos.' });
    }
    
    res.json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    });
  } catch (error: any) {
    console.error('Error en /api/auth/login:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- PROTECTED DATA ENDPOINTS ---

// GET /api/items: get user-specific items
app.get('/api/items', requireAuth, (req: any, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM items WHERE user_id = ? ORDER BY createdAt DESC');
    const rows = stmt.all(req.userId) as any[];
    res.json(rows.map(mapItem));
  } catch (error: any) {
    console.error('Error en GET /api/items:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/items: add a new user-specific item
app.post('/api/items', requireAuth, (req: any, res) => {
  try {
    const { url, title, description, category, contentType, category_id, subcategory_id } = req.body;
    
    if (!url || !title || !category || !contentType) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO items (id, url, title, description, category, contentType, createdAt, category_id, subcategory_id, user_id, archived)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);
    
    stmt.run(
      id, 
      url, 
      title, 
      description || '', 
      category, 
      contentType, 
      createdAt, 
      category_id || null, 
      subcategory_id || null,
      req.userId
    );
    
    res.status(201).json({
      id,
      url,
      title,
      description,
      category,
      contentType,
      createdAt,
      category_id: category_id || null,
      subcategory_id: subcategory_id || null,
      archived: false
    });
  } catch (error: any) {
    console.error('Error en POST /api/items:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/items/:id: update user-specific item details
app.put('/api/items/:id', requireAuth, (req: any, res) => {
  try {
    const { id } = req.params;
    const { url, title, description, category, contentType, category_id, subcategory_id } = req.body;
    
    if (!url || !title || !category || !contentType) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    
    const stmt = db.prepare(`
      UPDATE items
      SET url = ?, title = ?, description = ?, category = ?, contentType = ?, category_id = ?, subcategory_id = ?
      WHERE id = ? AND user_id = ?
    `);
    
    stmt.run(
      url,
      title,
      description || '',
      category,
      contentType,
      category_id || null,
      subcategory_id || null,
      id,
      req.userId
    );
    
    res.json({ success: true, message: `Registro ${id} actualizado con éxito` });
  } catch (error: any) {
    console.error(`Error en PUT /api/items/${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/items/:id/toggle-archive: toggle archive state
app.post('/api/items/:id/toggle-archive', requireAuth, (req: any, res) => {
  try {
    const { id } = req.params;
    
    const getStmt = db.prepare('SELECT archived FROM items WHERE id = ? AND user_id = ?');
    const row = getStmt.get(id, req.userId) as { archived: number } | undefined;
    if (!row) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    
    const nextStatus = row.archived === 1 ? 0 : 1;
    const updateStmt = db.prepare('UPDATE items SET archived = ? WHERE id = ? AND user_id = ?');
    updateStmt.run(nextStatus, id, req.userId);
    
    res.json({ success: true, archived: nextStatus === 1 });
  } catch (error: any) {
    console.error(`Error en POST /api/items/${req.params.id}/toggle-archive:`, error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/items/:id: delete user-specific item
app.delete('/api/items/:id', requireAuth, (req: any, res) => {
  try {
    const { id } = req.params;
    
    const deleteItemStmt = db.prepare('DELETE FROM items WHERE id = ? AND user_id = ?');
    const deleteLikeStmt = db.prepare('DELETE FROM likes WHERE item_id = ? AND user_id = ?');
    
    deleteItemStmt.run(id, req.userId);
    deleteLikeStmt.run(id, req.userId);
    
    res.json({ success: true, message: `Registro ${id} eliminado correctamente` });
  } catch (error: any) {
    console.error(`Error en DELETE /api/items/${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/likes: get liked item IDs for active user
app.get('/api/likes', requireAuth, (req: any, res) => {
  try {
    const stmt = db.prepare('SELECT item_id FROM likes WHERE user_id = ?');
    const rows = stmt.all(req.userId) as { item_id: string }[];
    const likedIds = rows.map(row => row.item_id);
    res.json(likedIds);
  } catch (error: any) {
    console.error('Error en GET /api/likes:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/likes/:id/toggle: toggle favorite status for active user
app.post('/api/likes/:id/toggle', requireAuth, (req: any, res) => {
  try {
    const { id } = req.params;
    
    // Check if it already exists
    const checkStmt = db.prepare('SELECT COUNT(*) as count FROM likes WHERE user_id = ? AND item_id = ?');
    const result = checkStmt.get(req.userId, id) as { count: number };
    
    let liked = false;
    if (result.count > 0) {
      const deleteStmt = db.prepare('DELETE FROM likes WHERE user_id = ? AND item_id = ?');
      deleteStmt.run(req.userId, id);
    } else {
      const insertStmt = db.prepare('INSERT INTO likes (user_id, item_id) VALUES (?, ?)');
      insertStmt.run(req.userId, id);
      liked = true;
    }
    
    res.json({ success: true, liked });
  } catch (error: any) {
    console.error(`Error en POST /api/likes/${req.params.id}/toggle:`, error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/theme: get active user's visual theme
app.get('/api/theme', requireAuth, (req: any, res) => {
  try {
    const stmt = db.prepare("SELECT value FROM settings WHERE user_id = ? AND key = 'theme'");
    const row = stmt.get(req.userId) as { value: string } | undefined;
    res.json({ theme: row ? row.value : 'light' });
  } catch (error: any) {
    console.error('Error en GET /api/theme:', error);
    res.json({ theme: 'light' });
  }
});

// POST /api/theme: save active user's visual theme
app.post('/api/theme', requireAuth, (req: any, res) => {
  try {
    const { theme } = req.body;
    if (theme !== 'light' && theme !== 'dark') {
      return res.status(400).json({ error: 'Tema inválido' });
    }
    
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (user_id, key, value) VALUES (?, ?, ?)');
    stmt.run(req.userId, 'theme', theme);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error en POST /api/theme:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/categories: get user-specific categories
app.get('/api/categories', requireAuth, (req: any, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM categories WHERE user_id = ? ORDER BY name ASC');
    res.json(stmt.all(req.userId));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/categories: create user-specific category
app.post('/api/categories', requireAuth, (req: any, res) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const id = 'cat_' + crypto.randomBytes(4).toString('hex');
    const stmt = db.prepare('INSERT INTO categories (id, name, type, user_id) VALUES (?, ?, ?, ?)');
    stmt.run(id, name, type, req.userId);
    res.status(201).json({ id, name, type });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/categories/:id: delete user-specific category
app.delete('/api/categories/:id', requireAuth, (req: any, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM categories WHERE id = ? AND user_id = ?');
    stmt.run(id, req.userId);
    
    // Cascade delete subcategories for this category and user
    const subcatStmt = db.prepare('DELETE FROM subcategories WHERE category_id = ? AND user_id = ?');
    subcatStmt.run(id, req.userId);
    
    // Clear items category references for this user
    const clearStmt = db.prepare('UPDATE items SET category_id = NULL, subcategory_id = NULL WHERE category_id = ? AND user_id = ?');
    clearStmt.run(id, req.userId);
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/subcategories: get user-specific subcategories
app.get('/api/subcategories', requireAuth, (req: any, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM subcategories WHERE user_id = ? ORDER BY name ASC');
    res.json(stmt.all(req.userId));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/subcategories: create user-specific subcategory
app.post('/api/subcategories', requireAuth, (req: any, res) => {
  try {
    const { category_id, name } = req.body;
    if (!category_id || !name) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const id = 'sub_' + crypto.randomBytes(4).toString('hex');
    const stmt = db.prepare('INSERT INTO subcategories (id, category_id, name, user_id) VALUES (?, ?, ?, ?)');
    stmt.run(id, category_id, name, req.userId);
    res.status(201).json({ id, category_id, name });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/subcategories/:id: delete user-specific subcategory
app.delete('/api/subcategories/:id', requireAuth, (req: any, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM subcategories WHERE id = ? AND user_id = ?');
    stmt.run(id, req.userId);
    
    // Clear items subcategory references for this user
    const clearStmt = db.prepare('UPDATE items SET subcategory_id = NULL WHERE subcategory_id = ? AND user_id = ?');
    clearStmt.run(id, req.userId);
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/history: get user-specific joined history logs
app.get('/api/history', requireAuth, (req: any, res) => {
  try {
    const stmt = db.prepare(`
      SELECT 
        i.*, 
        c.name as categoryName, 
        s.name as subcategoryName 
      FROM items i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN subcategories s ON i.subcategory_id = s.id
      WHERE i.user_id = ?
      ORDER BY i.createdAt DESC
    `);
    const rows = stmt.all(req.userId) as any[];
    res.json(rows.map(mapItem));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reset: reset active user's sandbox back to default demos
app.post('/api/reset', requireAuth, (req: any, res) => {
  try {
    const id = req.userId;
    console.log(`Restableciendo base de datos para el usuario ${id}...`);
    
    db.prepare('DELETE FROM items WHERE user_id = ?').run(id);
    db.prepare('DELETE FROM likes WHERE user_id = ?').run(id);
    db.prepare("DELETE FROM settings WHERE user_id = ? AND key = 'theme'").run(id);
    db.prepare('DELETE FROM subcategories WHERE user_id = ?').run(id);
    db.prepare('DELETE FROM categories WHERE user_id = ?').run(id);
    
    // Re-seed categories
    const insertCatStmt = db.prepare('INSERT INTO categories (id, name, type, user_id) VALUES (?, ?, ?, ?)');
    for (const cat of INITIAL_CATEGORIES) {
      insertCatStmt.run(cat.id + '_' + id, cat.name, cat.type, id);
    }
    
    // Re-seed subcategories
    const insertSubcatStmt = db.prepare('INSERT INTO subcategories (id, category_id, name, user_id) VALUES (?, ?, ?, ?)');
    for (const sub of INITIAL_SUBCATEGORIES) {
      insertSubcatStmt.run(sub.id + '_' + id, sub.category_id + '_' + id, sub.name, id);
    }
    
    // Re-seed items
    const insertItemStmt = db.prepare(`
      INSERT INTO items (id, url, title, description, category, contentType, createdAt, category_id, subcategory_id, user_id, archived)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);
    for (const item of INITIAL_ITEMS) {
      insertItemStmt.run(
        item.id + '_' + id,
        item.url,
        item.title,
        item.description || '',
        item.category,
        item.contentType,
        item.createdAt,
        item.category_id ? item.category_id + '_' + id : null,
        item.subcategory_id ? item.subcategory_id + '_' + id : null,
        id
      );
    }
    
    // Re-seed likes
    const insertLikeStmt = db.prepare('INSERT INTO likes (user_id, item_id) VALUES (?, ?)');
    const defaultLikes = ['1', '3', '5'];
    for (const likeId of defaultLikes) {
      insertLikeStmt.run(id, likeId + '_' + id);
    }
    
    // Reset theme settings
    const insertThemeStmt = db.prepare('INSERT OR REPLACE INTO settings (user_id, key, value) VALUES (?, ?, ?)');
    insertThemeStmt.run(id, 'theme', 'light');
    
    res.json({ success: true, message: 'Entorno de usuario restablecido con éxito' });
  } catch (error: any) {
    console.error('Error en POST /api/reset:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend build in production mode
if (process.env.NODE_ENV === 'production') {
  console.log('Iniciando en modo PRODUCCIÓN - Sirviendo frontend estático...');
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start backend server
const server = app.listen(PORT, () => {
  console.log(`Servidor Express ejecutándose en el puerto ${PORT}`);
});

// In development, spawn the Vite server concurrently
if (process.env.NODE_ENV !== 'production') {
  console.log('Iniciando en modo DESARROLLO - Lanzando servidor de desarrollo de Vite...');
  
  const vite = spawn('npx', ['vite', '--port=3000', '--host=0.0.0.0'], {
    stdio: 'inherit',
    shell: true
  });
  
  const handleExit = () => {
    console.log('Deteniendo subprocesos...');
    vite.kill();
    server.close();
    process.exit();
  };
  
  process.on('SIGINT', handleExit);
  process.on('SIGTERM', handleExit);
  
  vite.on('exit', (code) => {
    console.log(`Vite finalizado con código: ${code}`);
    server.close();
    process.exit(code || 0);
  });
}
