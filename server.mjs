import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Fetch categories
app.get('/api/categories', async (req, res) => {
    try {
        const response = await fetch('https://opentdb.com/api_category.php');
        const data = await response.json();
        res.json(data.trivia_categories);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Fetch questions
app.get('/api/questions/:categoryId', async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
        const response = await fetch(`https://opentdb.com/api.php?amount=10&type=multiple&category=${categoryId}`);
        const data = await response.json();
        res.json(data.results);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
