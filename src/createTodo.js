const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require('./utils/client');

module.exports.handler = async (event, context) => {
    const { title } = JSON.parse(event.body);

    try {

        const command = new PutCommand({
            TableName: process.env.TABLE_NAME,
            Item: {
                id: context.awsRequestId,
                title: title,
            },
        });

        const response = await docClient.send(command);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            body: JSON.stringify({
                message: response,
            }),
        };
        
    } catch(error){
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error,
                input: event,
            }),
        };
    }
};