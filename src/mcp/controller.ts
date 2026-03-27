import { Request, Response } from 'express';
import { allTools } from './tools';

export const mcpController = {
  getTools: (req: Request, res: Response) => {
    // Retorna as ferramentas ocultando a função de execute
    const toolsDocs = allTools.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema
    }));

    res.json({ tools: toolsDocs });
  },

  executeTool: async (req: Request, res: Response): Promise<void> => {
    const { toolName, args } = req.body;

    if (!toolName) {
      res.status(400).json({ error: 'Atributo `toolName` é obrigatório.' });
      return;
    }

    const tool = allTools.find(t => t.name === toolName);

    if (!tool) {
      res.status(404).json({ error: `Tool não encontrada: ${toolName}` });
      return;
    }

    try {
      const result = await tool.execute(args || {});
      res.json({ result });
    } catch (error: any) {
      console.error(`Erro ao executar tool ${toolName}:`, error);
      res.status(500).json({ error: error.message || 'Erro interno na tool' });
    }
  }
};
