// What npms will we need?

const fs = require('fs'); // As we are creating a file, we need FS to write it.
const path = require('path'); // We will need to handle the file paths and navigate the directory
const express = require('express'); // Used for building apis and allows us to use middleware
const { notes } = require('./db/db.json'); //

// Need a place to display the information on the server

const PORT = process.env.PORT || 3001;

// express
const app = express();

// Middleware functions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

function createNote(body, notesArray) {
    const note = body;
    notesArray.push(note);

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );
    return body;
}

// api routes

// Get

app.get('/api/notes', (req, res) => {
    let results = notes;
    res.json(results);
});

// Post

app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString();
    const note = createNote(req.body, notes);
    res.json(note);
});

// Delete
// DELETE route to delete a specific note
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
  
    // Find the index of the note with the given ID
    const noteIndex = notes.findIndex((note) => note.id === noteId);
  
    if (noteIndex !== -1) {
      // Remove the note from the array
      notes.splice(noteIndex, 1);
  
      // Write the updated notes array to the JSON file
      fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes }, null, 2)
      );
  
      res.json({ message: 'Note deleted' });
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  });


// HTML routes
// We want the results to be displayed on the html

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log('API server running on port 3001!');
});