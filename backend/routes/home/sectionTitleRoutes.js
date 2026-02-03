const express = require('express');
const router = express.router ? express.Router() : express.Router; // Safe check
const sectionTitleController = require('../../controllers/home/sectionTitleController');

// Ensure router is instantiated correctly
const r = express.Router();

r.get('/', sectionTitleController.getAllTitles);
r.get('/:sectionId', sectionTitleController.getTitle);
r.put('/:sectionId', sectionTitleController.updateTitle);

module.exports = r;
