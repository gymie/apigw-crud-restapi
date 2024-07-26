const { DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require('./utils/client');

module.exports.handler = async (event, context) => {
    const { id } = event.pathParameters;

    try {
        const command = new DeleteCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                id
            }
        });

        const response = await docClient.send(command);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,DELETE"
            },
            body: JSON.stringify({
                message: response,
            }),
        };
        
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error,
                input: event,
            }),
        };
    }
};