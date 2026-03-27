// agent-llm.ts
import fetch from "node-fetch";
import OpenAI from "openai";
import { config } from 'dotenv';

config(); // Carrega as variáveis de ambiente do .env
console.log("Chave do Gemini:", process.env.GEMINI_API_KEY);
// NOTE: The public Gemini API is not directly compatible with the OpenAI SDK.
// You need to use a proxy that translates OpenAI API requests to Gemini API requests.
// The baseURL should be the URL of your proxy. The proxy will also handle
// translating the 'Authorization: Bearer <key>' header sent by this client
// to the format Gemini expects.
const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY, // Your Gemini API key must be in your .env file
  baseURL: 'https://your-gemini-proxy.com/v1', // Replace with your actual proxy URL
});

// Função para carregar catálogo de tools do MCP Server
async function loadTools() {
  const response = await fetch("http://localhost:3000/mcp/tools");
  const data = (await response.json()) as { tools: any[] };
  return data.tools;
}

// Função para executar tool no MCP Server
async function executeTool(toolName: string, parameters: any) {
  const response = await fetch("http://localhost:3000/mcp/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ toolName, args: parameters })
  });
  return response.json();
}

// Função principal do agente
export async function runAgent(prompt: string) {
  // 1. Carregar catálogo
  const tools = await loadTools();

  // 2. Passar prompt + catálogo para o LLM
  const systemPrompt = `
Você é um agente que usa ferramentas MCP.
Aqui está o catálogo de ferramentas disponíveis:
${JSON.stringify(tools, null, 2)}

Sua tarefa: decidir qual ferramenta usar e gerar a chamada JSON no formato:
{ "tool": "<nome>", "parameters": { ... } }
`;

  const completion = await client.chat.completions.create({
    // Use the model name your proxy expects for Gemini 1.5 Flash
    model: 'gemini-1.5-flash-latest',
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ]
  });

  const llmResponse = completion.choices[0].message?.content;
  console.log("LLM sugeriu:", llmResponse);

  // 3. Interpretar resposta do LLM como JSON
  let parsed;
  try {
    const cleanJson = (llmResponse || "{}").replace(/```json/g, "").replace(/```/g, "").trim();
    parsed = JSON.parse(cleanJson);
  } catch {
    console.error("Erro ao interpretar resposta do LLM");
    return null;
  }

  // 4. Executar tool escolhida
  const result = await executeTool(parsed.tool, parsed.parameters);

  // 5. Devolver resultado final
  return result;
}
