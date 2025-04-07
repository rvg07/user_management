const express = require('express');
const groupController = require('../controllers/groupController');
const { validateGroup, updateValidateGroup } = require('../middleware/validations/groupValidator');
const router = express.Router();

router.post('/', validateGroup, groupController.createGroup);
router.get('/:id', groupController.getGroupById);
router.get('/', groupController.getAllGroups );
router.put('/:id', updateValidateGroup, groupController.updateGroup );
router.delete('/:id', groupController.deleteGroup );

module.exports = router;