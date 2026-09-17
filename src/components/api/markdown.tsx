import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// OpenAPI description fields are CommonMark. Render them in the site's voice:
// brand links, mono inline code, tight lists. Kept small on purpose.
const base: Components = {
  a({ node, ...props }) {
    return (
      <a
        {...props}
        target="_blank"
        rel="noreferrer"
        className="text-brand underline underline-offset-2 transition-opacity hover:opacity-80"
      />
    );
  },
  code({ node, ...props }) {
    return (
      <code
        {...props}
        className="rounded bg-panel px-1 py-0.5 font-mono text-[0.88em] text-foreground"
      />
    );
  },
  strong({ node, ...props }) {
    return <strong {...props} className="font-semibold text-foreground" />;
  },
  em({ node, ...props }) {
    return <em {...props} className="italic" />;
  },
  ul({ node, ...props }) {
    return <ul {...props} className="list-disc space-y-1 pl-5" />;
  },
  ol({ node, ...props }) {
    return <ol {...props} className="list-decimal space-y-1 pl-5" />;
  },
  li({ node, ...props }) {
    return <li {...props} className="leading-relaxed" />;
  },
  h1({ node, ...props }) {
    return <h3 {...props} className="text-base font-semibold text-foreground" />;
  },
  h2({ node, ...props }) {
    return <h4 {...props} className="text-sm font-semibold text-foreground" />;
  },
  h3({ node, ...props }) {
    return <h5 {...props} className="text-sm font-semibold text-foreground" />;
  },
  blockquote({ node, ...props }) {
    return (
      <blockquote {...props} className="border-l-2 border-hairline pl-3 text-muted-foreground" />
    );
  },
  pre({ node, ...props }) {
    return (
      <pre
        {...props}
        className="overflow-x-auto rounded-md border border-hairline bg-panel p-3 font-mono text-[12.5px]"
      />
    );
  },
};

/**
 * Render a markdown string. `inline` collapses the top-level paragraph to a span
 * so it can sit inside a description line without extra block margins.
 */
export function Markdown({
  children,
  className = "",
  inline = false,
}: {
  children?: string;
  className?: string;
  inline?: boolean;
}) {
  const text = children?.trim();
  if (!text) return null;

  if (inline) {
    return (
      <span className={className}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            ...base,
            p({ node, ...props }) {
              return <span {...props} />;
            },
          }}
        >
          {text}
        </ReactMarkdown>
      </span>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          ...base,
          p({ node, ...props }) {
            return <p {...props} className="leading-relaxed" />;
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
