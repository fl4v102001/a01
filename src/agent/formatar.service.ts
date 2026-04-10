// textToHtmlEmail.ts

/**
 * Converte texto plano estruturado (saída de agentes/MCP) em HTML formatado para email.
 * Funciona de forma genérica — não precisa conhecer a estrutura dos dados.
 */

export interface EmailHtmlOptions {
  titulo?: string;
  corPrimaria?: string;
  empresa?: string;
  logoUrl?: string;
}

// ── Detectores de padrão ────────────────────────────────────────────────────

function isHeader(line: string): boolean {
  // Aceita "--- Título ---" ou apenas divisores "---"
  return /^---+/.test(line.trim());
}

function isSectionTitle(line: string, nextLine?: string): boolean {
  // Remove marcações markdown (**, números) para avaliar se é título de seção
  const clean = line.replace(/\*/g, '').replace(/^\d+\.\s*/, '').trim();
  return /^[A-ZÁÉÍÓÚÀÂÊÔÃÕÇ][^:]+:$/.test(clean);
}

function getIndentLevel(line: string): number {
  const match = line.match(/^(\s+)/);
  if (!match) return 0;
  return Math.floor(match[1].length / 2);
}

function isListItem(line: string): boolean {
  return /^\s*[-•*]\s+/.test(line);
}

function isKeyValue(line: string): boolean {
  // Remove marcadores de lista temporariamente
  const cleanLine = line.replace(/^\s*[-•*]\s*/, ' ');
  // A chave não deve conter parênteses para evitar falso positivo em itens longos
  return /^\s+[\wÁÉÍÓÚÀÂÊÔÃÕÇ][^:()]+:\s+.+/.test(cleanLine);
}

function formatValue(value: string): string {
  // Destaca valores monetários
  value = value.replace(/(R\$\s*[\d.,]+)/g, '<strong style="color:#1a6b3c">$1</strong>');
  // Destaca status
  value = value.replace(/\b(pendente|aprovado|cancelado|concluído|ativo|inativo)\b/gi, (m) => {
    const colors: Record<string, string> = {
      pendente:   '#92600a',
      aprovado:   '#1a6b3c',
      concluído:  '#1a6b3c',
      cancelado:  '#9b1c1c',
      ativo:      '#1a6b3c',
      inativo:    '#6b6b6b',
    };
    const bg: Record<string, string> = {
      pendente:   '#fef3c7',
      aprovado:   '#d1fae5',
      concluído:  '#d1fae5',
      cancelado:  '#fee2e2',
      ativo:      '#d1fae5',
      inativo:    '#f3f4f6',
    };
    const key = m.toLowerCase();
    return `<span style="background:${bg[key]??'#f3f4f6'};color:${colors[key]??'#374151'};padding:1px 8px;border-radius:4px;font-size:12px;font-weight:500">${m}</span>`;
  });
  // Destaca emails
  value = value.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    '<a href="mailto:$1" style="color:#1d4ed8">$1</a>');
  return value;
}

// ── Parser principal ─────────────────────────────────────────────────────────

interface ParsedBlock {
  type: 'prompt' | 'divider' | 'section' | 'subsection' | 'keyvalue' | 'listitem' | 'text';
  content: string;
  key?: string;
  value?: string;
  indent?: number;
}

function parseLines(text: string): ParsedBlock[] {
  const lines = text.split('\n');
  const blocks: ParsedBlock[] = [];
  let inPromptBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) continue;

    // Prompt original (primeira linha)
    if (trimmed.startsWith('Prompt Original:')) {
      inPromptBlock = true;
      const content = trimmed.replace('Prompt Original:', '').trim();
      blocks.push({ type: 'prompt', content });
      continue;
    }

    // Separador de seção (--- Título --- ou apenas ---)
    if (isHeader(trimmed)) {
      inPromptBlock = false;
      const title = trimmed.replace(/^-+\s*/, '').replace(/\s*-+$/, '');
      blocks.push({ type: 'divider', content: title });
      continue;
    }

    // Se ainda no bloco do prompt, acumula no último bloco
    if (inPromptBlock && blocks.length > 0 && blocks[blocks.length - 1].type === 'prompt') {
      blocks[blocks.length - 1].content += ' ' + trimmed;
      continue;
    }

    const indent = getIndentLevel(line);
    // Limpa a linha de marcadores markdown para facilitar detecção e renderização
    const cleanTrimmed = trimmed.replace(/^[-•*]\s*/, '').replace(/\*\*/g, '').trim();

    // Título de seção principal (sem indentação, termina com ":")
    if (isSectionTitle(trimmed) && indent === 0 && !trimmed.startsWith('*') && !trimmed.startsWith('-')) {
      blocks.push({ type: 'section', content: cleanTrimmed.replace(/^\d+\.\s*/, '').replace(/:$/, '') });
      continue;
    }

    // Chave: Valor
    if (isKeyValue(line)) {
      const colonIdx = cleanTrimmed.indexOf(':');
      const key = cleanTrimmed.substring(0, colonIdx).trim();
      const value = cleanTrimmed.substring(colonIdx + 1).trim();
      blocks.push({ type: 'keyvalue', content: cleanTrimmed, key, value, indent });
      continue;
    }

    // Subtítulo / Agrupador
    if (cleanTrimmed.endsWith(':')) {
      blocks.push({ type: 'subsection', content: cleanTrimmed.replace(/:$/, ''), indent });
      continue;
    }

    // Item de lista
    if (isListItem(line)) {
      blocks.push({ type: 'listitem', content: cleanTrimmed, indent });
      continue;
    }

    // Texto genérico
    blocks.push({ type: 'text', content: cleanTrimmed, indent });
  }

  return blocks;
}

