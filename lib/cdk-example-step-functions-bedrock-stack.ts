import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { WorkFlow } from "./constructs/workflow";
import { ApiGatewayConstruct } from "./constructs/api-gateway";

export class CdkExampleStepFunctionsBedrockStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const workflow = new WorkFlow(this, "Workflow");
    const stepFunction = new ApiGatewayConstruct(this, "ApiGatewayConstruct", {
      stepFunction: workflow.stateMachine,
    });
  }
}
