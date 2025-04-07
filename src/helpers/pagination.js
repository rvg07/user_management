const { PAGINATION } = require('../constants/index');

/**
 * This function paginate data. Modularized for GET /users and GET /groups endpoints
 * @param {object} query - request query object (req.query)
 * @returns {object} - object containing { limit, offset, page }
 */
function getPaginatedData(query){
    const DEFAULT_PAGE_SIZE = PAGINATION.DEFAULT_PAGE_SIZE;
    const MAX_PAGE_SIZE = PAGINATION.MAX_PAGE_SIZE;
    const DEFAULT_PAGE_NUMBER = PAGINATION.DEFAULT_PAGE_NUMBER;
    const PAGE_NUMBER = typeof query.page !== typeof undefined ? query.page : DEFAULT_PAGE_NUMBER;
    const PAGE_SIZE = typeof query.limit !== undefined ? query.limit : DEFAULT_PAGE_SIZE;

    let pageNumber = parseInt(PAGE_NUMBER, 10);
    let pageSize = parseInt(PAGE_SIZE, 10);

    //we not throw exceptions but just define default values for query.page and query.limit
    if (isNaN(pageNumber) || pageNumber < 1) {
        pageNumber = DEFAULT_PAGE_NUMBER;
    }
    if (isNaN(pageSize) || pageSize < 1) {
        pageSize = DEFAULT_PAGE_SIZE;
    }

    //anything larger than our pageSize, we simply treat as the maximum
    if (pageSize > MAX_PAGE_SIZE) {
        pageSize = MAX_PAGE_SIZE;
    }
    // the purpose here is to calculate the offset-> how many items we skip from the beginning
    const offset = (pageNumber - 1) * pageSize;
    return {
        pageSize: pageSize,      
        offset: offset,    
        pageNumber: pageNumber         
    };

}

module.exports = {
    getPaginatedData
}