import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

// 環境変数の読み込み
const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
const apiKey = process.env["AZURE_OPENAI_KEY"];
const deployment = process.env["AZURE_OPENAI_DEPLOYMENT"];

let client;

try {
  if (!endpoint || !apiKey || !deployment) {
    throw new Error("環境変数が正しく設定されていません。");
  }
  client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
} catch (setupError) {
  console.error("初期化エラー:", setupError);
}

// Azure Functions のエクスポート
export default async function (context, req) {
  try {
    const userMessage = req.body?.message;

    if (!userMessage) {
      context.res = {
        status: 400,
        body: { error: "message パラメータが必要です。" }
      };
      return;
    }

    const messages = [
      { role: "system", content: "あなたは優秀なアシスタントです。" },
      { role: "user", content: userMessage }
    ];

    const response = await client.getChatCompletions(deployment, messages, {
      temperature: 0.7,
    });

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        reply: response.choices[0].message.content
      }
    };
  } catch (error) {
    context.log.error("実行時エラー:", error);

    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: {
        error: "Internal Server Error",
        message: error.message || "不明なエラーが発生しました"
      }
    };
  }
}
