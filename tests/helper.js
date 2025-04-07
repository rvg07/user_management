require('dotenv').config();
const axios = require('axios');
const { BASE_URL_ENDPOINT_API, PREFIX_API } = require('./constants');

const createUser = async (userData) => {
    try {
        const response = await axios.post(`${BASE_URL_ENDPOINT_API}/${PREFIX_API}/users`, userData);
        return response.data.userId;
    } catch (error) {
        console.error("ERROR on creating user: ", error.response?.data || error.message);
        throw error;
    }
};

const deleteUser = async (userId) => {
    try {
       const response = await axios.delete(`${BASE_URL_ENDPOINT_API}/${PREFIX_API}/users/${userId}`);
       return response;
   } catch (error) {
       console.error(`ERROR on deleting for userId: ${userId}. `, error.message);
       throw error;
   }
};

const createGroup = async (groupData) => {
     try {
        const response = await axios.post(`${BASE_URL_ENDPOINT_API}/${PREFIX_API}/groups`, groupData);
        return response.data.groupId;
    } catch (error) {
        console.error("ERROR on creating group: ", error.response?.data || error.message);
        throw error;
    }
};

const deleteGroup = async (groupId) => {
    try {
       const response = await axios.delete(`${BASE_URL_ENDPOINT_API}/${PREFIX_API}/groups/${groupId}`);
       return response;
   } catch (error) {
       console.error(`ERROR on deleting for groupId: ${groupId}. `, error.message);
       throw error;
   }
};

module.exports={
    createUser,
    deleteUser,
    createGroup,
    deleteGroup
}