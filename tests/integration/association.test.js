require('dotenv').config();
const { HTTP_STATUS, STATUS_STRING } = require('../../src/constants/index');
const {BASE_URL_ENDPOINT_API, PREFIX_API} = require('../constants');
const axios = require('axios');
const {createUser, deleteUser, createGroup, deleteGroup} = require('../helper');


describe(`API Association endpoints (/${PREFIX_API}/associations)`, () => {
    let createdTestUserId;
    let createdTestFirstGroupId;
    let createdTestSecondGroupId;
    //we create fictius data tests
    beforeAll(async () => {
        createdTestUserId = await createUser({ name: `associationTestNameUser_${Date.now()}`, surname: `associationTestSurnameUser_${Date.now()}`, birth_date: '2000-01-01', sex: 'other' });
        createdTestFirstGroupId = await createGroup({ name: `associationTestFirstGroup_${Date.now()}` });
        createdTestSecondGroupId = await createGroup({ name: `associationTestSecondGroup_${Date.now()}` });
        expect(createdTestUserId).toBeGreaterThan(0);
        expect(createdTestFirstGroupId).toBeGreaterThan(0);
        expect(createdTestSecondGroupId).toBeGreaterThan(0);
    });

    describe(`POST /${PREFIX_API}/associations`, () => {
        it('should create new association', async () => {
            const payload = {userId: createdTestUserId, groupId: createdTestFirstGroupId };
            const response = await axios.post(`${BASE_URL_ENDPOINT_API}/${PREFIX_API}/associations`, payload);
            expect(response.status).toBe(HTTP_STATUS.CREATED);
        });

        it('should return 400 Bad Request if association already exists', async () => {
            const payload = {userId: createdTestUserId, groupId: createdTestFirstGroupId };
            try {
                await axios.post(`${BASE_URL_ENDPOINT_API}/${PREFIX_API}/users`, payload);
           } catch (error) {
                if (error.response) {
                    expect(error.response.status).toBe(HTTP_STATUS.BAD_REQUEST);
                    expect(error.response.data).toHaveProperty('status', STATUS_STRING.ERROR);
                }
           }
       });

    });

    describe(`GET /${PREFIX_API}/associations`, () => {
        it('should get groups for a user and return 200 OK if the userId is associated to groups', async () => {
            const payload = {params: { userId: createdTestUserId } };
            const response = await axios.get(`${BASE_URL_ENDPOINT_API}/${PREFIX_API}/associations`, payload);
            //we verify if the createdTestFirstGroupId associated previously still persists
            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(response.data.groups[0]).toHaveProperty('id', createdTestFirstGroupId);
       });

        it('should get users for a group and return 200 OK if the groupId is associated to users', async () => {
            const payload = { params: { groupId: createdTestFirstGroupId } };
            const response = await axios.get(`${BASE_URL_ENDPOINT_API}/${PREFIX_API}/associations`, payload);
            //same as before, we need to verify if the createdTestFirstGroupId associated previously still persists
            expect(response.data.usersInTheGroup[0]).toHaveProperty('id', createdTestUserId);
            expect(response.status).toBe(HTTP_STATUS.OK);
        });
    });

    describe(`DELETE /${PREFIX_API}/associations`, () => {
        it('should delete an existing association and return 200 OK', async () => {
            const payload = {params: { userId: createdTestUserId, groupId: createdTestFirstGroupId }}
            const response = await axios.delete(`${BASE_URL_ENDPOINT_API}/${PREFIX_API}/associations`, payload);
            expect(response.status).toBe(HTTP_STATUS.OK);
        });
    });

    //we clean here data tests
    afterAll(async () => {
        const responseDeleteUser = await deleteUser(createdTestUserId);
        expect(responseDeleteUser.status).toBe(HTTP_STATUS.NO_CONTENT);
        const responseDeleteFirstGroup = await deleteGroup(createdTestFirstGroupId);
        expect(responseDeleteFirstGroup.status).toBe(HTTP_STATUS.NO_CONTENT);
        const responseDeleteSecondGroup = await deleteGroup(createdTestSecondGroupId);
        expect(responseDeleteSecondGroup.status).toBe(HTTP_STATUS.NO_CONTENT);
    });


});