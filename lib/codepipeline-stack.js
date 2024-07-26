const { Stack } = require('aws-cdk-lib');
const { pipelineStage } = require('./pipeline-stage');
const { CodeBuildStep, CodePipeline, CodePipelineSource } = require('aws-cdk-lib/pipelines');
const codecommit = require('aws-cdk-lib/aws-codecommit');

class CodepipelineStack extends Stack {
    constructor(scope, id, props) {
        super(scope, id, props);

         const repo = new codecommit.Repository(this, 'WorkshopRepo', {
            repositoryName: "apigw-crud-restapi",
        });
    
        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'apigw-restapi-pipeline',
            synth: new CodeBuildStep('SynthStep', {
                    input: CodePipelineSource.codeCommit(repo, 'master'),
                    installCommands: [
                        'npm install -g aws-cdk'
                    ],
                    commands: [
                        'npm ci',
                        'npm run build',
                        'npx cdk synth'
                    ]
                }
            )
        });

        const deploy = new pipelineStage(this, 'Deploy');
        
        const deployStage = pipeline.addStage(deploy);
    }
}
    
module.exports = { CodepipelineStack };