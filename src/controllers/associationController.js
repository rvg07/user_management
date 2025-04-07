const User = require('../models/UserModel');
const Group = require('../models/GroupModel');
const Association = require('../models/AssociationModel');
const {HTTP_STATUS, STATUS_STRING, DB_ERROR_CODES}=require('../constants/index');


/**
 * @description handles the association's creation between user and group entities
 */
exports.createAssociation = async (req, res, next) => {
    try {
        const { userId, groupId } = req.body;
        const parsedUserId = parseInt(userId, 10);
        const parsedGroupId =parseInt(groupId, 10);

        if (isNaN(parsedUserId) || isNaN(parsedGroupId)){
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: STATUS_STRING.ERROR, message: 'Invalid userId or groupId format!' });
        }

        // we check if the ids given on request body exist
        const userExists = await User.findById(parsedUserId);
        const groupExists = await Group.findById(parsedGroupId);
        if (!userExists){
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: STATUS_STRING.ERROR, message: `UserID: ${parsedUserId} not found!` });
        }
        if (!groupExists){
            return res.status(HTTP_STATUS.NOT_FOUND).json({ status: STATUS_STRING.ERROR, message: `GroupID: ${parsedGroupId} not found!` });
        }
        const associationId = await Association.addUserToGroup(parsedUserId, parsedGroupId);
        res.status(HTTP_STATUS.CREATED).json({ status: STATUS_STRING.SUCCESS, message: `Association created successfully between userId: ${parsedUserId} and groupId: ${parsedGroupId}`, associationId});
    } catch (error) {
        //we catch here the duplication entry association record
        if (error.message === DB_ERROR_CODES.ER_DUP_ENTRY){
            return res.status(HTTP_STATUS.CONFLICT).json({
                status: STATUS_STRING.ERROR,
                code: DB_ERROR_CODES.ER_DUP_ENTRY,
                message: `Association name already exists!!`
            });
        }
        next(error);
    }
};

/**
 * @description handles the deletion association between user and group entities
 */
exports.deleteAssociation = async (req, res, next) => {
    try {
        const { userId, groupId } = req.query;
        const parsedUserId = parseInt(userId, 10);
        const parsedGroupId =parseInt(groupId, 10);
        
        if (isNaN(parsedUserId) || isNaN(parsedGroupId)){
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: STATUS_STRING.ERROR, message: 'Invalid userId or groupId format!' });
        }
        const numberAffectedRows = await Association.removeUserFromGroup(parsedUserId, parsedGroupId);
        if (numberAffectedRows > 0){
            res.status(HTTP_STATUS.OK).json({ message: `The userId: ${parsedUserId} is removed from groupId: ${parsedGroupId}!` });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).json({ status: STATUS_STRING.ERROR, message: `Association between userId: ${parsedUserId} and groupId: ${parsedGroupId} not found!`});
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @description handles the retrieve associations by user or by group
 */
exports.getAssociations = async (req, res, next) => {
    try {
        const {userId, groupId} = req.query;
        const parsedUserId = parseInt(userId, 10);
        const parsedGroupId = parseInt(groupId, 10);

        if (!isNaN(parsedUserId) && !isNaN(parsedGroupId)){
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: STATUS_STRING.ERROR, message: 'You must provide only userId or groupId query parameter!!' });
        }
        if (isNaN(parsedUserId) && isNaN(parsedGroupId)){
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: STATUS_STRING.ERROR, message: 'You must provide at least userId or a groupId query parameter!!' });
        }

        //going to find groups given userId
        if (!isNaN(parsedUserId)) {
            const existanceUser = await User.findById(parsedUserId);
            if (!existanceUser){
                return res.status(HTTP_STATUS.NOT_FOUND).json({ status: STATUS_STRING.ERROR, message: `UserId: ${parsedUserId} not found!` });
            }
            const groups = await Association.findGroupsByUserId(parsedUserId);
            return res.status(HTTP_STATUS.OK).json( {status: STATUS_STRING.SUCCESS, groups});
        }

        //going to find users given groupId
        if (!isNaN(parsedGroupId)) {
            const existanceGroup = await Group.findById(parsedGroupId);
            if (!existanceGroup){
                return res.status(HTTP_STATUS.NOT_FOUND).json({ status: STATUS_STRING.ERROR, message: `GroupId: ${parsedGroupId} not found!` });
            }
            const usersInTheGroup = await Association.findUsersByGroupId(parsedGroupId);
            return res.status(HTTP_STATUS.OK).json( {status: STATUS_STRING.SUCCESS, usersInTheGroup});
        }

    } catch (error) {
        next(error);
    }

};