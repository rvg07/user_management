const express = require('express');
const associationController = require('../controllers/associationController');
const router = express.Router();

router.post('/', associationController.createAssociation);
router.delete('/', associationController.deleteAssociation);
router.get('/', associationController.getAssociations);

module.exports = router;