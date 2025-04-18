const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://admin:admin@cluster0.pznl908.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Connection error:", err));
 
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    available: Boolean
});
const Book = mongoose.model('Book', bookSchema);

app.post('/books', async (req, res) => {
    try {
        const { title, author, available = true } = req.body;
        const newBook = new Book({ title, author, available });
        await newBook.save();
        res.status(201).json({ message: "Book added", book: newBook });
    } catch (error) {
        res.status(400).json({ error: "Invalid data format" });
    }
}); 

app.get('/books', async (req, res) => {
    const books = await Book.find();
    res.status(200).json({ books });
});

app.get('/books/:id', async (req, res) => {
    try {
        const { id } = req.body;
        const book = await Book.findById(id);
        if (book) res.status(200).json({ book });
        else res.status(404).json({ error: "Not found" });
    } catch (error) {
        res.status(400).json({ error: "Invalid data format" });
    }
});

app.put('/books/:id', async (req, res) => {
    try {
        const { id, title, author, available } = req.body;
        await Book.findByIdAndUpdate(id, { title, author, available });
        const book = await Book.findById(id);
        if (book) res.status(200).json({ book });
        else res.status(404).json({ error: "Not found" });
    } catch (error) {
        res.status(400).json({ error: "Invalid data format" });
    }
});

app.delete('/books/:id', async (req, res) => {
    try {
        const { id } = req.body;
        const book = await Book.findByIdAndDelete(id);
        if (book) res.status(204).end();
        else res.status(404).json({ error: "Not found" });
    } catch (error) {
        res.status(400).json({ error: "Invalid data format" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});