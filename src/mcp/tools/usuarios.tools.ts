import { McpTool } from '../types';
import { UsuarioService } from '../../api/services/usuario.service';

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
      const usuarioService = new UsuarioService();
      return await usuarioService.create(args);
    }
  },
  {
    name: 'alterar_usuario',
    description: 'Atualiza os dados (como o nome e e-mail) de um usuário existente pelo seu ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id_usuario: { type: 'number', description: 'O ID único do usuário' },
        nome_usuario: { type: 'string', description: 'O novo nome do usuário' },
        email_usuario: { type: 'string', description: 'O novo endereço de email do usuário' }
      },
      required: ['id_usuario', 'nome_usuario']
    },
    execute: async (args: any) => {
      const { id_usuario, ...body } = args;
      const usuarioService = new UsuarioService();
      return await usuarioService.update(id_usuario, body);
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
      const usuarioService = new UsuarioService();
      await usuarioService.delete(args.id_usuario);
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
      const usuarioService = new UsuarioService();
      return await usuarioService.addPerfil(id_usuario, id_perfil);
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
      const usuarioService = new UsuarioService();
      await usuarioService.removePerfil(id_usuario, id_perfil);
      return { success: true };
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
      const usuarioService = new UsuarioService();
      return await usuarioService.findById(args.id_usuario);
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
      const usuarioService = new UsuarioService();
      return await usuarioService.findByNome(args.nome_usuario);
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
      const usuarioService = new UsuarioService();
      return await usuarioService.findByEmail(args.email_usuario);
    }
  },
  {
    name: 'listar_todos_usuarios',
    description: 'Lista todos os usuários cadastrados, incluindo seus perfis e transações vinculadas a eles.',
    inputSchema: {
      type: 'object',
      properties: {
      },
      required: []
    },
    execute: async () => {
      const usuarioService = new UsuarioService();
      const usuarios = await usuarioService.listAllUsers();
      return usuarios;
    }
  }
];
