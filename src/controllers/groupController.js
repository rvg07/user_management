const Group = require('../models/GroupModel');
const {getPaginatedData} = require('../helpers/pagination');
const {HTTP_STATUS, STATUS_STRING, DB_ERROR_CODES}=require('../constants/index');

exports.createGroup = async( req, res, next ) => {
    try {
        const groupId = await Group.create(req.body);
        res.status(HTTP_STATUS.CREATED).json({ status: STATUS_STRING.SUCCESS, message: "Group created successfully!!", groupId})
    } catch (error) {
        //we catch here the duplication entry group record
        if (error.message === DB_ERROR_CODES.ER_DUP_ENTRY) {
            return res.status(HTTP_STATUS.CONFLICT).json({
                status: STATUS_STRING.ERROR,
                code: DB_ERROR_CODES.ER_DUP_ENTRY,
                message: `Group name already exists!!`
            });
        }
        next(error);
    }
}

/**
 * Implemented pagination
 */
exports.getAllGroups = async (req, res, next) => {
    try {
        const {pageSize, offset, pageNumber} = getPaginatedData(req.query);
        const {total, groups} = await Group.findAll(pageSize, offset);
        const totalPages = Math.ceil(total / pageSize);
        res.status(HTTP_STATUS.OK).json({
            status: STATUS_STRING.SUCCESS,
            data: groups,
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

exports.getGroupById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: STATUS_STRING.ERROR, message: 'Invalid groupId format!' });
        }
        const groupExistance = await Group.findById(id);
        if (!groupExistance) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: STATUS_STRING.ERROR, message: 'Group not found!' });
        }
        res.status(HTTP_STATUS.OK).json(groupExistance);
    } catch (error) {
        next(error);
    }
};

exports.updateGroup = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: STATUS_STRING.ERROR, message: 'Invalid groupId format!' });
        }
        const groupExistance = await Group.findById(id);
        if (!groupExistance) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: STATUS_STRING.ERROR, message: 'Group not found!' });
        }
        const affectedRowsOnUpdate = await Group.update(id, req.body);
        if (affectedRowsOnUpdate === 0) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: STATUS_STRING.ERROR, message: `No changes made for the groupId: ${id}!` });
        }
        //we get new group updated
        const updatedGroup = await Group.findById(id);
        res.status(HTTP_STATUS.OK).json({ status: STATUS_STRING.SUCCESS, message: 'Group updated successfully!', group: updatedGroup });

    } catch (error) {
        next(error);
    }
};

exports.deleteGroup = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)){
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: STATUS_STRING.ERROR, message: 'Invalid groupId format!' });
        }
        const affectedRowsOnDelete = await Group.delete(id);
        if (affectedRowsOnDelete === 0) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: STATUS_STRING.ERROR, message: 'Group not found!' });
        }
        res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
        next(error);
    }
};
