const express = require('express');
const userController = require('../controllers/userController');
const { validateUser, updateValidateUser } = require('../middleware/validations/userValidator');
const router = express.Router();

router.post('/', validateUser, userController.createUser );
router.get('/:id', userController.getUserById);
router.get('/', userController.getAllUsers );
router.put('/:id', updateValidateUser, userController.updateUser );
router.delete('/:id', userController.deleteUser );

module.exports = router;