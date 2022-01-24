const express = require('express');
const { body } = require('express-validator/check');
const taskController = require('../controllers/task');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

//POST /tasks/post
router.post(
  '/post',
  isAuth,
  [
    body('title')
      .trim()
      .not()
      .isEmpty(),
    body('description')
      .trim()
      .not()
      .isEmpty(),
    body('priority')
      .trim()
      .not()
      .isEmpty(),
    body('listId')
      .trim()
      .not()
      .isEmpty()
  ],
  taskController.createTask
);

// PUT /tasks/taskId
router.put(
  '/:taskId',
  isAuth,
  [
    body('title')
      .trim()
      .not()
      .isEmpty(),
    body('description')
      .trim()
      .not()
      .isEmpty(),
    body('priority')
      .trim()
      .not()
      .isEmpty()
  ],
  taskController.updateTask
);

// DELETE /tasks/taskId
router.delete('/:taskId', isAuth, taskController.deleteTask);

module.exports = router;
