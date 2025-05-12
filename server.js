const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for all origins and allow credentials
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// In-memory data stores
let users = [
  { id: 1, username: 'siswa', password: 'siswa123', role: 'student' },
  { id: 2, username: 'admin', password: 'admin123', role: 'admin' }
];
let materials = [
  { id: 101, title: 'Pengenalan Aljabar', subjectId: 1 },
  { id: 102, title: 'Geometri Dasar', subjectId: 1 }
];
let questions = [
  { id: 1, materialId: 101, text: 'Apa itu variabel?', options: ['A','B','C','D'], correctAnswer: 0, points: 10 }
];
let scores = [];

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const token = 'demo-token-' + Date.now();
  return res.json({ user: { id: user.id, username: user.username, role: user.role }, token });
});

// Material routes
app.get('/api/materi', (req, res) => res.json(materials));
app.get('/api/materi/:id', (req, res) => {
  const subjectId = parseInt(req.params.id);
  const result = materials.filter(m => m.subjectId === subjectId);
  res.json(result);
});
app.post('/api/materi', (req, res) => {
  const newMat = { id: Date.now(), ...req.body };
  materials.push(newMat);
  res.status(201).json(newMat);
});
app.put('/api/materi/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = materials.findIndex(m => m.id === id);
  if (index === -1) return res.status(404).json({ message: 'Not found' });
  materials[index] = { ...materials[index], ...req.body };
  res.json(materials[index]);
});
app.delete('/api/materi/:id', (req, res) => {
  const id = parseInt(req.params.id);
  materials = materials.filter(m => m.id !== id);
  res.status(204).send();
});

// Question routes
app.get('/api/soal', (req, res) => res.json(questions));
app.get('/api/soal/:id', (req, res) => {
  const q = questions.find(q => q.id === parseInt(req.params.id));
  return q ? res.json(q) : res.status(404).json({ message: 'Not found' });
});
app.post('/api/soal', (req, res) => {
  const newQ = { id: Date.now(), ...req.body };
  questions.push(newQ);
  res.status(201).json(newQ);
});
app.put('/api/soal/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = questions.findIndex(q => q.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  questions[idx] = { ...questions[idx], ...req.body };
  res.json(questions[idx]);
});
app.delete('/api/soal/:id', (req, res) => {
  questions = questions.filter(q => q.id !== parseInt(req.params.id));
  res.status(204).send();
});

// Score routes
app.get('/api/skor', (req, res) => res.json(scores));
app.get('/api/skor/user/:userId', (req, res) => {
  const uid = parseInt(req.params.userId);
  res.json(scores.filter(s => s.userId === uid));
});
app.post('/api/skor', (req, res) => {
  const newScore = { id: Date.now(), ...req.body };
  scores.push(newScore);
  res.status(201).json(newScore);
});
app.get('/api/skor/stats/:userId', (req, res) => {
  const uid = parseInt(req.params.userId);
  const userScores = scores.filter(s => s.userId === uid);
  const total = userScores.reduce((sum, s) => sum + s.score, 0);
  res.json({ userId: uid, totalScore: total, count: userScores.length });
});

app.listen(port, () => console.log(`API server running on http://localhost:${port}`)); 