import { McpTool } from '../types';
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000/api';

export const perfisTools: McpTool[] = [
  {
    name: 'criar_perfil',
    description: 'Cria um novo perfil de acesso no sistema (ex: "Administrador").',
    inputSchema: {
      type: 'object',
      properties: {
        nome_perfil: { type: 'string', description: 'O nome do perfil' }
      },
      required: ['nome_perfil']
    },
    execute: async (args: any) => {
      const resp = await fetch(`${API_BASE}/perfis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
      if (!resp.ok) throw new Error(`Falha ao criar perfil: ${resp.statusText}`);
      return await resp.json();
    }
  },
  {
    name: 'alterar_perfil',
    description: 'Atualiza o nome de um perfil de acesso existente.',
    inputSchema: {
      type: 'object',
      properties: {
        id_perfil: { type: 'number', description: 'O ID do perfil' },
        nome_perfil: { type: 'string', description: 'O novo nome do perfil' }
      },
      required: ['id_perfil', 'nome_perfil']
    },
    execute: async (args: any) => {
      const { id_perfil, ...body } = args;
      const resp = await fetch(`${API_BASE}/perfis/${id_perfil}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!resp.ok) throw new Error(`Falha ao alterar perfil: ${resp.statusText}`);
      return await resp.json();
    }
  },
  {
    name: 'excluir_perfil',
    description: 'Remove um perfil de acesso do sistema.',
    inputSchema: {
      type: 'object',
      properties: {
        id_perfil: { type: 'number', description: 'O ID do perfil a excluir' }
      },
      required: ['id_perfil']
    },
    execute: async (args: any) => {
      const resp = await fetch(`${API_BASE}/perfis/${args.id_perfil}`, {
        method: 'DELETE'
      });
      if (!resp.ok) throw new Error(`Falha ao excluir perfil: ${resp.statusText}`);
      return { success: true, message: 'Perfil excluído com sucesso' };
    }
  },
  {
    name: 'buscar_perfil_por_id',
    description: 'Busca um perfil específico pelo seu ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id_perfil: { type: 'number', description: 'O ID do perfil' }
      },
      required: ['id_perfil']
    },
    execute: async (args: any) => {
      const resp = await fetch(`${API_BASE}/perfis/${args.id_perfil}`);
      if (!resp.ok) throw new Error(`Falha ao buscar perfil por ID: ${resp.statusText}`);
      return await resp.json();
    }
  },
  {
    name: 'buscar_perfil_por_nome',
    description: 'Busca perfis baseando-se em uma busca textual (parcial ou total) pelo nome do perfil.',
    inputSchema: {
      type: 'object',
      properties: {
        nome_perfil: { type: 'string', description: 'O nome (ou parte do nome) do perfil para buscar' }
      },
      required: ['nome_perfil']
    },
    execute: async (args: any) => {
      const resp = await fetch(`${API_BASE}/perfis/nome/${args.nome_perfil}`);
      if (!resp.ok) throw new Error(`Falha ao buscar perfil por nome: ${resp.statusText}`);
      return await resp.json();
    }
  }
];
