var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_node_sqlite = require("node:sqlite");
var import_path = __toESM(require("path"), 1);
var import_child_process = require("child_process");
var import_crypto = __toESM(require("crypto"), 1);

// src/initialData.ts
var INITIAL_CATEGORIES = [
  { id: "cat_inspiracion_visual", name: "Inspiraci\xF3n Visual", type: "aqui" },
  { id: "cat_codigo_limpio", name: "C\xF3digo y Patrones", type: "aqui" },
  { id: "cat_ux_fails", name: "Errores de Usabilidad", type: "alla" },
  { id: "cat_codigo_fails", name: "Malas Pr\xE1cticas C\xF3digo", type: "alla" }
];
var INITIAL_SUBCATEGORIES = [
  { id: "sub_glassmorphism", category_id: "cat_inspiracion_visual", name: "Glassmorphism" },
  { id: "sub_animaciones", category_id: "cat_inspiracion_visual", name: "Animaciones y Framer" },
  { id: "sub_react_19", category_id: "cat_codigo_limpio", name: "React 19 / State" },
  { id: "sub_touch_targets", category_id: "cat_ux_fails", name: "Tama\xF1o de Bot\xF3n" },
  { id: "sub_infinite_loops", category_id: "cat_codigo_fails", name: "Loops de useEffect" },
  { id: "sub_tree_shaking", category_id: "cat_codigo_fails", name: "Imports Gigantes" }
];
var INITIAL_ITEMS = [
  {
    id: "1",
    title: "React 19 Clean Forms con useActionState",
    url: "https://www.youtube.com/watch?v=y_Y6u49vYTo",
    description: "Incre\xEDble patr\xF3n para simplificar la gesti\xF3n de estados de carga, errores y \xE9xito en formularios interactivos sin boilerplate adicional.",
    category: "aqui",
    contentType: "youtube",
    createdAt: new Date(Date.now() - 36e5 * 24).toISOString(),
    // 1 day ago
    category_id: "cat_codigo_limpio",
    subcategory_id: "sub_react_19"
  },
  {
    id: "2",
    title: "El Peligroso Antipantr\xF3n del useEffect Infinito",
    url: "https://www.linkedin.com/posts/react-hooks-pitfalls",
    description: "Un desglose t\xE9cnico de c\xF3mo mutar estados dentro de un useEffect sin dependencias primitivas estables causa loops de re-render destructivos.",
    category: "alla",
    contentType: "linkedin",
    createdAt: new Date(Date.now() - 36e5 * 18).toISOString(),
    // 18h ago
    category_id: "cat_codigo_fails",
    subcategory_id: "sub_infinite_loops"
  },
  {
    id: "3",
    title: "Visuales Neon Glassmorphism Modernos",
    url: "https://www.instagram.com/p/C-design-trends",
    description: "Gu\xEDa paso a paso para lograr el desenfoque de fondo perfecto (backdrop-blur) combinado con bordes transl\xFAcidos de alto impacto t\xE1ctil.",
    category: "aqui",
    contentType: "instagram",
    createdAt: new Date(Date.now() - 36e5 * 12).toISOString(),
    // 12h ago
    category_id: "cat_inspiracion_visual",
    subcategory_id: "sub_glassmorphism"
  },
  {
    id: "4",
    title: "Librer\xEDas Gigantes Sin Tree-shaking en Producci\xF3n",
    url: "https://example.com/bad-performance-case",
    description: "Caso de estudio de c\xF3mo importar lodash completo en lugar de sub-m\xF3dulos espec\xEDficos infl\xF3 el bundle de producci\xF3n en 2.3MB innecesarios.",
    category: "alla",
    contentType: "web",
    createdAt: new Date(Date.now() - 36e5 * 6).toISOString(),
    // 6h ago
    category_id: "cat_codigo_fails",
    subcategory_id: "sub_tree_shaking"
  },
  {
    id: "5",
    title: "Micro-interacciones Fluidas con Framer Motion",
    url: "https://tiktok.com/@creative.dev/video/89127391",
    description: "Aprende a animar listas din\xE1micas con layouts compartidos de forma fluida y con s\xF3lo un par de l\xEDneas de c\xF3digo declarativo.",
    category: "aqui",
    contentType: "tiktok",
    createdAt: new Date(Date.now() - 36e5 * 2).toISOString(),
    // 2h ago
    category_id: "cat_inspiracion_visual",
    subcategory_id: "sub_animaciones"
  },
  {
    id: "6",
    title: "Botones de Acci\xF3n Sin Target T\xE1ctil M\xEDnimo",
    url: "https://tiktok.com/@ux.fails/video/77218391",
    description: "Ejemplo de por qu\xE9 dise\xF1ar botones menores a 44px de tama\xF1o t\xE1ctil rompe la usabilidad m\xF3vil y frustra a los usuarios finales.",
    category: "alla",
    contentType: "tiktok",
    createdAt: new Date(Date.now() - 36e5 * 1).toISOString(),
    // 1h ago
    category_id: "cat_ux_fails",
    subcategory_id: "sub_touch_targets"
  }
];

