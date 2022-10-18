import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';

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
	}
}