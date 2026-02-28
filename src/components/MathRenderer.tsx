import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function MathRenderer({ text }: { text: string }) {
  if (!text) return null;

  const parts = text.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          return <BlockMath key={i} math={part.slice(2, -2)} />;
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          return <InlineMath key={i} math={part.slice(1, -1)} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}