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

// Função auxiliar para criar tempo de espera (evita Rate Limits)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Função principal do agente com Agent Loop (ReAct)
export async function runAgent(prompt: string, onStep?: (stepInfo: string) => void) {
  const tools = await loadTools();

  const systemPrompt = `
Você é um agente autônomo. Você pode pensar e usar ferramentas em várias etapas cronológicas.
Aqui está o catálogo de ferramentas disponíveis:
${JSON.stringify(tools, null, 2)}

Sua tarefa: decidir qual ferramenta usar e gerar a chamada JSON no formato exato:
{ "tool": "<nome>", "parameters": { ... } }

REGRA CRUCIAL DE EXECUÇÃO EM LOOP:
Se você precisar usar uma ferramenta, você vai responder EXATAMENTE COM UM JSON e NADA MAIS. O sistema lerá esse JSON, executará a ferramenta e lhe devolverá textualmente o "Resultado".
Baseado nesse Resultado, você prossegue: Se faltar etapas, você emite OUTRO JSON correspondente à próxima etapa. Pense passo a passo.
APENAS responda com texto livre (sem nenhum JSON ou chaves {}) QUANDO você tiver concluído TODA a tarefa original pedida pelo usuário e quiser dar a resposta final.
Nunca invente IDs ou tente adivinhar chaves de banco de dados. Sempre que necessário, faça chamadas de busca ('buscar_...') antes de tentar inserir novos registros.
`;

  let messages: any[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: prompt }
  ];

  let iteration = 0;
  const maxIterations = 15;

  while (iteration < maxIterations) {
    iteration++;
    console.log(`\n--- Iteração ${iteration} ---`);
    
    // Na API gratuita, podemos tomar "429 Too Many Requests" após vários chamados rápidos.
    if (iteration > 1) {
      console.log("Aguardando 4s para evitar limite de taxa da API Gemini (Erro 429)...");
      await delay(4000);
    }

    let completion;
    let success = false;
    let retries = 0;

    while (!success && retries < 3) {
      try {
        completion = await client.chat.completions.create({
          model: 'gemini-2.5-flash',
          messages: messages,
          temperature: 0.1
        });
        success = true;
      } catch (err: any) {
        if (err.status === 429) {
          retries++;
          console.log(`Recebemos Erro 429. Aguardando mais 10s (Tentativa ${retries}/3)...`);
          await delay(10000);
        } else {
          throw err;
        }
      }
    }

    if (!completion) {
      return "Erro: O agente falhou em acionar o LLM após 3 tentativas devido a rate limits da API (429).";
    }

    const llmResponse = completion.choices[0].message?.content || "";
    console.log("LLM sugeriu:", llmResponse);
    
    // Envia o pensamento do agente para o callback, se ele existir
    if (onStep) {
      onStep(`\n[Agente Pensando]:\n${llmResponse}\n`);
    }
    // Armazenando passo na memória
    messages.push({ role: "assistant", content: llmResponse });

    let parsed;
    try {
      const cleanJson = (llmResponse || "{}").replace(/```json/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleanJson);
      
      // Se interpretou como JSON mas não tem um "tool" definido, apenas retorne o texto
      if (!parsed || !parsed.tool) {
        return llmResponse;
      }
    } catch {
      // Quando o LLM falha ao gerar JSON (escreveu texto livre para o usuário)
      // nós repassamos essa resposta diretamente, quebrando o loop.
      console.log("LLM respondeu em texto livre. Encerrando loop.");
      return llmResponse;
    }

    // Executar tool escolhida

    // Envia qual ferramenta será executada para o callback mostrar na tela
    if (onStep) {
      onStep(`\n[Chamando a Ferramenta '${parsed.tool}']:\n`);
    }

    console.log(`Chamando tool: ${parsed.tool}...`);
    let result;
    try {
      result = await executeTool(parsed.tool, parsed.parameters);
    } catch (error: any) {
      result = { error: error.message || "Erro desconhecido ao executar tool" };
    }
    
    // Envia o resultado da execução da ferramenta para o callback
    if (onStep) {
      onStep(`\n[Resultado da Ferramenta '${parsed.tool}']:\n${JSON.stringify(result, null, 2)}\n`);
    }
    
    console.log("Resultado da tool:", JSON.stringify(result));
    
    // Retroalimenta o Histórico para o LLM
    messages.push({ 
      role: "user", 
      content: `Resultado da chamada de ferramenta '${parsed.tool}':\n${JSON.stringify(result)}\n\nBaseado nesse resultado, decida a próxima etapa retornando um NOVO JSON de tool, OU, se concluiu toda a tarefa inicial, apenas responda em texto.`
    });
  }

  return "O agente atingiu o número máximo de iterações (" + maxIterations + ") permitidas sem encerrar o pensamento e foi forçado a parar.";
}
