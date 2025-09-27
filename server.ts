
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleGenerate } from './api/generate.js';
import { handleChat } from './api/chat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Middleware to parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// API routes
app.post('/api/generate', handleGenerate);
app.post('/api/chat', handleChat);

// Serve static files from the Vite build output directory
const staticPath = path.join(__dirname, '..', 'dist');
app.use(express.static(staticPath));

// For any other request, serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
