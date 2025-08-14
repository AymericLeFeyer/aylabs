import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const renderMarkdownContent = (content: string): React.ReactNode[] => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeBlockLanguage = '';
  let listItems: string[] = [];
  let inList = false;

  const processInlineElements = (text: string, key: number): React.ReactNode => {
    // Parse inline elements in order: links, bold, code
    const elements: React.ReactNode[] = [];
    let remainingText = text;
    let elementKey = 0;

    while (remainingText.length > 0) {
      // Check for links first [text](url)
      const linkMatch = remainingText.match(/^(.*?)\[([^\]]+)\]\(([^)]+)\)(.*)/);
      if (linkMatch) {
        const [, before, linkText, url, after] = linkMatch;
        
        // Add text before link
        if (before) {
          elements.push(...parseSimpleInline(before, elementKey++));
        }
        
        // Add link
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

      // Check for bold text **text**
      const boldMatch = remainingText.match(/^(.*?)\*\*(.*?)\*\*(.*)/);
      if (boldMatch) {
        const [, before, boldText, after] = boldMatch;
        
        // Add text before bold
        if (before) {
          elements.push(...parseSimpleInline(before, elementKey++));
        }
        
        // Add bold text
        elements.push(<strong key={elementKey++}>{boldText}</strong>);
        
        remainingText = after;
        continue;
      }

      // Check for inline code `code`
      const codeMatch = remainingText.match(/^(.*?)`([^`]+)`(.*)/);
      if (codeMatch) {
        const [, before, codeText, after] = codeMatch;
        
        // Add text before code
        if (before) {
          elements.push(before);
          elementKey++;
        }
        
        // Add code
        elements.push(
          <code key={elementKey++} className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
            {codeText}
          </code>
        );
        
        remainingText = after;
        continue;
      }

      // No more special elements, add remaining text
      if (remainingText) {
        elements.push(remainingText);
      }
      break;
    }

    return <span key={key}>{elements}</span>;
  };

  const parseSimpleInline = (text: string, startKey: number): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];
    let remainingText = text;
    let elementKey = startKey;

    while (remainingText.length > 0) {
      // Check for bold text **text**
      const boldMatch = remainingText.match(/^(.*?)\*\*(.*?)\*\*(.*)/);
      if (boldMatch) {
        const [, before, boldText, after] = boldMatch;
        
        if (before) {
          elements.push(<span key={elementKey++}>{before}</span>);
        }
        
        elements.push(<strong key={elementKey++}>{boldText}</strong>);
        remainingText = after;
        continue;
      }

      // Check for inline code `code`
      const codeMatch = remainingText.match(/^(.*?)`([^`]+)`(.*)/);
      if (codeMatch) {
        const [, before, codeText, after] = codeMatch;
        
        if (before) {
          elements.push(<span key={elementKey++}>{before}</span>);
        }
        
        elements.push(
          <code key={elementKey++} className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
            {codeText}
          </code>
        );
        
        remainingText = after;
        continue;
      }

      // No more special elements
      if (remainingText) {
        elements.push(<span key={elementKey++}>{remainingText}</span>);
      }
      break;
    }

    return elements;
  };

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside mb-4 space-y-2">
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
            <code className={codeBlockLanguage ? `language-${codeBlockLanguage}` : ''}>
              {codeBlockContent.join('\n')}
            </code>
          </pre>
        </div>
      );
      codeBlockContent = [];
      inCodeBlock = false;
      codeBlockLanguage = '';
    }
  };

  lines.forEach((line, index) => {
    // Handle code blocks
    if (line.startsWith('```')) {
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

    // Handle images
    if (line.includes('![') && line.includes('](')) {
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
    
    // Handle headers
    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={index} className="text-xl font-bold text-[#141414] mt-8 mb-4">
          {processInlineElements(line.replace('### ', ''), index)}
        </h3>
      );
      return;
    }
    
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={index} className="text-2xl font-bold text-[#141414] mt-8 mb-4">
          {processInlineElements(line.replace('## ', ''), index)}
        </h2>
      );
      return;
    }
    
    if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={index} className="text-3xl font-bold text-[#141414] mt-8 mb-6">
          {processInlineElements(line.replace('# ', ''), index)}
        </h1>
      );
      return;
    }
    
    // Handle bullet points
    if (line.startsWith('- ')) {
      if (!inList) {
        inList = true;
      }
      listItems.push(line.replace('- ', ''));
      return;
    }
    
    // Handle regular paragraphs
    if (line.trim()) {
      flushList();
      elements.push(
        <p key={index} className="mb-4 leading-relaxed">
          {processInlineElements(line, index)}
        </p>
      );
    } else if (line.trim() === '') {
      flushList();
    }
  });

  // Flush any remaining content
  flushList();
  flushCodeBlock();

  return elements;
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return <div className="prose max-w-none">{renderMarkdownContent(content)}</div>;
};