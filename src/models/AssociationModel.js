const db = require('../config/db');
const {DB_ERROR_CODES}= require('../constants/index');

/**
 * This model class maps the association between User and Group
 */
class Association {

    /**
     * 
     * @param {number} userId 
     * @param {number} groupId 
     * @returns 
     */
    static async addUserToGroup(userId, groupId){
        const query = 'INSERT INTO user_groups (user_id, group_id) VALUES (?,?)';
        try {
            const [result]= await db.execute(query, [userId, groupId]);
            return result.insertId;
        } catch (error) {
            if(error.code === DB_ERROR_CODES.ER_DUP_ENTRY){//duplicate entry
                throw new Error(error.code);
            }
            if(error.code === DB_ERROR_CODES.ER_NO_REFERENCED_ROW){//foreign key constraint violated
                throw new Error(`userId: ${userId} or groupId: ${groupId} not exist.`);
            }
            throw error;
        }
    }

    /**
     * 
     * @param {number} userId 
     * @param {number} groupId 
     * @returns {Promise<number>}
     * @throws {Error}
     */
    static async removeUserFromGroup(userId, groupId){
        const sql = 'DELETE FROM user_groups WHERE user_id = ? AND group_id = ?';
        const [result] = await db.execute(sql, [userId, groupId]);
        return result.affectedRows; //we return number rows added
    }
    
    /**
     * 
     * @param {number} userId 
     * @returns 
     */
    static async findGroupsByUserId(userId){
        //put \`groups\` because the table name 'groups' is a reserved string for MySQL
        const sql= `
            SELECT g.id, g.name
            FROM \`groups\` g JOIN user_groups ug ON g.id = ug.group_id
            WHERE ug.user_id = ?
            ORDER BY g.name ASC
        `;
        const [rows] = await db.execute(sql, [userId]);
        return rows;
    };

    /**
     * 
     * @param {number} groupId 
     * @returns 
     */
    static async findUsersByGroupId(groupId){
        const sql=`
            SELECT u.id, u.name, u.surname, u.birth_date, u.sex
            FROM users u JOIN user_groups ug ON u.id = ug.user_id
            WHERE ug.group_id = ?
            ORDER BY u.surname ASC, u.name ASC
        `;
        const [rows] = await db.execute(sql, [groupId]);
        return rows;
    };

    static async checkExistance(userId, groupId){
        
    }



}

module.exports = Association;