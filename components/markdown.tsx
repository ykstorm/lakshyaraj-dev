import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Renders project bodies. Before this, the raw markdown source was printed as
// pre-wrapped text, so readers saw literal `##` and `**`. react-markdown builds
// React elements and escapes raw HTML by default, so HTML in a content file
// shows as text and is never injected into the page.
export function Markdown({ source }: { source: string }) {
  return (
    <div className="md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // The page renders the title as the only <h1>.
          h1: ({ children }) => <h2>{children}</h2>,
          a: ({ href = '', children }) =>
            /^https?:\/\//.test(href) ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ) : (
              <a href={href}>{children}</a>
            ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
