const db = require('../config/db');
const {GROUP_ATTRIBUTES, TABLE_NAMES, DB_ERROR_CODES}= require('../constants/index');
const {generateUpdateByIdRawQuery} = require('../helpers/models');

/**
 * Group entity class
 */
class Group {

    /**
     * @param {object} groupData 
     * @returns 
     */
    static async create(groupData){
        const { name } = groupData;
        const query = 'INSERT INTO `groups` (name) VALUES (?)';
        try {
            const [result] = await db.execute(query, [name]);
            return result.insertId;
        } catch (error) {
            if (error.code === DB_ERROR_CODES.ER_DUP_ENTRY){//duplicate entry
                throw new Error(error.code);
            }
            console.error(`Error on creating group: ${error}`);
            throw error;
        }
    };

    /**
     * @param {number} limit 
     * @param {number} offset 
     * @returns 
     */
    static async findAll(limit, offset){ 
        const totalCountGroupsQuery = 'SELECT COUNT(*) as total FROM `groups`';
        const limitedGroupRowsQuery = 'SELECT * FROM `groups` ORDER BY id ASC LIMIT ? OFFSET ?';
        const [[{ total }]] = await db.query(totalCountGroupsQuery);
        const [limitedRows] = await db.query(limitedGroupRowsQuery,[limit, offset]);
        return {total, groups: limitedRows };
    };

    /**
     * @param {number} id 
     */
    static async findById(id){
        const query = 'SELECT * FROM `groups` WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows[0] || null;
    };


    /**
     * @param {number} id 
     * @param {object} groupData 
     */
    static async update(id, groupData){
        //we're going to define a Set attributes for Group Model
        const groupModelAttributes = new Set(GROUP_ATTRIBUTES);
        const {finalUpdateModelRawQuery, bindValuesModelData} = generateUpdateByIdRawQuery(TABLE_NAMES.GROUPS, groupModelAttributes, groupData );
        bindValuesModelData.push(id);
        try {
            const [result]= await db.execute(finalUpdateModelRawQuery, bindValuesModelData);
            return result.affectedRows;
        } catch (error) {
            console.error(`Error on updating groupId: ${id}!`);
            throw error;
        }
    };

    /**
     * @param {number} id 
     */
    static async delete(id){
        const query = 'DELETE FROM `groups` WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows;
    }


}

module.exports = Group;