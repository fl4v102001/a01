import { McpTool } from '../types';
import emailService from '../../api/services/email.service';

export const geralTools: McpTool[] = [
  {
    name: 'enviar_email',
    description: 'Envia um e-mail para um destinatário específico contendo uma mensagem em destaque. Deve ser utilizado sempre que for necessário notificar um usuário, repassar resultados de tarefas, enviar alertas ou se comunicar ativamente com pessoas. O contrato exige estritamente o endereço de e-mail de destino ("to") e o texto da mensagem ("msg") que será injetado no corpo do e-mail.',
    inputSchema: {
      type: 'object',
      properties: {
        to: { type: 'string', description: 'O endereço de e-mail do destinatário (ex: usuario@dominio.com)' },
        msg: { type: 'string', description: 'A mensagem de texto que será enviada em destaque no corpo do e-mail' }
      },
      required: ['to', 'msg']
    },
    execute: async (args: any) => {
      const { to, msg } = args;
      // Consome a instância singleton exportada pelo serviço
      await emailService.sendEmail(to, msg);
      
      return { success: true, message: `E-mail enviado com sucesso para ${to}.` };
    }
  },
  {
    name: "lista_arquivos_locais",
    description: "Lista arquivos em um diretório da máquina do usuário",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string", description: "Caminho do diretório" }
      },
      required: ["path"]
    },
    execute: async (args: any) => {
      const fs = require('fs').promises;
      try {
        const files = await fs.readdir(args.path);
        return { success: true, files };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    }
  }  
]


;