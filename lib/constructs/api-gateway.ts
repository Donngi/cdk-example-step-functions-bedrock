import { aws_apigateway } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";

type ApiGatewayConstructProps = {
  stepFunction: sfn.IStateMachine;
};

export class ApiGatewayConstruct extends Construct {
  constructor(scope: Construct, id: string, props: ApiGatewayConstructProps) {
    super(scope, id);

    const restApi = new aws_apigateway.RestApi(this, "RestApi", {
      restApiName: "step-functions-bedrock-exmample",
      defaultMethodOptions: {
        apiKeyRequired: true,
      },
    });

    restApi.root
      .addResource("summarize")
      .addMethod(
        "POST",
        aws_apigateway.StepFunctionsIntegration.startExecution(
          props.stepFunction
        )
      );

    const apiKey = restApi.addApiKey("ApiKey");

    const plan = restApi.addUsagePlan("UsagePlan");
    plan.addApiKey(apiKey);
    plan.addApiStage({
      stage: restApi.deploymentStage,
    });
  }
}
