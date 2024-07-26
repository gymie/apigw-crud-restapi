# AWS API Gateway CRUD REST API

This repository contains 3 way to manage your API Gateway CRUD REST API on AWS using several IAC.
1. Serverless Framework (`serverless.yml`)
2. AWS Cloud Development KIt (`lib/apigw-crud-restapi-stack.js`)
3. AWS Serverless Application Model (`template.yaml`)

## Prerequisites
- Configure AWS CLI

## 1. Serverless Framework
### Deployment
To deploy using Serverless framework you just need to run this command in your terminal 

```sh
npm i -g serverless
sls deploy --stage stage-name --region aws-region
```
### CI/CD
We will use Github Actions `.github/workflows/serverless.yml` for our CI/CD, you need to configure several secrets into your github repository like `SERVERLESS_ACCESS_KEY`, `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` then also some variables like `STAGE` and `REGION`.
To execute the Github Action, we can push our repository into our github repo branch `master`

### Cleanup 
To cleanup run this command
```sh
sls remove --stage stage-name --region aws-region
```

## 2. AWS Cloud Development KIt (CDK) 
### Deployment
To deploy using AWS CDK you can run this command

```sh
npm install -g aws-cdk
cdk deploy ApigwCrudRestapiStack --parameters Stage=dev
```

### CI/CD
To configure CI/CD pipeline you can run this command
```sh
cdk deploy CodepipelineStack
```
The command will create a CodeCommit repository and CodePipeline. You can then push your code into CodeCommit which will automatically trigger the CI/CD with CodePipeline.

### Cleanup
To cleanup run this command
```sh
cdk destroy CodepipelineStack ApigwCrudRestapiStack
```

## 3. AWS Serverless Application Model (SAM)
### Deployment
- To deploy using AWS SAM we first need to [install SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html).
- Then run this command
```sh
sam deploy --parameter-overrides Stage=[dev/prod]
```
### CI/CD
to create CI/CD using sam, you can run this command
```sh
sam pipeline init --bootstrap
```

You will need to answer several question like this
```
Below is the summary of the answers:
        1 - Account: xxxx
        2 - Stage configuration name: dev
        3 - Region: ap-southeast-1
        4 - Pipeline user: [to be created]
        5 - Pipeline execution role: [to be created]
        6 - CloudFormation execution role: [to be created]
        7 - Artifacts bucket: [to be created]
        8 - ECR image repository: [skipped]
```
This command will create 2 stages pipeline, several files and prepare several resources for you to deploy your CodePipeline.

```
Successfully created the pipeline configuration file(s):
        - assume-role.sh
        - codepipeline.yaml
        - pipeline/buildspec_build_package.yml
        - pipeline/buildspec_deploy.yml
        - pipeline/buildspec_feature.yml
        - pipeline/buildspec_integration_test.yml
        - pipeline/buildspec_unit_test.yml
```


Then to start deploy your pipeline, you can run this command.

```sh
sam deploy -t codepipeline.yaml --stack-name <stack-name> --capabilities=CAPABILITY_IAM
```
### Cleanup
To cleanup run this command
```sh
sam delete --stack-name stack-name
```

<!-- ## Frontend

This repo also contain a frontend that you can use to test your AWS API Gateway CRUD REST API. To deploy it you can run this command.

```sh
cdk deploy frontEndStack
``` -->