import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';

export class CheckboxTakeHomeTestStack extends cdk.Stack {
	constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// Create the AppSync API
		const api = new appsync.GraphqlApi(this, 'Api', {
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

		// VPC for Aurora DB cluster
		const vpc = new ec2.Vpc(this, 'TaskAppVPC');

		// Create the Aurora DB cluster; set the engine to Postgresql
		const cluster = new rds.ServerlessCluster(this, 'AuroraTaskCluster', {
			engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
			parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'default.aurora-postgresql13'),
			defaultDatabaseName: 'TaskDB',
			vpc,
			scaling: { autoPause: cdk.Duration.seconds(300) }
		});
	}
}