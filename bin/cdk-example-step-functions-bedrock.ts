#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CdkExampleStepFunctionsBedrockStack } from "../lib/cdk-example-step-functions-bedrock-stack";

const app = new cdk.App();
new CdkExampleStepFunctionsBedrockStack(
  app,
  "CdkExampleStepFunctionsBedrockStack",
  {}
);

cdk.Tags.of(app).add("repository", "cdk-example-step-functions-bedrock");
