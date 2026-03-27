import { McpTool } from '../types';
import { PerfilService } from '../../api/services/perfil.service';

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
      const perfilService = new PerfilService();
      return await perfilService.create(args);
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
      const perfilService = new PerfilService();
      return await perfilService.update(id_perfil, body);
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
      const perfilService = new PerfilService();
      await perfilService.delete(args.id_perfil);
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
      const perfilService = new PerfilService();
      return await perfilService.findById(args.id_perfil);
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
      const perfilService = new PerfilService();
      return await perfilService.findByNome(args.nome_perfil);
    }
  }
];
