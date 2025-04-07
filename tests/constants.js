require('dotenv').config();

const DOMAIN = 'http://localhost';
const BASE_URL_ENDPOINT_API = `${DOMAIN}:${process.env.APP_PORT || 3000}`;
const PREFIX_API = 'api/v1';

module.exports = {
    BASE_URL_ENDPOINT_API,
    PREFIX_API
}