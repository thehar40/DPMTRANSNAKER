import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { markdownHeadingId } from "@/lib/utils";

function textFromChildren(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }
      if (isValidElement<{ children?: ReactNode }>(child)) {
        return textFromChildren(child.props.children);
      }
      return "";
    })
    .join("")
    .trim();
}

export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, children, ...props }) => (
            <h1 {...props} id={markdownHeadingId(textFromChildren(children))}>
              {children}
            </h1>
          ),
          h2: ({ node, children, ...props }) => (
            <h2 {...props} id={markdownHeadingId(textFromChildren(children))}>
              {children}
            </h2>
          ),
          h3: ({ node, children, ...props }) => (
            <h3 {...props} id={markdownHeadingId(textFromChildren(children))}>
              {children}
            </h3>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
