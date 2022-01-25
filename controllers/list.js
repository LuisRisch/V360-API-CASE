const { validationResult } = require('express-validator/check');
const List = require('../models/list');
const User = require('../models/user');
const Task = require('../models/task');

exports.getLists = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 6;

  try {
    const totalItems = await List.find({ creator: req.userId }).countDocuments();
    const lists = await List.find({ creator: req.userId })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: 'Listas buscadas com sucesso',
      lists: lists,
      total: totalItems
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    return next(err);
  }
};

exports.createList = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validação falhou. Os dados inseridos estão incorretos');
    error.statusCode = 422;
    error.data = errors.array();

    return next(error);
  }

  const title = req.body.title;
  const description = req.body.description;

  const list = new List({
    title: title,
    description: description,
    creator: req.userId,
  });

  try {
    await list.save();
    const user = await User.findById(req.userId);
    user.lists.push(list);
    await user.save();

    res.status(201).json({
      message: 'Lista criada com sucesso!',
      list: list,
      creator: { _id: user._id, name: user.name }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    return next(err);
  }
};

exports.getList = async (req, res, next) => {
  const listId = req.params.listId;

  try {
    const list = await List.findById(listId).populate('tasks');

    if (!list) {
      const error = new Error('Não foi possível achar esta lista');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: 'Lista buscada com sucesso', list: list });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    return next(err);
  }
};

exports.updateList = async (req, res, next) => {
  const listId = req.params.listId;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validação falhou. Os dados inseridos estão incorretos');
    error.statusCode = 422;
    error.data = errors.array();

    return next(error);
  }

  const title = req.body.title;
  const description = req.body.description;

  try {
    const list = await List.findById(listId).populate('creator');

    if (!list) {
      const error = new Error('Não foi possível achar a lista');
      error.statusCode = 404;
      throw error;
    }

    if (list.creator._id.toString() !== req.userId) {
      const error = new Error('Não autorizado');
      error.statusCode = 403;
      throw error;
    }

    list.title = title;
    list.description = description

    const result = await list.save();
    res.status(200).json({ message: 'Lista atualizada com sucesso', list: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    return next(err);
  }
};

exports.deleteList = async (req, res, next) => {
  const listId = req.params.listId;

  try {
    const list = await List.findById(listId);

    if (!list) {
      const error = new Error('Não foi possível achar a lista');
      error.statusCode = 404;
      throw error;
    }

    if (list.creator.toString() !== req.userId) {
      const error = new Error('Não autorizado');
      error.statusCode = 403;
      throw error;
    }

    const tasksArray = list.tasks;

    if (tasksArray.length > 0) {
      for (let index = 0; index < tasksArray.length; index++) {
        const taskId = tasksArray[index];
        await Task.findByIdAndRemove(taskId);
      }
    }

    await List.findByIdAndRemove(listId);

    const user = await User.findById(req.userId);
    user.lists.pull(listId);
    await user.save();

    res.status(200).json({ message: 'Lista deletada' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    return next(err);
  }
};