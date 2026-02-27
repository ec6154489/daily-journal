import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../db/index.ts';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Middleware to protect routes
const authenticate = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/', authenticate, (req: any, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM journal_entries WHERE user_id = ? ORDER BY created_at DESC');
    const entries = stmt.all(req.userId);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});

router.post('/', authenticate, (req: any, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO journal_entries (user_id, title, content) VALUES (?, ?, ?)');
    const result = stmt.run(req.userId, title, content);
    res.json({ id: result.lastInsertRowid, title, content });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create entry' });
  }
});

router.put('/:id', authenticate, (req: any, res) => {
  const { title, content } = req.body;
  const { id } = req.params;

  try {
    const stmt = db.prepare('UPDATE journal_entries SET title = ?, content = ? WHERE id = ? AND user_id = ?');
    const result = stmt.run(title, content, id, req.userId);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Entry not found or unauthorized' });
    }
    res.json({ message: 'Entry updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update entry' });
  }
});

router.delete('/:id', authenticate, (req: any, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare('DELETE FROM journal_entries WHERE id = ? AND user_id = ?');
    const result = stmt.run(id, req.userId);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Entry not found or unauthorized' });
    }
    res.json({ message: 'Entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

export default router;
