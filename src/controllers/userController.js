const User = require('../models/UserModel');
const {getPaginatedData} = require('../helpers/pagination');
const {HTTP_STATUS, STATUS_STRING, DB_ERROR_CODES}=require('../constants/index');

exports.createUser = async (req, res, next) => {
    try {
        const userId = await User.create(req.body);
        res.status(HTTP_STATUS.CREATED).json({ status: STATUS_STRING.SUCCESS, message: 'User created successfully!', userId });
    } catch (error) {
        //we catch here the duplication entry user record
        if (error.message === DB_ERROR_CODES.ER_DUP_ENTRY) {
            return res.status(HTTP_STATUS.CONFLICT).json({
                status: STATUS_STRING.ERROR,
                code: DB_ERROR_CODES.ER_DUP_ENTRY,
                message: `User name already exists!!`
            });
        }
        next(error);
    }
};

/**
 * Implemented pagination
 */
exports.getAllUsers = async (req, res, next) => {
    try {
        const {pageSize, offset, pageNumber} = getPaginatedData(req.query);
        const {total, users} = await User.findAll(pageSize, offset);
        const totalPages = Math.ceil(total / pageSize);
        res.status(HTTP_STATUS.OK).json({
            status: STATUS_STRING.SUCCESS,
            data: users,
            pagination: {
                totalItems: total,
                totalPages: totalPages,
                currentPage: pageNumber,
                pageSize: pageSize
            }
         });
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: STATUS_STRING.ERROR, message: 'Invalid userId format!' });
        }
        const userExistance = await User.findById(id);
        if (!userExistance) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: STATUS_STRING.ERROR, message: 'User not found!' });
        }
        res.status(HTTP_STATUS.OK).json(userExistance);
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: STATUS_STRING.ERROR, message: 'Invalid userId format!' });
        }
        const userExistance = await User.findById(id);
        if (!userExistance) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: STATUS_STRING.ERROR, message: 'User not found!' });
        }
        const affectedRowsOnUpdate = await User.update(id, req.body);
        if (affectedRowsOnUpdate === 0) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: STATUS_STRING.ERROR, message: `No changes made for the userId: ${id}!` });
        }
        //we get new user updated
        const updatedUser = await User.findById(id);
        res.status(HTTP_STATUS.OK).json({ status: STATUS_STRING.SUCCESS, message: 'User updated successfully!', user: updatedUser });

    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: STATUS_STRING.ERROR, message: 'Invalid userId format!' });
        }
        const affectedRowsOnDelete = await User.delete(id);
        if (affectedRowsOnDelete === 0) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: STATUS_STRING.ERROR, message: 'User not found!' });
        }
        res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
        next(error);
    }
};

