/**
 * This function generate a RAW SQL QUERY based on dynamic model attributes
 * @param {string} tableName - table_name to update
 * @param {Set<string>} modelAttributes -  set of model attributes
 * @param {object} modelData - model's object data
 * @returns {object} - object containing { finalUpdateModelRawQuerym, bindValuesModelData }
 */
function generateUpdateByIdRawQuery(
    tableName,
    modelAttributes,
    modelData
){
    //we need to verify if the object modelData passed from the request cotains the Model's attributes 
    const attributesToUpdate = Object.keys(modelData).filter(attribute => modelAttributes.has(attribute));
    if (attributesToUpdate.length === 0) {
        throw new Error(`No valid attributes provided!`);
    }
    const rawUpdateSetClause = attributesToUpdate.map(attribute => `${attribute} = ?`);
    const mapValuesModelData = attributesToUpdate.map(attribute => modelData[attribute]);
    const finalQueryBuilt = `UPDATE ${tableName} SET ${rawUpdateSetClause.join(', ')} WHERE id = ?`;
    return {
        finalUpdateModelRawQuery: finalQueryBuilt,
        bindValuesModelData: mapValuesModelData
    }
}

module.exports = {
    generateUpdateByIdRawQuery
}