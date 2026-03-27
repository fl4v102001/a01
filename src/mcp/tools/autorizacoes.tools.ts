import { McpTool } from '../types';
import { AutorizacaoService } from '../../api/services/autorizacao.service';

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
      const autorizacaoService = new AutorizacaoService();
      return await autorizacaoService.create(args);
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
      const autorizacaoService = new AutorizacaoService();
      return await autorizacaoService.update(id, body);
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
      const autorizacaoService = new AutorizacaoService();
      await autorizacaoService.delete(args.id);
      return { success: true, message: 'Autorização revogada com sucesso' };
    }
  }
];
