import { McpTool } from '../types';
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000/api';

export const autorizacoesTools: McpTool[] = [
  {
    name: 'conceder_autorizacao',
    description: 'Concede uma permissão/autorização específica para um perfil sobre uma transação.',
    inputSchema: {
      type: 'object',
      properties: {
        id_perfil: { type: 'number', description: 'O ID do perfil' },
        id_transacao: { type: 'number', description: 'O ID da transação' },
        autorizacao: { type: 'string', description: 'O nível da permissão (ex: "leitura", "total", "escrita")' }
      },
      required: ['id_perfil', 'id_transacao', 'autorizacao']
    },
    execute: async (args: any) => {
      const resp = await fetch(`${API_BASE}/autorizacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
      if (!resp.ok) throw new Error(`Falha ao conceder autorização: ${resp.statusText}`);
      return await resp.json();
    }
  },
  {
    name: 'alterar_autorizacao',
    description: 'Altera o nível de permissão de uma autorização existente pelo seu ID (da relação perfil vs transacao).',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'O ID do relacionamento de autorização' },
        autorizacao: { type: 'string', description: 'Novo nível de permissão' }
      },
      required: ['id', 'autorizacao']
    },
    execute: async (args: any) => {
      const { id, ...body } = args;
      const resp = await fetch(`${API_BASE}/autorizacoes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!resp.ok) throw new Error(`Falha ao alterar autorização: ${resp.statusText}`);
      return await resp.json();
    }
  },
  {
    name: 'revogar_autorizacao',
    description: 'Remove/revoga a autorização de um perfil sobre uma transação pelo seu ID (da relação).',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'O ID do relacionamento de autorização a excluir' }
      },
      required: ['id']
    },
    execute: async (args: any) => {
      const resp = await fetch(`${API_BASE}/autorizacoes/${args.id}`, {
        method: 'DELETE'
      });
      if (!resp.ok) throw new Error(`Falha ao revogar autorização: ${resp.statusText}`);
      return { success: true, message: 'Autorização revogada com sucesso' };
    }
  }
];
