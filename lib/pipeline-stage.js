const { Stage } = require('aws-cdk-lib');
const { ApigwCrudRestapiStack } = require('./apigw-crud-restapi-stack');

class pipelineStage extends Stage {
    constructor(scope, id, props) {
        super(scope, id, props);
    
        new ApigwCrudRestapiStack(this, 'apiGatewayStack', {});
    }
}

module.exports = { pipelineStage };