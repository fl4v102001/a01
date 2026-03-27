import { McpTool } from '../types';
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000/api';

export const usuariosTools: McpTool[] = [
  {
    name: 'criar_usuario',
    description: 'Cria um novo usuário no sistema com nome e email.',
    inputSchema: {
      type: 'object',
      properties: {
        nome_usuario: { type: 'string', description: 'O nome completo do usuário' },
        email_usuario: { type: 'string', description: 'O endereço de email do usuário' }
      },
      required: ['nome_usuario', 'email_usuario']
    },
    execute: async (args: any) => {
      const resp = await fetch(`${API_BASE}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
      if (!resp.ok) throw new Error(`Falha ao criar usuário: ${resp.statusText}`);
      return await resp.json();
    }
  },
  {
    name: 'alterar_usuario',
    description: 'Atualiza os dados (como o nome) de um usuário existente pelo seu ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id_usuario: { type: 'number', description: 'O ID único do usuário' },
        nome_usuario: { type: 'string', description: 'O novo nome do usuário' }
      },
      required: ['id_usuario', 'nome_usuario']
    },
    execute: async (args: any) => {
      const { id_usuario, ...body } = args;
      const resp = await fetch(`${API_BASE}/usuarios/${id_usuario}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!resp.ok) throw new Error(`Falha ao alterar usuário: ${resp.statusText}`);
      return await resp.json();
    }
  },
  {
    name: 'excluir_usuario',
    description: 'Remove um usuário do sistema permanentemente usando o seu ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id_usuario: { type: 'number', description: 'O ID do usuário a ser excluído' }
      },
      required: ['id_usuario']
    },
    execute: async (args: any) => {
      const resp = await fetch(`${API_BASE}/usuarios/${args.id_usuario}`, {
        method: 'DELETE'
      });
      if (!resp.ok) throw new Error(`Falha ao excluir usuário: ${resp.statusText}`);
      return { success: true, message: 'Usuário excluído com sucesso' };
    }
  },
  {
    name: 'adicionar_perfil_usuario',
    description: 'Associa um perfil existente a um usuário específico.',
    inputSchema: {
      type: 'object',
      properties: {
        id_usuario: { type: 'number', description: 'O ID do usuário' },
        id_perfil: { type: 'number', description: 'O ID do perfil a vincular' }
      },
      required: ['id_usuario', 'id_perfil']
    },
    execute: async (args: any) => {
      const { id_usuario, id_perfil } = args;
      const resp = await fetch(`${API_BASE}/usuarios/${id_usuario}/perfis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_perfil })
      });
      if (!resp.ok) throw new Error(`Falha ao adicionar perfil: ${resp.statusText}`);
      return await resp.json();
    }
  },
  {
    name: 'remover_perfil_usuario',
    description: 'Desassocia um perfil de um usuário específico.',
    inputSchema: {
      type: 'object',
      properties: {
        id_usuario: { type: 'number', description: 'O ID do usuário' },
        id_perfil: { type: 'number', description: 'O ID do perfil a remover' }
      },
      required: ['id_usuario', 'id_perfil']
    },
    execute: async (args: any) => {
      const { id_usuario, id_perfil } = args;
      const resp = await fetch(`${API_BASE}/usuarios/${id_usuario}/perfis/${id_perfil}`, {
        method: 'DELETE'
      });
      if (!resp.ok) throw new Error(`Falha ao remover perfil: ${resp.statusText}`);
      if (resp.status === 204) return { success: true };
      return await resp.json().catch(() => ({ success: true }));
    }
  },
  {
    name: 'buscar_usuario_por_id',
    description: 'Busca um usuário específico pelo seu ID. Retorna também todos os perfis associados ao usuário e todas as transações de cada perfil.',
    inputSchema: {
      type: 'object',
      properties: {
        id_usuario: { type: 'number', description: 'O ID único do usuário' }
      },
      required: ['id_usuario']
    },
    execute: async (args: any) => {
      const resp = await fetch(`${API_BASE}/usuarios/${args.id_usuario}`);
      if (!resp.ok) throw new Error(`Falha ao buscar usuário por ID: ${resp.statusText}`);
      return await resp.json();
    }
  },
  {
    name: 'buscar_usuario_por_nome',
    description: 'Busca usuários baseando-se em uma busca textual pelo nome completo (ou parte dele). O retorno inclui também os perfis associados a cada usuário e as transações de cada perfil.',
    inputSchema: {
      type: 'object',
      properties: {
        nome_usuario: { type: 'string', description: 'O nome (ou parte do nome) do usuário para buscar' }
      },
      required: ['nome_usuario']
    },
    execute: async (args: any) => {
      const resp = await fetch(`${API_BASE}/usuarios/nome/${args.nome_usuario}`);
      if (!resp.ok) throw new Error(`Falha ao buscar usuário por nome: ${resp.statusText}`);
      return await resp.json();
    }
  },
  {
    name: 'buscar_usuario_por_email',
    description: 'Busca um usuário exato pelo seu endereço de e-mail. Retorna também todos os perfis associados ao usuário e todas as transações vinculadas a esses perfis.',
    inputSchema: {
      type: 'object',
      properties: {
        email_usuario: { type: 'string', description: 'O email exato do usuário' }
      },
      required: ['email_usuario']
    },
    execute: async (args: any) => {
      const resp = await fetch(`${API_BASE}/usuarios/email/${args.email_usuario}`);
      if (!resp.ok) throw new Error(`Falha ao buscar usuário por e-mail: ${resp.statusText}`);
      return await resp.json();
    }
  }
];
