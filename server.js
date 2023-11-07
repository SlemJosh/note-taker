// What npms will we need?

const fs = require('fs'); // As we are creating a file, we need FS to write it.
const path = require('path'); // We will need to handle the file paths and navigate the directory
const express = require('express'); // Used for buidling apis and allows us to use middleware
const notes = require('./db/db.json'); //This is where we will store the notes