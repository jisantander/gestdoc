const express = require('express');
const router = express.Router();
const usergroupController = require('../controllers/usergroupController.js');

/*
 * GET
 */
router.get('/', usergroupController.list);

/*
 * GET
 */
router.get('/:id', usergroupController.show);

/*
 * POST
 */
router.post('/', usergroupController.create);

/*
 * PUT
 */
router.put('/:id', usergroupController.update);

/*
 * DELETE
 */
router.delete('/:id', usergroupController.remove);

module.exports = router;
