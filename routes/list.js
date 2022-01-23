const express = require('express');
const { body } = require('express-validator/check');
const listController = require('../controllers/list');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

// GET /lists
router.get('/lists', isAuth, listController.getLists);

//POST /lists/post
router.post(
  '/lists/post',
  isAuth,
  [
    body('title')
      .trim()
      .not()
      .isEmpty(),
    body('description')
      .trim()
      .not()
      .isEmpty()
  ],
  listController.createList
);

// GET /lists/:listId
router.get('/lists/:listId', isAuth, listController.getList);

// PUT /lists/listId
router.put(
  '/lists/:listId',
  isAuth,
  [
    body('title')
      .trim()
      .not()
      .isEmpty(),
    body('description')
      .trim()
      .not()
      .isEmpty()
  ],
  listController.updateList
);

// DELETE /lists/listId
router.delete('/lists/:listId', isAuth, listController.deleteList);

module.exports = router;