import { McpTool } from '../types';
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000/api';

export const transacoesTools: McpTool[] = [
  {
    name: 'criar_transacao',
    description: 'Cria uma nova transação ou funcionalidade no sistema.',
    inputSchema: {
      type: 'object',
      properties: {
        nome_transacao: { type: 'string', description: 'O nome da transação (ex: "CRIAR_USUARIO")' }
      },
      required: ['nome_transacao']
    },
    execute: async (args: any) => {
      const resp = await fetch(`${API_BASE}/transacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
      if (!resp.ok) throw new Error(`Falha ao criar transação: ${resp.statusText}`);
      return await resp.json();
    }
  },
  {
    name: 'alterar_transacao',
    description: 'Atualiza o nome de uma transação existente no sistema.',
    inputSchema: {
      type: 'object',
      properties: {
        id_transacao: { type: 'number', description: 'O ID da transação' },
        nome_transacao: { type: 'string', description: 'O novo nome da transação' }
      },
      required: ['id_transacao', 'nome_transacao']
    },
    execute: async (args: any) => {
      const { id_transacao, ...body } = args;
      const resp = await fetch(`${API_BASE}/transacoes/${id_transacao}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!resp.ok) throw new Error(`Falha ao alterar transação: ${resp.statusText}`);
      return await resp.json();
    }
  },
  {
    name: 'excluir_transacao',
    description: 'Remove permanentemente uma transação do sistema.',
    inputSchema: {
      type: 'object',
      properties: {
        id_transacao: { type: 'number', description: 'O ID da transação a ser excluída' }
      },
      required: ['id_transacao']
    },
    execute: async (args: any) => {
      const resp = await fetch(`${API_BASE}/transacoes/${args.id_transacao}`, {
        method: 'DELETE'
      });
      if (!resp.ok) throw new Error(`Falha ao excluir transação: ${resp.statusText}`);
      return { success: true, message: 'Transação excluída com sucesso' };
    }
  },
  {
    name: 'buscar_transacao_por_id',
    description: 'Busca uma transação específica pelo seu ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id_transacao: { type: 'number', description: 'O ID da transação' }
      },
      required: ['id_transacao']
    },
    execute: async (args: any) => {
      const resp = await fetch(`${API_BASE}/transacoes/${args.id_transacao}`);
      if (!resp.ok) throw new Error(`Falha ao buscar transação por ID: ${resp.statusText}`);
      return await resp.json();
    }
  },
  {
    name: 'buscar_transacao_por_nome',
    description: 'Busca transações baseando-se em uma busca textual (parcial ou total) pelo nome da transação.',
    inputSchema: {
      type: 'object',
      properties: {
        nome_transacao: { type: 'string', description: 'O nome (ou parte) da transação para buscar' }
      },
      required: ['nome_transacao']
    },
    execute: async (args: any) => {
      const resp = await fetch(`${API_BASE}/transacoes/nome/${args.nome_transacao}`);
      if (!resp.ok) throw new Error(`Falha ao buscar transação por nome: ${resp.statusText}`);
      return await resp.json();
    }
  }
];