// ── Gerador de HTML ──────────────────────────────────────────────────────────

function renderBlocks(blocks: ParsedBlock[]): string {
  let html = '';
  let inList = false;
  let inKeyGroup = false;

  const closeList = () => { if (inList) { html += '</ul>'; inList = false; } };
  const closeKeyGroup = () => { if (inKeyGroup) { html += '</table></div>'; inKeyGroup = false; } };

  for (const block of blocks) {
    switch (block.type) {

      case 'prompt':
        closeList(); closeKeyGroup();
        html += `
          <div style="background:#f0f4ff;border-left:3px solid #4f6ef7;padding:12px 16px;margin-bottom:24px;border-radius:0 6px 6px 0">
            <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#4f6ef7;text-transform:uppercase;letter-spacing:.5px">Prompt original</p>
            <p style="margin:0;font-size:13px;color:#374151;line-height:1.6">${block.content}</p>
          </div>`;
        break;

      case 'divider':
        closeList(); closeKeyGroup();
        if (block.content) {
          html += `
            <div style="margin:32px 0 20px;padding-bottom:8px;border-bottom:2px solid #e5e7eb">
              <h2 style="margin:0;font-size:18px;font-weight:600;color:#111827">${block.content}</h2>
            </div>`;
        } else {
          html += `<hr style="margin:24px 0;border:none;border-bottom:1px solid #e5e7eb" />`;
        }
        break;

      case 'section':
        closeList(); closeKeyGroup();
        html += `<h3 style="margin:20px 0 10px;font-size:15px;font-weight:600;color:#1f2937;border-bottom:1px solid #f3f4f6;padding-bottom:6px">${block.content}</h3>`;
        break;

      case 'subsection':
        closeList(); closeKeyGroup();
        html += `<h4 style="margin:16px 0 8px;font-size:14px;font-weight:600;color:#374151;padding:8px 12px;background:#f9fafb;border-radius:6px">${block.content}</h4>`;
        break;

      case 'keyvalue':
        closeList();
        if (!inKeyGroup) {
          html += '<div style="margin:4px 0 8px;padding-left:12px"><table style="width:100%;border-collapse:collapse">';
          inKeyGroup = true;
        }
        html += `
          <tr>
            <td style="padding:3px 12px 3px 0;font-size:13px;color:#6b7280;white-space:nowrap;vertical-align:top;width:35%">${block.key}</td>
            <td style="padding:3px 0;font-size:13px;color:#111827">${formatValue(block.value ?? '')}</td>
          </tr>`;
        break;

      case 'listitem':
        closeKeyGroup();
        if (!inList) {
          html += '<ul style="margin:4px 0 12px;padding-left:20px;list-style:none">';
          inList = true;
        }
        html += `<li style="margin:4px 0;font-size:13px;color:#374151;padding:3px 0;border-bottom:1px solid #f9fafb">
                   <span style="color:#9ca3af;margin-right:8px">•</span>${formatValue(block.content)}
                 </li>`;
        break;

      default:
        closeList(); closeKeyGroup();
        html += `<p style="margin:4px 0 8px;font-size:13px;color:#374151">${block.content}</p>`;
    }
  }

  closeList();
  closeKeyGroup();
  return html;
}

// ── Template de email ────────────────────────────────────────────────────────

function emailTemplate(body: string, options: EmailHtmlOptions): string {
  const {
    titulo = 'Relatório',
    corPrimaria = '#1d4ed8',
    empresa = '',
  } = options;

  const now = new Date().toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' });

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${titulo}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- Cabeçalho -->
        <tr><td style="background:${corPrimaria};padding:24px 32px;border-radius:10px 10px 0 0">
          <p style="margin:0;font-size:20px;font-weight:600;color:#fff">${titulo}</p>
          ${empresa ? `<p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,.75)">${empresa}</p>` : ''}
        </td></tr>

        <!-- Corpo -->
        <tr><td style="background:#fff;padding:28px 32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb">
          ${body}
        </td></tr>

        <!-- Rodapé -->
        <tr><td style="background:#f9fafb;padding:16px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px;text-align:center">
          <p style="margin:0;font-size:12px;color:#9ca3af">Gerado automaticamente em ${now}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Função principal exportada ───────────────────────────────────────────────

export function converterParaHtmlEmail(
  textoPlano: string,
  options: EmailHtmlOptions = {}
): string {
  const blocks = parseLines(textoPlano);
  const body = renderBlocks(blocks);

  // Tenta extrair título do texto (primeiro "--- Título ---")
  const tituloMatch = textoPlano.match(/^---+\s*([^-]+?)\s*---+$/m);
  const titulo = options.titulo ?? (tituloMatch ? tituloMatch[1].trim() : 'Relatório');

  return emailTemplate(body, { ...options, titulo });
}