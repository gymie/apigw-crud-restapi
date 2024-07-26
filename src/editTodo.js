const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require('./utils/client');

module.exports.handler = async (event, context) => {
    const { title } = JSON.parse(event.body);
    const { id } = event.pathParameters;

    try {
        const command = new UpdateCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                id
            },
            UpdateExpression: 'SET title = :title',
            ExpressionAttributeValues: {
                ':title': title
            }
        });

        const response = await docClient.send(command);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,PUT"
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