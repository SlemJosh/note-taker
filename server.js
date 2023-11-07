// Modules
const fs = require('fs'); // File system module for file operations
const path = require('path'); // Path module for handling file paths
const express = require('express'); // Express for building APIs

// Constant for note data (initially read from file)
const { notes } = require('./db/db.json');

// Define the port for the server
const PORT = process.env.PORT || 3001;

// Create an Express application
const app = express();

// Middlewares: parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Get request to retrieve notes
app.get('/api/notes', (req, res) => {
  res.json(notes);
});

// Post request to create a new note
app.post('/api/notes', (req, res, next) => {
  // Assign a unique ID to the new note
  req.body.id = notes.length.toString();
  // Add the new note to the notes array
  notes.push(req.body);
  const notesJSON = JSON.stringify({ notes }, null, 2);

  fs.writeFile(path.join(__dirname, './db/db.json'), notesJSON, (err) => {
    if (err) {
      // If writing to the file fails, remove the newly added note to maintain consistency
      notes.pop(); // Remove the recently added note
      next(err);
    } else {
      res.json(req.body);
    }
  });
});

// Delete request to remove a note by ID
app.delete('/api/notes/:id', (req, res, next) => {
  const noteId = req.params.id;
  const noteIndex = notes.findIndex((note) => note.id === noteId);

  if (noteIndex !== -1) {
    notes.splice(noteIndex, 1);
    const notesJSON = JSON.stringify({ notes }, null, 2);

    fs.writeFile(path.join(__dirname, './db/db.json'), notesJSON, (err) => {
      if (err) {
        // If writing to the file fails, re-add the deleted note to maintain consistency
        notes.splice(noteIndex, 0, notes[noteIndex]);
        next(err);
      } else {
        res.json({ message: 'Note deleted' });
      }
    });
  } else {
    res.status(404).json({ error: 'Note not found' });
  }
});

// Serve the notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Catch-all route to serve the index.html file for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
