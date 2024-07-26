const { Stack, Duration, RemovalPolicy, CfnOutput, CfnParameter } = require('aws-cdk-lib');
const apigateway = require('aws-cdk-lib/aws-apigateway');
const lambda = require('aws-cdk-lib/aws-lambda');
const dynamodb = require('aws-cdk-lib/aws-dynamodb');
const iam = require('aws-cdk-lib/aws-iam');
const path = require('path');


class ApigwCrudRestapiStack extends Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const stage = new CfnParameter(this, 'Stage', {
      type: 'String',
      description: 'Stage name',
      default: 'dev'
    });

    const todoTable = new dynamodb.Table(this, 'TodosTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'TodosTable-' + stage.valueAsString,
      removalPolicy: RemovalPolicy.DESTROY
    });

    const globalConfig = {
      runtime: lambda.Runtime.NODEJS_20_X,
      memorySize: 128,
      timeout: Duration.seconds(10),
      code: lambda.Code.fromAsset(path.join(__dirname, "..", "src")),
      environment: {
        TABLE_NAME: todoTable.tableName,
      }
    }
    
    const getTodosFunction = new lambda.Function(this, 'GetTodosFunction', {
      handler: 'getTodos.handler',
      ...globalConfig
    });

    const getTodoFunction = new lambda.Function(this, 'GetTodoFunction', {
      handler: 'getTodo.handler',
      ...globalConfig
    });

    const createTodoFunction = new lambda.Function(this, 'CreateTodoFunction', {
      handler: 'createTodo.handler',
      ...globalConfig
    });

    const editTodoFunction = new lambda.Function(this, 'editTodoFunction', {
      handler: 'editTodo.handler',
      ...globalConfig
    });

    const deleteTodoFunction = new lambda.Function(this, 'DeleteTodoFunction', {
      handler: 'deleteTodo.handler',
      ...globalConfig
    });

    const api = new apigateway.RestApi(this, 'TodosApi', {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      }
    });

    todoTable.grantReadData(getTodosFunction);
    todoTable.grantWriteData(createTodoFunction);
    todoTable.grantReadData(getTodoFunction);
    todoTable.grantWriteData(editTodoFunction);

    const deletePolicy = new iam.PolicyStatement({
      actions: ['dynamodb:DeleteItem'],
      resources: [todoTable.tableArn]
    });
    deleteTodoFunction.addToRolePolicy(deletePolicy);


    const todos = api.root;
    todos.addMethod('POST', new apigateway.LambdaIntegration(createTodoFunction));
    todos.addMethod('GET', new apigateway.LambdaIntegration(getTodosFunction));

    const todo = todos.addResource('{id}');
    todo.addMethod('GET', new apigateway.LambdaIntegration(getTodoFunction));
    todo.addMethod('PUT', new apigateway.LambdaIntegration(editTodoFunction));
    todo.addMethod('DELETE', new apigateway.LambdaIntegration(deleteTodoFunction));
  }
}

module.exports = { ApigwCrudRestapiStack }
