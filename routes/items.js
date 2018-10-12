'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

// TEMP: Simple In-Memory Database
const data = require('../db/items');
const simDB = require('../db/simDB');
const items = simDB.initialize(data);

// Get All items (and search by query)
router.get('/items', (req, res, next) => {
  const query = req.query;
  items.filter(query)
    .then(list => {
      res.json(list);
    })
    .catch(err => {
      next(err);
    });
});

// Get a single item
router.get('/items/:id', (req, res, next) => {
  const id = req.params.id;

  items.find(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// Post (insert) an item
router.post('/items/', (req, res, next) => {
  const { name, checked } = req.body;

  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  const newItem = { name, checked };

  items.create(newItem)
    .then(item => {
      res.location(`http://${req.headers.host}/items/${item.id}`).status(201).json(item);
    })
    .catch(err => {
      next(err);
    });
});

// Put (replace) an item
router.put('/items/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const replaceItem = {};
  const updateableFields = ['name', 'done'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      replaceItem[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!replaceItem.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  items.replace(id, replaceItem)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// Patch (update) an item
router.patch('/items/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const replaceItem = {};
  const updateableFields = ['name', 'done'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      replaceItem[field] = req.body[field];
    }
  });

  items.update(id, replaceItem)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// Delete an item
router.delete('/items/:id', (req, res, next) => {
  const id = req.params.id;

  items.delete(id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
