import React from 'react';

interface FormattedTextProps {
  content: string;
  className?: string;
}

/**
 * Normaliza textos vindos da base de dados (que possam conter quebras de linha soltas de textarea
 * ou tags HTML legadas como <p class="...">, <br><br>, &nbsp;) e renderiza parágrafos reais,
 * fluidos, contínuos e justificados.
 */
export default function FormattedText({
  content,
  className = 'text-base sm:text-lg text-neutral-700 leading-relaxed text-justify',
}: FormattedTextProps) {
  if (!content) return null;

  // 1. Descodificar entidades HTML
  let text = content
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');

  // 2. Identificar quebras de parágrafo genuínas:
  // - Fecho de tags de bloco
  // - Abertura de tags de bloco (<p>, <div>, etc.)
  // - Tags <br> isoladas ou repetidas usadas como quebra de parágrafo
  // - Quebras duplas de linha
  text = text
    .replace(/<\/(?:p|div|h[1-6]|li)>/gi, '__PARAGRAPH_BREAK__')
    .replace(/<(?:p|div|h[1-6]|li)[^>]*>/gi, '__PARAGRAPH_BREAK__')
    .replace(/(?:<br\s*\/?>\s*)+/gi, '__PARAGRAPH_BREAK__')
    .replace(/(?:\r?\n\s*){2,}/g, '__PARAGRAPH_BREAK__');

  // 3. Remover qualquer tag HTML restante (ex: spans, font, etc.)
  text = text.replace(/<[^>]+>/g, '');

  // 4. Quebras de linha soltas restantes dentro da mesma frase tornam-se espaço
  text = text.replace(/[\r\n]+/g, ' ');

  // 5. Separar em parágrafos reais
  const rawParagraphs = text.split('__PARAGRAPH_BREAK__');

  const paragraphs = rawParagraphs
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter((p) => p.length > 0);

  return (
    <div className="space-y-6 w-full">
      {paragraphs.map((para, index) => (
        <p key={index} className={className}>
          {para}
        </p>
      ))}
    </div>
  );
}
