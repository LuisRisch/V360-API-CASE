const { validationResult } = require('express-validator/check');
const List = require('../models/list');
const Task = require('../models/task');

exports.createTask = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validação falhou. Os dados inseridos estão incorretos');
    error.statusCode = 422;
    error.data = errors.array();

    return next(error);
  }

  const title = req.body.title;
  const description = req.body.description;
  const priority = req.body.priority;
  const listId = req.body.listId; 

  const task = new Task({
    title: title,
    description: description,
    completed: false, 
    creator: req.userId,
    priority: priority, 
    fromList: listId,
  });

  try {
    await task.save();
    const list = await List.findById(listId);
    list.tasks.push(task);
    await list.save();

    res.status(201).json({
      message: 'Tarefa criada com sucesso',
      task: task,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    return next(err);
  }
};

exports.checkTask = async (req, res, next) => {
  const taskId = req.params.taskId;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      const error = new Error('Não foi possível achar esta tarefa');
      error.statusCode = 404;
      throw error;
    }

    if (task.creator.toString() !== req.userId) {
      const error = new Error('Não autorizado');
      error.statusCode = 403;
      throw error;
    }

    task.completed = !task.completed;
    const result = await task.save();

    res.status(200).json({ message: 'Tarefa atualizada', task: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    return next(err);
  }
}

exports.updateTask = async (req, res, next) => {
  const taskId = req.params.taskId;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validação falhou. Os dados inseridos estão incorretos');
    error.statusCode = 422;
    error.data = errors.array();

    return next(error);
  }

  const title = req.body.title;
  const description = req.body.description;
  const priority = req.body.priority;

  try {
    const task = await Task.findById(taskId).populate('creator');

    if (!task) {
      const error = new Error('Não foi possível achar essa tarefa');
      error.statusCode = 404;
      throw error;
    }

    if (task.creator._id.toString() !== req.userId) {
      const error = new Error('Não autorizado');
      error.statusCode = 403;
      throw error;
    }

    task.title = title;
    task.description = description;
    task.priority = priority;

    const result = await task.save();
    res.status(200).json({ message: 'Tarefa atualizada', task: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    return next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  const taskId = req.params.taskId;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      const error = new Error('Não foi possível achar esta tarefa');
      error.statusCode = 404;
      throw error;
    }

    if (task.creator.toString() !== req.userId) {
      const error = new Error('Não autorizado');
      error.statusCode = 403;
      throw error;
    }

    const list = await List.findById(task.fromList);
    list.tasks.pull(taskId);
    await list.save();

    await Task.findByIdAndRemove(taskId);

    res.status(200).json({ message: 'Tarefa deletada' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    return next(err);
  }
};