// What npms will we need?

const fs = require('fs'); // As we are creating a file, we need FS to write it.
const path = require('path'); // We will need to handle the file paths and navigate the directory
const express = require('express'); // Used for building apis and allows us to use middleware
const { notes } = require('./db/db.json'); //

// Need a place to display the information on the server

const PORT = process.env.PORT || 3001;

// 

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Move createNote function to a separate utility file for modularity

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', (req, res, next) => {
  req.body.id = notes.length.toString();
  notes.push(req.body);
  try {
    fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
      JSON.stringify({ notes }, null, 2)
    );
    res.json(req.body);
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
});

app.delete('/api/notes/:id', (req, res, next) => {
  const noteId = req.params.id;
  const noteIndex = notes.findIndex((note) => note.id === noteId);

  if (noteIndex !== -1) {
    notes.splice(noteIndex, 1);
    try {
      fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes }, null, 2)
      );
      res.json({ message: 'Note deleted' });
    } catch (error) {
      next(error); // Pass error to error handling middleware
    }
  } else {
    res.status(404).json({ error: 'Note not found' });
  }
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
});
