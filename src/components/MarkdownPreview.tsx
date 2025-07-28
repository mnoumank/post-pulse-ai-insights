import React from 'react';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, className = "" }) => {
  // Convert markdown-style formatting to HTML
  const formatContent = (text: string) => {
    // Replace **text** with <strong>text</strong>
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
               // Replace line breaks with <br> tags
               .replace(/\n/g, '<br>')
               // Replace ### with h3 tags
               .replace(/^### (.*$)/gim, '<h3 style="font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem;">$1</h3>')
               // Replace ## with h2 tags  
               .replace(/^## (.*$)/gim, '<h2 style="font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem;">$1</h2>')
               // Replace # with h1 tags
               .replace(/^# (.*$)/gim, '<h1 style="font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem;">$1</h1>');
  };

  return (
    <div 
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: formatContent(content) }}
      style={{
        whiteSpace: 'pre-wrap',
        fontFamily: 'inherit',
        lineHeight: '1.6'
      }}
    />
  );
};