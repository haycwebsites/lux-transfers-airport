import { type ReactNode } from 'react';

export function renderMarkedText(input: string): string | ReactNode {
  if (!input) return input;

  const nodes: ReactNode[] = [];
  let hasMarkup = false;
  // Alternation priority: *** > ** > * so bold+italic wins before either alone.
  const re = /\*\*\*([^*]+)\*\*\*|\*\*([^*]+)\*\*|\*([^*]+)\*|__([^_]+)__|\n|[^*_\n]+|[*_]/g;

  let match: RegExpExecArray | null;
  while ((match = re.exec(input)) !== null) {
    const [full, boldItalic, bold, italic, underline] = match;
    if (boldItalic !== undefined) {
      hasMarkup = true;
      nodes.push(<strong key={nodes.length}><em>{renderMarkedText(boldItalic)}</em></strong>);
    } else if (bold !== undefined) {
      hasMarkup = true;
      nodes.push(<strong key={nodes.length}>{renderMarkedText(bold)}</strong>);
    } else if (italic !== undefined) {
      hasMarkup = true;
      nodes.push(<em key={nodes.length}>{renderMarkedText(italic)}</em>);
    } else if (underline !== undefined) {
      hasMarkup = true;
      nodes.push(<u key={nodes.length}>{renderMarkedText(underline)}</u>);
    } else if (full === '\n') {
      hasMarkup = true;
      nodes.push(<br key={nodes.length} />);
    } else {
      nodes.push(full);
    }
  }

  if (!hasMarkup) return input;
  return nodes;
}
