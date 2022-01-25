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
      .isEmpty()
      .withMessage('O título não pode ser vazio'),
    body('description')
      .trim()
      .not()
      .isEmpty()
      .withMessage('A descrição não pode ser vazia'),
    body('priority')
      .trim()
      .not()
      .isEmpty()
      .withMessage('A prioridade não pode ser vazia')
      .custom((value, { req }) => {
        if (value !== 'Baixa' && value !== 'Média' && value !== 'Alta') {
          return Promise.reject('Por favor, entre com uma prioridade válida');
        }
        return Promise.resolve();
      }),
    body('listId')
      .trim()
      .not()
      .isEmpty()
      .withMessage('O id da lista não pode ser vazio')
  ],
  taskController.createTask
);

// PUT /tasks/taskId/check
router.put(
  '/:taskId/check',
  isAuth,
  taskController.checkTask
);

// PUT /tasks/taskId
router.put(
  '/:taskId',
  isAuth,
  [
    body('title')
      .trim()
      .not()
      .isEmpty()
      .withMessage('O título não pode ser vazio'),
    body('description')
      .trim()
      .not()
      .isEmpty()
      .withMessage('A descrição não pode ser vazia'),
    body('priority')
      .trim()
      .not()
      .isEmpty()
      .withMessage('A prioridade não pode ser vazia')
      .custom((value, { req }) => {
        if (value !== 'Baixa' && value !== 'Média' && value !== 'Alta') {
          return Promise.reject('Por favor, entre com uma prioridade válida');
        }
        return Promise.resolve();
      })
  ],
  taskController.updateTask
);

// DELETE /tasks/taskId
router.delete('/:taskId', isAuth, taskController.deleteTask);

module.exports = router;
