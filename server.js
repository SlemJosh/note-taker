// What npms will we need?

const fs = require('fs'); // As we are creating a file, we need FS to write it.
const path = require('path'); // We will need to handle the file paths and navigate the directory
const express = require('express'); // Used for building apis and allows us to use middleware
const notes = require('./db/db.json'); //This is where we will store the notes

// Need a place to display the information on the server

const PORT = process.env.port || 3001;

// express
const app = express();

// Middleware functions
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static('public'));

function createNote(body, notesCollected) {
    const note = body;
    notesCollected.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'), 
        JSON.stringify({ notes: notesCollected}, null, 2)
    );
    return body;
}