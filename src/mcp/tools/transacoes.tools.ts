import { McpTool } from '../types';
import { TransacaoService } from '../../api/services/transacao.service';

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
      const transacaoService = new TransacaoService();
      return await transacaoService.create(args);
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
      const transacaoService = new TransacaoService();
      return await transacaoService.update(id_transacao, body);
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
      const transacaoService = new TransacaoService();
      await transacaoService.delete(args.id_transacao);
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
      const transacaoService = new TransacaoService();
      return await transacaoService.findById(args.id_transacao);
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
      const transacaoService = new TransacaoService();
      return await transacaoService.findByNome(args.nome_transacao);
    }
  }
];
