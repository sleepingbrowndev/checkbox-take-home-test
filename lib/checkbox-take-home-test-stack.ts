import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';
import * as lambda from '@aws-cdk/aws-lambda';

export class CheckboxTakeHomeTestStack extends cdk.Stack {
	constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// Create the appsync api
		const api = new appsync.GraphqlApi(this, 'TaskApi', {
			name: 'checkbox-task-appsync-api',
			schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
			authorizationConfig: {
				defaultAuthorization: {
					authorizationType: appsync.AuthorizationType.API_KEY,
					apiKeyConfig: {
						expires: cdk.Expiration.after(cdk.Duration.days(365))
					}
				},
			},
		});

		// VPC for aurora db cluster
		const vpc = new ec2.Vpc(this, 'TaskAppVPC');

		// Create the aurora db cluster; set the engine to postgresql
		const cluster = new rds.ServerlessCluster(this, 'TaskDBCluster', {
			engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
			parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'aurora-postgresql10'),
			defaultDatabaseName: 'TaskDB',
			vpc,
			scaling: { autoPause: cdk.Duration.seconds(300) }
		});

		// Create the function that will map graphql ops into postgresql
		const taskFn = new lambda.Function(this, 'TaskFunction', {
			runtime: lambda.Runtime.NODEJS_16_X,
			code: new lambda.AssetCode('lambda'),
			handler: 'index.handler',
			memorySize: 1024,
			environment: {
				CLUSTER_ARN: cluster.clusterArn,
				SECRET_ARN: cluster.secret?.secretArn || '',
				DB_NAME: 'TaskDB',
				AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1'
			},
		});

		// Grant access to the cluster from the function
		cluster.grantDataApiAccess(taskFn);

		// Set the new function as a data source for the AppSync API
		const lambdaDs = api.addLambdaDataSource('lambdaDatasource', taskFn);

		// Map the resolvers to the functions
		lambdaDs.createResolver({
			typeName: 'Query',
			fieldName: 'listTasks'
		});
		lambdaDs.createResolver({
			typeName: 'Query',
			fieldName: 'getTaskById'
		});
		lambdaDs.createResolver({
			typeName: 'Mutation',
			fieldName: 'createTask'
		});
		lambdaDs.createResolver({
			typeName: 'Mutation',
			fieldName: 'updateTask'
		});
		lambdaDs.createResolver({
			typeName: 'Mutation',
			fieldName: 'deleteTask'
		});

		// CFN Outputs
		new cdk.CfnOutput(this, 'AppSyncAPIURL', {
			value: api.graphqlUrl
		});
		new cdk.CfnOutput(this, 'AppSyncAPIKey', {
			value: api.apiKey || ''
		});
		new cdk.CfnOutput(this, 'ProjectRegion', {
			value: this.region
		});
	}
}