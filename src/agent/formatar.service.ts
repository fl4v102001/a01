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

// ── Parser Markdown para HTML ───────────────────────────────────────────────

function parseMarkdownToHtml(text: string): string {
  if (!text) return '';

  // 1. Limpeza de texto sujo gerado por LLMs (excesso de quebras de linha e espaços)
  // Remove literais de quebra de linha (suporta \n, \\n, etc. que possam ter vazado)
  let md = text.replace(/\\+n/g, '\n');
  md = md.replace(/\r\n/g, '\n');
  // Colapsa qualquer combinação longa de \n e espaços vazios em exatamente \n\n
  md = md.replace(/(\n\s*){2,}/g, '\n\n');
  md = md.trim();

  // 2. Destaca valores e formatações customizadas do sistema (usa o helper que sobrou)
  md = formatValue(md);

  // 3. Negrito e Itálico
  md = md.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  md = md.replace(/\*(.*?)\*/g, '<em>$1</em>');
  md = md.replace(/__(.*?)__/g, '<strong>$1</strong>');
  md = md.replace(/_(.*?)_/g, '<em>$1</em>');

  // 4. Cabeçalhos
  md = md.replace(/^###\s+(.*$)/gim, '<h4 style="margin:16px 0 8px;font-size:14px;font-weight:600;color:#374151;padding:8px 12px;background:#f9fafb;border-radius:6px">$1</h4>');
  md = md.replace(/^##\s+(.*$)/gim, '<h3 style="margin:20px 0 10px;font-size:15px;font-weight:600;color:#1f2937;border-bottom:1px solid #f3f4f6;padding-bottom:6px">$1</h3>');
  md = md.replace(/^#\s+(.*$)/gim, '<h2 style="margin:32px 0 20px;font-size:18px;font-weight:600;color:#111827;border-bottom:2px solid #e5e7eb;padding-bottom:8px">$1</h2>');

  // 5. Bloco de Prompt Original
  md = md.replace(/^Prompt Original:\s*(.*)$/gim, '<div style="background:#f0f4ff;border-left:3px solid #4f6ef7;padding:12px 16px;margin-bottom:24px;border-radius:0 6px 6px 0"><p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#4f6ef7;text-transform:uppercase;letter-spacing:.5px">Prompt original</p><p style="margin:0;font-size:13px;color:#374151;line-height:1.6">$1</p></div>');

  // 6. Tabela de Chave: Valor (mantida compatibilidade)
  md = md.replace(/^([a-zA-ZÁÉÍÓÚÀÂÊÔÃÕÇ][\w\sÁÉÍÓÚÀÂÊÔÃÕÇ]+):\s+(.+)$/gim, (match, key, val) => {
    return `<tr data-kv="true"><td style="padding:3px 12px 3px 0;font-size:13px;color:#6b7280;vertical-align:top;width:35%">${key}</td><td style="padding:3px 0;font-size:13px;color:#111827">${val}</td></tr>`;
  });
  md = md.replace(/(<tr data-kv="true">.*?<\/tr>[\n\s]*)+/gim, (match) => {
    return `<div style="margin:4px 0 8px;padding-left:12px"><table style="width:100%;border-collapse:collapse">\n${match.trim()}\n</table></div>`;
  });

  // 7. Listas (trata marcadores -, *, • mesmo colados no texto como no seu exemplo "•p08")
  md = md.replace(/^\s*[-*•]\s*(.*)$/gim, '<li style="margin:4px 0;font-size:13px;color:#374151;padding:3px 0;border-bottom:1px solid #f9fafb"><span style="color:#9ca3af;margin-right:8px">•</span>$1</li>');
  md = md.replace(/(<li[^>]*>.*?<\/li>[\n\s]*)+/gim, (match) => {
    return `<ul style="margin:4px 0 12px;padding-left:20px;list-style:none">\n${match.trim()}\n</ul>`;
  });

  // 8. Divisores
  md = md.replace(/^---+$/gim, '<hr style="margin:24px 0;border:none;border-bottom:1px solid #e5e7eb" />');
  md = md.replace(/^---\s+(.+?)\s+---$/gim, '<div style="margin:32px 0 20px;padding-bottom:8px;border-bottom:2px solid #e5e7eb"><h2 style="margin:0;font-size:18px;font-weight:600;color:#111827">$1</h2></div>');

  // 9. Parágrafos
  let paragraphs = md.split('\n\n');
  paragraphs = paragraphs.map(p => {
    const trimmed = p.trim();
    if (!trimmed) return '';
    // Evita envolver blocos HTML já formatados em <p>
    if (/^<(h[1-6]|ul|li|div|hr|table|tr|td)/i.test(trimmed)) {
      return trimmed;
    }
    return `<p style="margin:4px 0 8px;font-size:13px;color:#374151">${trimmed}</p>`;
  });

  return paragraphs.join('\n');
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
  // Extrai possíveis "sujeiras" do formato JSON se o texto estiver encapsulado
  let cleanText = (textoPlano || '').trim();

  // Limpa marcação markdown de código JSON caso exista
  cleanText = cleanText.replace(/^```json/i, '').replace(/```$/, '').trim();

  try {
    const parsed = JSON.parse(cleanText);
    if (parsed && typeof parsed.result === 'string') cleanText = parsed.result;
    else if (parsed && parsed.result) cleanText = JSON.stringify(parsed.result);
  } catch (e) {
    // Fallback via RegEx: extrai se o JSON estiver inválido (ex: quebras de linha não escapadas ou truncado)
    const match = cleanText.match(/"result"\s*:\s*["']([\s\S]*)/i);
    if (match && match[1]) {
      cleanText = match[1].replace(/["']\s*}?\s*$/, '');
    }
  }

  // Converte "escapes" literais agressivamente (suporta múltiplos escapes gerados por LLMs, ex: \\n ou \\\\n)
  cleanText = cleanText.replace(/\\+n/g, '\n').replace(/\\+t/g, '\t').replace(/\\+"/g, '"');

  const body = parseMarkdownToHtml(cleanText);

  // Tenta extrair título do texto (primeiro "# Título" ou "--- Título ---")
  const tituloMatch = cleanText.match(/^#\s+(.+)$/m) || cleanText.match(/^---+\s*([^-]+?)\s*---+$/m);
  const titulo = options.titulo ?? (tituloMatch ? tituloMatch[1].trim() : 'Relatório');

  return emailTemplate(body, { ...options, titulo });
}