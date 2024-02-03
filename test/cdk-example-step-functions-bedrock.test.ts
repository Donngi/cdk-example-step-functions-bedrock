import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as CdkExampleStepFunctionsBedrock from "../lib/cdk-example-step-functions-bedrock-stack";

test("SnapShot", () => {
  const app = new cdk.App();
  const stack =
    new CdkExampleStepFunctionsBedrock.CdkExampleStepFunctionsBedrockStack(
      app,
      "MyTestStack"
    );
  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});
