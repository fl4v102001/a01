// agent-llm.ts
import fetch from "node-fetch";
import OpenAI from "openai";
import { config } from 'dotenv';
import * as path from 'path';

// Resolve o caminho absoluto apontando para a raiz do projeto (dois níveis acima de src/agent/)
config({ path: path.resolve(__dirname, '../../.env') });
console.log("Chave do Gemini:", process.env.GEMINI_API_KEY);
// You can use the Gemini API directly with the OpenAI SDK by pointing the baseURL to the Gemini OpenAI compatibility endpoint.
const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY, 
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
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
    model: 'gemini-2.5-flash',
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
    
    // Se interpretou como JSON mas não tem um "tool" definido, apenas retorne o texto
    if (!parsed || !parsed.tool) {
      return llmResponse;
    }
  } catch {
    // Quando o LLM falha ao gerar JSON (ou seja, escreveu texto livre para o usuário)
    // nós repassamos essa resposta diretamente, em vez de retornar null
    console.log("LLM respondeu em texto livre.");
    return llmResponse;
  }

  // 4. Executar tool escolhida
  const result = await executeTool(parsed.tool, parsed.parameters);

  // 5. Devolver resultado final
  return result;
}
