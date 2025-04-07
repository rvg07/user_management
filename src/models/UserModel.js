const db = require('../config/db');
const {USER_ATTRIBUTES, TABLE_NAMES, DB_ERROR_CODES}= require('../constants/index');
const {generateUpdateByIdRawQuery} = require('../helpers/models');

/**
 * User entity class
 */
class User {

    /**
     * @param {object} userData 
     */
    static async create(userData){
        const { name, surname, birth_date, sex } = userData;
        const query = 'INSERT INTO users (name, surname, birth_date, sex) VALUES (?, ?, ?, ?)';

        try {
            const [result] = await db.execute(query,[name, surname, birth_date, sex]);
            return result.insertId;
        } catch (error) {
            if (error.code === DB_ERROR_CODES.ER_DUP_ENTRY){//duplicate entry
                throw new Error(error.code);
            }
            console.error(`Error on creating user: ${error}`);
            throw error;
        }
        
    };


    /**
     * @param {number} limit 
     * @param {number} offset 
     */
    static async findAll(limit, offset){ 
        const totalCountUsersQuery = 'SELECT COUNT(*) as total FROM users';
        const limitedUserRowsQuery = 'SELECT * FROM users ORDER BY id ASC LIMIT ? OFFSET ?';
        const [[{ total }]] = await db.query(totalCountUsersQuery);
        const [limitedRows] = await db.query(limitedUserRowsQuery,[limit, offset]);
        return {total, users: limitedRows };
    };


    /**
     * Find user by ID
     * @param {number} id - ID of the user 
     */
    static async findById(id){
        const query = 'SELECT * FROM users WHERE id = ?';
        const [rows] = await db.execute(query,[id]);
        return rows[0] || null;
    };

    /**
     * @param {number} id 
     * @param {object} userData 
     */
    static async update(id, userData){
        //we're going to define a Set attributes for User Model
        const userModelAttributes = new Set(USER_ATTRIBUTES);
        const {finalUpdateModelRawQuery, bindValuesModelData} = generateUpdateByIdRawQuery(TABLE_NAMES.USERS, userModelAttributes, userData );
        bindValuesModelData.push(id);
        try {
            const [result]= await db.execute(finalUpdateModelRawQuery, bindValuesModelData);
            return result.affectedRows;
        } catch (error) {
            console.error(`Error on updating userId: ${id}!`);
            throw error;
        }
    };

    /**
     * @param {number} id
     */
    static async delete(id){
        const query = 'DELETE FROM users WHERE id = ?';
        const [result] = await db.execute(query,[id]);
        return result.affectedRows;
    }

    

}

module.exports=User;