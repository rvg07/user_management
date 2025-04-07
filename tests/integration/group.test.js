require('dotenv').config();
const { HTTP_STATUS, STATUS_STRING } = require('../../src/constants/index');
const {BASE_URL_ENDPOINT_API, PREFIX_API} = require('../constants');
const axios = require('axios');

const validGroupData = { 
    name: `groupNameTest_${Date.now()}`
};


describe(`API groups endpoints (/${PREFIX_API}/groups)`, () => {
    let testCreatedTestGroupId;

    describe(`POST /${PREFIX_API}/groups`, () => {
        it('should create a new user and return 201 Created', async () => {
                const response = await axios.post(`${BASE_URL_ENDPOINT_API}/${PREFIX_API}/groups`, validGroupData);
                expect(response.status).toBe(HTTP_STATUS.CREATED);
                expect(response.data.groupId).toBeGreaterThan(0);
                testCreatedTestGroupId = response.data.groupId;
        });
    });

    describe(`GET /${PREFIX_API}/groups/:groupId`, () => {
        it('should retrieve group by id and return 200 OK', async () => {
            const response = await axios.get(`${BASE_URL_ENDPOINT_API}/${PREFIX_API}/groups/${testCreatedTestGroupId}`);
            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(response.data).toHaveProperty('id', testCreatedTestGroupId);
        });
    });

    
});
