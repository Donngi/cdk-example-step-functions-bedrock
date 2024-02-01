import { Construct } from "constructs";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as sfn_task from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as bedrock from "aws-cdk-lib/aws-bedrock";

type WorkFlowProps = {};

export class WorkFlow extends Construct {
  readonly stateMachine: sfn.StateMachine;

  constructor(scope: Construct, id: string, props?: WorkFlowProps) {
    super(scope, id);

    const bedrockTask = new sfn_task.BedrockInvokeModel(this, "BedrockTask", {
      model: bedrock.FoundationModel.fromFoundationModelId(
        this,
        "Model",
        bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_V2_1
      ),
      body: sfn.TaskInput.fromObject({
        "prompt.$": `States.Format('

Human: 以下の文章から、要約を作成してください。
# 条件
- 要約は最大300文字程度としてください。
- 「はい」「要約すると」などの返信は不要です。作成した要約文のみを返却してください

# 要約対象の文章
{}

Assistant:', $.content)`,
        max_tokens_to_sample: 4000,
      }),
      outputPath: "$.Body.completion",
    });

    const stateMachine = new sfn.StateMachine(this, "Workflow", {
      definition: bedrockTask,
    });
    this.stateMachine = stateMachine;
  }
}
