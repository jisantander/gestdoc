var express = require('express');
var router = express.Router();
var historyController = require('../controllers/historyController.js');

/*
 * GET
 */
router.get('/', historyController.list);

/*
 * POST
 */
router.post('/', historyController.create);

/*
 * PUT
 */
router.put('/:id', historyController.update);

/*
 * DELETE
 */
router.delete('/:id', historyController.remove);

module.exports = router;
