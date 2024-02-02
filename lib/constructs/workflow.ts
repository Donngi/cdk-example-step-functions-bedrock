import { Construct } from "constructs";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as sfn_task from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as bedrock from "aws-cdk-lib/aws-bedrock";
import * as aws_logs from "aws-cdk-lib/aws-logs";

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
      // API Gatewayに
      //  { "content": "要約対象の文章" }
      // の形式でリクエストを送ると、
      // step functionsには
      //  { "body": { "content": "要約対象の文章" } }
      // という形式でリクエストが渡される
      body: sfn.TaskInput.fromObject({
        "prompt.$": `States.Format('

Human: 以下の文章から、要約を作成してください。
# 条件
- 要約は最大300文字程度としてください。
- 要約では、原文の主要な論点を網羅し、偏見のない表現を用いてください。
- 要約は日本語で作成してください。
- 作成した要約文のみを返却してください。「はい」「要約すると」などは不要です。

# 要約対象の文章
{}

# 要約文の例
この記事は「Claudeのプロンプトエンジニアリング」について解説しています。
適切なプロンプトを用いることで、より目的に沿った応答を得ることができます。
この記事では3つのプロンプトエンジニアリングの手法を解説しています。
1つ目の手法は、「Chain of Thought」です。この方法では段階的な思考を促すことで精度を高めます。
2つ目の手法は、「Generate Knowledge Prompting」です。この方法ではプロンプト内に回答生成に利用する情報を埋め込みます。
3つ目の手法は、「Self-Consistency」です。この方法では連想的な思考プロンプトを大量に含めることで、精度の向上を狙います。

Assistant:', $.body.content)`,
        max_tokens_to_sample: 4000,
      }),
      outputPath: "$.Body.completion",
    });

    const stateMachine = new sfn.StateMachine(this, "Workflow", {
      definitionBody: sfn.DefinitionBody.fromChainable(bedrockTask),
      stateMachineType: sfn.StateMachineType.EXPRESS,
      logs: {
        destination: new aws_logs.LogGroup(this, "stateMachineLogGroup", {
          logGroupName: "stateMachineLogGroup",
          retention: aws_logs.RetentionDays.FIVE_DAYS,
        }),
        level: sfn.LogLevel.ERROR,
      },
    });
    this.stateMachine = stateMachine;
  }
}
