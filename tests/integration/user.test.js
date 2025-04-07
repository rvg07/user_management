require('dotenv').config();
const { HTTP_STATUS, STATUS_STRING } = require('../../src/constants/index');
const {BASE_URL_ENDPOINT_API, PREFIX_API} = require('../constants');
const axios = require('axios');

const validUserData = {
    name: 'JamesTest',
    surname: 'RavagoTest',
    birth_date: '1998-09-07',
    sex: 'male',
};

const notValidUserData = {
    name: 'JamesTest',
    birth_date: '1998-09-07',
    sex: 'male',
};

describe(`API User endpoints (/${PREFIX_API}/users)`, () => {
    let createdTestUserId;
    describe(`POST /${PREFIX_API}/users with validUserData`, () => {
        it('should create new user', async () => {
            let response = await axios.post(`${BASE_URL_ENDPOINT_API}/${PREFIX_API}/users`, validUserData);
            expect(response.status).toBe(HTTP_STATUS.CREATED);
            expect(response.data.userId).toBeGreaterThan(0);
            createdTestUserId = response.data.userId;
        });
    });

    describe(`POST /${PREFIX_API}/users with notValidUserData (missing 'name')`, () => {
        it('should return 400 Bad Request for invalid_user_params', async () => {
            try {
                await axios.post(`${BASE_URL_ENDPOINT_API}/${PREFIX_API}/users`, notValidUserData);
            } catch (error) {
                if (error.response) {
                    expect(error.response.status).toBe(HTTP_STATUS.BAD_REQUEST);
                    expect(error.response.data).toHaveProperty('status', STATUS_STRING.ERROR);
                    expect(error.response.data).toHaveProperty('message', '"surname" is required');
                }
            }
        });
    });

    describe(`GET /${PREFIX_API}/users using pagination`, () => {

        it('should return the page 1 because the limit is 5 and our pageSize default variable is 10', async () => {
            const limit = 5;
            const payload = { params: { limit } };
            const response = await axios.get(`${BASE_URL_ENDPOINT_API}/${PREFIX_API}/users`,payload);
            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(response.data.pagination.currentPage).toBe(1);
            expect(response.data.pagination.pageSize).toBe(limit);
        });

    });

    describe(`GET /${PREFIX_API}/users/:userId`, () => {
        it(`should retrieve the user just created`, async () => {
            expect(createdTestUserId).toBeDefined();
            const response = await axios.get(`${BASE_URL_ENDPOINT_API}/${PREFIX_API}/users/${createdTestUserId}`);
            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(response.data).toHaveProperty('surname', validUserData.surname);
        });
    });

    describe(`PUT /${PREFIX_API}/users/:userId`, () => {
        it("should update the user's surname successfully", async () => {
            expect(createdTestUserId).toBeDefined();
            const updateSurnameUserData = { surname: 'surnameUpdated' };
            const response = await axios.put(`${BASE_URL_ENDPOINT_API}/${PREFIX_API}/users/${createdTestUserId}`, updateSurnameUserData);
            expect(response.status).toBe(200);
            expect(response.data.user).toHaveProperty('surname', updateSurnameUserData.surname);
        });
    });

    describe(`DELETE /${PREFIX_API}/users/:userId`, () => {
        it('should delete the user successfully', async () => {
            expect(createdTestUserId).toBeDefined();
            const response = await axios.delete(`${BASE_URL_ENDPOINT_API}/${PREFIX_API}/users/${createdTestUserId}`);
            expect(response.status).toBe(HTTP_STATUS.NO_CONTENT);
        });
    });

});





