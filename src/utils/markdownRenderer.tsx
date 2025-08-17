import React from "react";

interface MarkdownRendererProps {
  content: string;
}

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export const renderMarkdownContent = (
  content: string,
  headings: HeadingItem[]
): React.ReactNode[] => {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeBlockLanguage = "";
  let listItems: string[] = [];
  let inList = false;

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const processInlineElements = (
    text: string,
    key: number
  ): React.ReactNode => {
    const elements: React.ReactNode[] = [];
    let remainingText = text;
    let elementKey = 0;

    while (remainingText.length > 0) {
      const linkMatch = remainingText.match(
        /^(.*?)\[([^\]]+)\]\(([^)]+)\)(.*)/
      );
      if (linkMatch) {
        const [, before, linkText, url, after] = linkMatch;
        if (before) elements.push(before);
        elements.push(
          <a
            key={elementKey++}
            href={url}
            className="text-[#398FBA] hover:text-[#2a6d94] underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkText}
          </a>
        );
        remainingText = after;
        continue;
      }

      const boldMatch = remainingText.match(/^(.*?)\*\*(.*?)\*\*(.*)/);
      if (boldMatch) {
        const [, before, boldText, after] = boldMatch;
        if (before) elements.push(before);
        elements.push(<strong key={elementKey++}>{boldText}</strong>);
        remainingText = after;
        continue;
      }

      const italicMatch = remainingText.match(/^(.*?)\*(.*?)\*(.*)/);
      if (italicMatch) {
        const [, before, italicText, after] = italicMatch;
        if (before) elements.push(before);
        elements.push(<em key={elementKey++}>{italicText}</em>);
        remainingText = after;
        continue;
      }

      const codeMatch = remainingText.match(/^(.*?)`([^`]+)`(.*)/);
      if (codeMatch) {
        const [, before, codeText, after] = codeMatch;
        if (before) elements.push(before);
        elements.push(
          <code
            key={elementKey++}
            className="bg-gray-100 px-2 py-1 rounded text-sm font-mono"
          >
            {codeText}
          </code>
        );
        remainingText = after;
        continue;
      }

      if (remainingText) {
        elements.push(remainingText);
      }
      break;
    }

    return <span key={key}>{elements}</span>;
  };

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul
          key={`list-${elements.length}`}
          className="list-disc list-inside mb-4 space-y-2"
        >
          {listItems.map((item, index) => (
            <li key={index}>{processInlineElements(item, index)}</li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const flushCodeBlock = () => {
    if (inCodeBlock && codeBlockContent.length > 0) {
      elements.push(
        <div key={`code-${elements.length}`} className="my-6">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code
              className={
                codeBlockLanguage ? `language-${codeBlockLanguage}` : ""
              }
            >
              {codeBlockContent.join("\n")}
            </code>
          </pre>
        </div>
      );
      codeBlockContent = [];
      inCodeBlock = false;
      codeBlockLanguage = "";
    }
  };

  lines.forEach((line, index) => {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        flushCodeBlock();
      } else {
        flushList();
        inCodeBlock = true;
        codeBlockLanguage = line.slice(3).trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      return;
    }

    if (line.includes("![") && line.includes("](")) {
      flushList();
      const match = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (match) {
        const [, alt, src] = match;
        elements.push(
          <div key={index} className="my-6">
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto rounded-lg shadow-md mx-auto"
            />
          </div>
        );
      }
      return;
    }

    if (line.startsWith("### ")) {
      flushList();
      const text = line.replace("### ", "");
      const id = slugify(text);
      headings.push({ id, text, level: 3 });
      elements.push(
        <h3
          id={id}
          key={index}
          className="text-xl font-bold text-[#141414] mt-8 mb-4"
        >
          {processInlineElements(text, index)}
        </h3>
      );
      return;
    }

    if (line.startsWith("## ")) {
      flushList();
      const text = line.replace("## ", "");
      const id = slugify(text);
      headings.push({ id, text, level: 2 });
      elements.push(
        <h2
          id={id}
          key={index}
          className="text-2xl font-bold text-[#141414] mt-8 mb-4"
        >
          {processInlineElements(text, index)}
        </h2>
      );
      return;
    }

    if (line.startsWith("# ")) {
      flushList();
      const text = line.replace("# ", "");
      const id = slugify(text);
      headings.push({ id, text, level: 1 });
      elements.push(
        <h1
          id={id}
          key={index}
          className="text-3xl font-bold text-[#141414] mt-8 mb-6"
        >
          {processInlineElements(text, index)}
        </h1>
      );
      return;
    }

    if (line.startsWith("- ")) {
      if (!inList) {
        inList = true;
      }
      listItems.push(line.replace("- ", ""));
      return;
    }

    if (line.trim()) {
      flushList();
      elements.push(
        <p key={index} className="mb-4 leading-relaxed">
          {processInlineElements(line, index)}
        </p>
      );
    } else if (line.trim() === "") {
      flushList();
    }
  });

  flushList();
  flushCodeBlock();

  return elements;
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
}) => {
  const headings: HeadingItem[] = [];
  const body = renderMarkdownContent(content, headings);

  return (
    <div className="prose max-w-none">
      {headings.length > 0 && (
        <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Sommaire</h2>
          <ul className="space-y-1">
            {headings.map((h, i) => (
              <li key={i} className={`ml-${(h.level - 1) * 4}`}>
                <a
                  href={`#${h.id}`}
                  className="text-[#398FBA] hover:text-[#2a6d94] underline"
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {body}
    </div>
  );
};