// server.ts
var app = (0, import_express.default)();
var PORT = process.env.PORT || 3001;
var dbPath = import_path.default.join(process.cwd(), "aqui_alla.db");
console.log(`Conectando a la base de datos SQLite en: ${dbPath}`);
var db = new import_node_sqlite.DatabaseSync(dbPath);
db.exec("PRAGMA foreign_keys = ON;");
var needsSchemaReset = false;
try {
  db.prepare("SELECT archived FROM items LIMIT 1").get();
} catch (e) {
  needsSchemaReset = true;
}
if (needsSchemaReset) {
  console.log("Detectada base de datos con esquema antiguo (falta archived). Recreando base de datos para multi-usuario con soporte de archivo...");
  db.exec("DROP TABLE IF EXISTS likes;");
  db.exec("DROP TABLE IF EXISTS settings;");
  db.exec("DROP TABLE IF EXISTS items;");
  db.exec("DROP TABLE IF EXISTS subcategories;");
  db.exec("DROP TABLE IF EXISTS categories;");
  db.exec("DROP TABLE IF EXISTS users;");
}
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
app.use(import_express.default.json());
var requireAuth = (req, res, next) => {
  const userId = req.headers["x-user-id"];
  if (!userId) {
    return res.status(401).json({ error: "No autorizado. Cabecera x-user-id ausente." });
  }
  try {
    const stmt = db.prepare("SELECT id FROM users WHERE id = ?");
    const user = stmt.get(userId);
    if (!user) {
      return res.status(401).json({ error: "Sesi\xF3n inv\xE1lida o usuario inexistente." });
    }
    req.userId = userId;
    next();
  } catch (error) {
    return res.status(500).json({ error: "Error interno en la autenticaci\xF3n" });
  }
};
var mapItem = (row) => {
  if (!row) return row;
  return {
    ...row,
    archived: row.archived === 1
  };
};
app.post("/api/auth/register", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email y PIN de seguridad requeridos." });
    }
    if (!/^\d{4}$/.test(password)) {
      return res.status(400).json({ error: "La contrase\xF1a debe ser un PIN de exactamente 4 n\xFAmeros." });
    }
    const checkUserStmt = db.prepare("SELECT COUNT(*) as count FROM users WHERE email = ?");
    const userCount = checkUserStmt.get(email.toLowerCase().trim());
    if (userCount.count > 0) {
      return res.status(409).json({ error: "El correo electr\xF3nico ya se encuentra registrado." });
    }
    const userId = "usr_" + import_crypto.default.randomUUID().replace(/-/g, "");
    const createdAt = (/* @__PURE__ */ new Date()).toISOString();
    const insertUserStmt = db.prepare(`
      INSERT INTO users (id, email, password, createdAt)
      VALUES (?, ?, ?, ?)
    `);
    insertUserStmt.run(userId, email.toLowerCase().trim(), password, createdAt);
    console.log(`Usuario registrado con \xE9xito: ${email} (${userId}). Inicializando datos demo...`);
    const insertCatStmt = db.prepare("INSERT INTO categories (id, name, type, user_id) VALUES (?, ?, ?, ?)");
    for (const cat of INITIAL_CATEGORIES) {
      insertCatStmt.run(cat.id + "_" + userId, cat.name, cat.type, userId);
    }
    const insertSubcatStmt = db.prepare("INSERT INTO subcategories (id, category_id, name, user_id) VALUES (?, ?, ?, ?)");
    for (const sub of INITIAL_SUBCATEGORIES) {
      insertSubcatStmt.run(sub.id + "_" + userId, sub.category_id + "_" + userId, sub.name, userId);
    }
    const insertItemStmt = db.prepare(`
      INSERT INTO items (id, url, title, description, category, contentType, createdAt, category_id, subcategory_id, user_id, archived)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);
    for (const item of INITIAL_ITEMS) {
      insertItemStmt.run(
        item.id + "_" + userId,
        item.url,
        item.title,
        item.description || "",
        item.category,
        item.contentType,
        item.createdAt,
        item.category_id ? item.category_id + "_" + userId : null,
        item.subcategory_id ? item.subcategory_id + "_" + userId : null,
        userId
      );
    }
    const insertLikeStmt = db.prepare("INSERT INTO likes (user_id, item_id) VALUES (?, ?)");
    const defaultLikes = ["1", "3", "5"];
    for (const likeId of defaultLikes) {
      insertLikeStmt.run(userId, likeId + "_" + userId);
    }
    const insertThemeStmt = db.prepare("INSERT OR REPLACE INTO settings (user_id, key, value) VALUES (?, ?, ?)");
    insertThemeStmt.run(userId, "theme", "light");
    res.status(201).json({
      id: userId,
      email: email.toLowerCase().trim(),
      createdAt
    });
  } catch (error) {
    console.error("Error en /api/auth/register:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email y PIN requeridos." });
    }
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    const user = stmt.get(email.toLowerCase().trim());
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "El correo electr\xF3nico o el PIN de 4 n\xFAmeros son incorrectos." });
    }
    res.json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error("Error en /api/auth/login:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/items", requireAuth, (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM items WHERE user_id = ? ORDER BY createdAt DESC");
    const rows = stmt.all(req.userId);
    res.json(rows.map(mapItem));
  } catch (error) {
    console.error("Error en GET /api/items:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/items", requireAuth, (req, res) => {
  try {
    const { url, title, description, category, contentType, category_id, subcategory_id } = req.body;
    if (!url || !title || !category || !contentType) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    const id = import_crypto.default.randomUUID();
    const createdAt = (/* @__PURE__ */ new Date()).toISOString();
    const stmt = db.prepare(`
      INSERT INTO items (id, url, title, description, category, contentType, createdAt, category_id, subcategory_id, user_id, archived)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);
    stmt.run(
      id,
      url,
      title,
      description || "",
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
  } catch (error) {
    console.error("Error en POST /api/items:", error);
    res.status(500).json({ error: error.message });
  }
});
app.put("/api/items/:id", requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { url, title, description, category, contentType, category_id, subcategory_id } = req.body;
    if (!url || !title || !category || !contentType) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    const stmt = db.prepare(`
      UPDATE items
      SET url = ?, title = ?, description = ?, category = ?, contentType = ?, category_id = ?, subcategory_id = ?
      WHERE id = ? AND user_id = ?
    `);
    stmt.run(
      url,
      title,
      description || "",
      category,
      contentType,
      category_id || null,
      subcategory_id || null,
      id,
      req.userId
    );
    res.json({ success: true, message: `Registro ${id} actualizado con \xE9xito` });
  } catch (error) {
    console.error(`Error en PUT /api/items/${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/items/:id/toggle-archive", requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const getStmt = db.prepare("SELECT archived FROM items WHERE id = ? AND user_id = ?");
    const row = getStmt.get(id, req.userId);
    if (!row) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }
    const nextStatus = row.archived === 1 ? 0 : 1;
    const updateStmt = db.prepare("UPDATE items SET archived = ? WHERE id = ? AND user_id = ?");
    updateStmt.run(nextStatus, id, req.userId);
    res.json({ success: true, archived: nextStatus === 1 });
  } catch (error) {
    console.error(`Error en POST /api/items/${req.params.id}/toggle-archive:`, error);
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/items/:id", requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const deleteItemStmt = db.prepare("DELETE FROM items WHERE id = ? AND user_id = ?");
    const deleteLikeStmt = db.prepare("DELETE FROM likes WHERE item_id = ? AND user_id = ?");
    deleteItemStmt.run(id, req.userId);
    deleteLikeStmt.run(id, req.userId);
    res.json({ success: true, message: `Registro ${id} eliminado correctamente` });
  } catch (error) {
    console.error(`Error en DELETE /api/items/${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/likes", requireAuth, (req, res) => {
  try {
    const stmt = db.prepare("SELECT item_id FROM likes WHERE user_id = ?");
    const rows = stmt.all(req.userId);
    const likedIds = rows.map((row) => row.item_id);
    res.json(likedIds);
  } catch (error) {
    console.error("Error en GET /api/likes:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/likes/:id/toggle", requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const checkStmt = db.prepare("SELECT COUNT(*) as count FROM likes WHERE user_id = ? AND item_id = ?");
    const result = checkStmt.get(req.userId, id);
    let liked = false;
    if (result.count > 0) {
      const deleteStmt = db.prepare("DELETE FROM likes WHERE user_id = ? AND item_id = ?");
      deleteStmt.run(req.userId, id);
    } else {
      const insertStmt = db.prepare("INSERT INTO likes (user_id, item_id) VALUES (?, ?)");
      insertStmt.run(req.userId, id);
      liked = true;
    }
    res.json({ success: true, liked });
  } catch (error) {
    console.error(`Error en POST /api/likes/${req.params.id}/toggle:`, error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/theme", requireAuth, (req, res) => {
  try {
    const stmt = db.prepare("SELECT value FROM settings WHERE user_id = ? AND key = 'theme'");
    const row = stmt.get(req.userId);
    res.json({ theme: row ? row.value : "light" });
  } catch (error) {
    console.error("Error en GET /api/theme:", error);
    res.json({ theme: "light" });
  }
});
app.post("/api/theme", requireAuth, (req, res) => {
  try {
    const { theme } = req.body;
    if (theme !== "light" && theme !== "dark") {
      return res.status(400).json({ error: "Tema inv\xE1lido" });
    }
    const stmt = db.prepare("INSERT OR REPLACE INTO settings (user_id, key, value) VALUES (?, ?, ?)");
    stmt.run(req.userId, "theme", theme);
    res.json({ success: true });
  } catch (error) {
    console.error("Error en POST /api/theme:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/categories", requireAuth, (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM categories WHERE user_id = ? ORDER BY name ASC");
    res.json(stmt.all(req.userId));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/categories", requireAuth, (req, res) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    const id = "cat_" + import_crypto.default.randomBytes(4).toString("hex");
    const stmt = db.prepare("INSERT INTO categories (id, name, type, user_id) VALUES (?, ?, ?, ?)");
    stmt.run(id, name, type, req.userId);
    res.status(201).json({ id, name, type });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/categories/:id", requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare("DELETE FROM categories WHERE id = ? AND user_id = ?");
    stmt.run(id, req.userId);
    const subcatStmt = db.prepare("DELETE FROM subcategories WHERE category_id = ? AND user_id = ?");
    subcatStmt.run(id, req.userId);
    const clearStmt = db.prepare("UPDATE items SET category_id = NULL, subcategory_id = NULL WHERE category_id = ? AND user_id = ?");
    clearStmt.run(id, req.userId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/subcategories", requireAuth, (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM subcategories WHERE user_id = ? ORDER BY name ASC");
    res.json(stmt.all(req.userId));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/subcategories", requireAuth, (req, res) => {
  try {
    const { category_id, name } = req.body;
    if (!category_id || !name) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    const id = "sub_" + import_crypto.default.randomBytes(4).toString("hex");
    const stmt = db.prepare("INSERT INTO subcategories (id, category_id, name, user_id) VALUES (?, ?, ?, ?)");
    stmt.run(id, category_id, name, req.userId);
    res.status(201).json({ id, category_id, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/subcategories/:id", requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare("DELETE FROM subcategories WHERE id = ? AND user_id = ?");
    stmt.run(id, req.userId);
    const clearStmt = db.prepare("UPDATE items SET subcategory_id = NULL WHERE subcategory_id = ? AND user_id = ?");
    clearStmt.run(id, req.userId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/history", requireAuth, (req, res) => {
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
    const rows = stmt.all(req.userId);
    res.json(rows.map(mapItem));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/reset", requireAuth, (req, res) => {
  try {
    const id = req.userId;
    console.log(`Restableciendo base de datos para el usuario ${id}...`);
    db.prepare("DELETE FROM items WHERE user_id = ?").run(id);
    db.prepare("DELETE FROM likes WHERE user_id = ?").run(id);
    db.prepare("DELETE FROM settings WHERE user_id = ? AND key = 'theme'").run(id);
    db.prepare("DELETE FROM subcategories WHERE user_id = ?").run(id);
    db.prepare("DELETE FROM categories WHERE user_id = ?").run(id);
    const insertCatStmt = db.prepare("INSERT INTO categories (id, name, type, user_id) VALUES (?, ?, ?, ?)");
    for (const cat of INITIAL_CATEGORIES) {
      insertCatStmt.run(cat.id + "_" + id, cat.name, cat.type, id);
    }
    const insertSubcatStmt = db.prepare("INSERT INTO subcategories (id, category_id, name, user_id) VALUES (?, ?, ?, ?)");
    for (const sub of INITIAL_SUBCATEGORIES) {
      insertSubcatStmt.run(sub.id + "_" + id, sub.category_id + "_" + id, sub.name, id);
    }
    const insertItemStmt = db.prepare(`
      INSERT INTO items (id, url, title, description, category, contentType, createdAt, category_id, subcategory_id, user_id, archived)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);
    for (const item of INITIAL_ITEMS) {
      insertItemStmt.run(
        item.id + "_" + id,
        item.url,
        item.title,
        item.description || "",
        item.category,
        item.contentType,
        item.createdAt,
        item.category_id ? item.category_id + "_" + id : null,
        item.subcategory_id ? item.subcategory_id + "_" + id : null,
        id
      );
    }
    const insertLikeStmt = db.prepare("INSERT INTO likes (user_id, item_id) VALUES (?, ?)");
    const defaultLikes = ["1", "3", "5"];
    for (const likeId of defaultLikes) {
      insertLikeStmt.run(id, likeId + "_" + id);
    }
    const insertThemeStmt = db.prepare("INSERT OR REPLACE INTO settings (user_id, key, value) VALUES (?, ?, ?)");
    insertThemeStmt.run(id, "theme", "light");
    res.json({ success: true, message: "Entorno de usuario restablecido con \xE9xito" });
  } catch (error) {
    console.error("Error en POST /api/reset:", error);
    res.status(500).json({ error: error.message });
  }
});
if (process.env.NODE_ENV === "production") {
  console.log("Iniciando en modo PRODUCCI\xD3N - Sirviendo frontend est\xE1tico...");
  const distPath = import_path.default.join(process.cwd(), "dist");
  app.use(import_express.default.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(import_path.default.join(distPath, "index.html"));
  });
}
var server = app.listen(PORT, () => {
  console.log(`Servidor Express ejecut\xE1ndose en el puerto ${PORT}`);
});
if (process.env.NODE_ENV !== "production") {
  console.log("Iniciando en modo DESARROLLO - Lanzando servidor de desarrollo de Vite...");
  const vite = (0, import_child_process.spawn)("npx", ["vite", "--port=3000", "--host=0.0.0.0"], {
    stdio: "inherit",
    shell: true
  });
  const handleExit = () => {
    console.log("Deteniendo subprocesos...");
    vite.kill();
    server.close();
    process.exit();
  };
  process.on("SIGINT", handleExit);
  process.on("SIGTERM", handleExit);
  vite.on("exit", (code) => {
    console.log(`Vite finalizado con c\xF3digo: ${code}`);
    server.close();
    process.exit(code || 0);
  });
}
