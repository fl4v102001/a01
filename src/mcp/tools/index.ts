import { McpTool } from '../types';
import { usuariosTools } from './usuarios.tools';
import { perfisTools } from './perfis.tools';
import { transacoesTools } from './transacoes.tools';
import { autorizacoesTools } from './autorizacoes.tools';

export const allTools: McpTool[] = [
  ...usuariosTools,
  ...perfisTools,
  ...transacoesTools,
  ...autorizacoesTools
];
