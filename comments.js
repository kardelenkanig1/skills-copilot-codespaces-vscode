// Create web server
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var db = require('../db');
var multer = require('multer');
var upload = multer({ dest: './public/images/uploads/' });

// Get all comments
router.get('/', function(req, res, next) {
  db.query('SELECT * FROM comments', function(err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});

// Get a single comment
router.get('/:id', function(req, res, next) {
  db.query('SELECT * FROM comments WHERE id = ?', [req.params.id], function(err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});

// Get all comments for a single post
router.get('/post/:id', function(req, res, next) {
  db.query('SELECT * FROM comments WHERE post_id = ?', [req.params.id], function(err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});

// Create a comment
router.post('/', upload.single('image'), function(req, res, next) {
  var comment = {
    name: req.body.name,
    email: req.body.email,
    website: req.body.website,
    content: req.body.content,
    post_id: req.body.post_id,
    image: req.file.filename
  };

  db.query('INSERT INTO comments SET ?', comment, function(err, result) {
    if (err) throw err;
    db.query('SELECT * FROM comments WHERE id = ?', [result.insertId], function(err, rows, fields) {
      if (err) throw err;
      res.json(rows);
    });
  });
});

// Update a comment
router.put('/:id', upload.single('image'), function(req, res, next) {
  var comment = {
    name: req.body.name,
    email: req.body.email,
    website: req.body.website,
    content: req.body.content,
    post_id: req.body.post_id,
    image: req.file.filename
  };

  db.query('UPDATE comments SET ? WHERE id = ?', [comment, req.params.id], function(err, result) {
    if (err) throw err;
    db.query('SELECT * FROM comments WHERE id = ?', [req.params.id], function(err, rows,