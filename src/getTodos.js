const { ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require('./utils/client');

module.exports.handler = async (event) => {
    try {
        const command = new ScanCommand({
            TableName: process.env.TABLE_NAME,
        });

        const response = await docClient.send(command);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            body: JSON.stringify({
                message: response.Items,
            }),
        };
        
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
            message: error,
        }),
    };
    }
};