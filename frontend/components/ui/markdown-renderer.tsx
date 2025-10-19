import React from 'react'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const parseMarkdown = (text: string) => {
    // Split content into lines for processing
    const lines = text.split('\n')
    const elements: React.ReactNode[] = []
    let listItems: string[] = []
    let inCodeBlock = false
    let codeBlockContent: string[] = []

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 my-2 ml-4">
            {listItems.map((item, index) => (
              <li key={index} className="text-sm">
                {parseInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        )
        listItems = []
      }
    }

    const flushCodeBlock = () => {
      if (codeBlockContent.length > 0) {
        elements.push(
          <pre key={`code-${elements.length}`} className="bg-muted p-3 rounded-lg overflow-x-auto my-2">
            <code className="text-sm font-mono">
              {codeBlockContent.join('\n')}
            </code>
          </pre>
        )
        codeBlockContent = []
        inCodeBlock = false
      }
    }

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()

      // Handle code blocks
      if (trimmedLine.startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock()
        } else {
          inCodeBlock = true
        }
        return
      }

      if (inCodeBlock) {
        codeBlockContent.push(line)
        return
      }

      // Handle headers
      if (trimmedLine.startsWith('#')) {
        flushList()
        const level = trimmedLine.match(/^#+/)?.[0].length || 1
        const text = trimmedLine.replace(/^#+\s*/, '')
        const HeaderTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements
        elements.push(
          <HeaderTag key={index} className={`font-bold my-2 ${
            level === 1 ? 'text-lg' : 
            level === 2 ? 'text-base' : 
            'text-sm'
          }`}>
            {parseInlineMarkdown(text)}
          </HeaderTag>
        )
        return
      }

      // Handle list items
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        flushCodeBlock()
        listItems.push(trimmedLine.substring(2))
        return
      }

      // Handle numbered lists
      if (/^\d+\.\s/.test(trimmedLine)) {
        flushList()
        const text = trimmedLine.replace(/^\d+\.\s/, '')
        elements.push(
          <div key={index} className="flex items-start my-1">
            <span className="text-sm font-medium mr-2 min-w-[20px]">
              {trimmedLine.match(/^\d+/)?.[0]}.
            </span>
            <span className="text-sm flex-1">
              {parseInlineMarkdown(text)}
            </span>
          </div>
        )
        return
      }

      // Handle regular paragraphs
      if (trimmedLine) {
        flushList()
        flushCodeBlock()
        elements.push(
          <p key={index} className="text-sm leading-relaxed my-2">
            {parseInlineMarkdown(trimmedLine)}
          </p>
        )
      } else {
        // Empty line - flush any pending elements
        flushList()
        flushCodeBlock()
        elements.push(<br key={index} />)
      }
    })

    // Flush any remaining elements
    flushList()
    flushCodeBlock()

    return elements
  }

  const parseInlineMarkdown = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = []
    let currentIndex = 0

    // Handle bold text (**text** or __text__)
    const boldRegex = /(\*\*|__)(.*?)\1/g
    let match
    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        parts.push(text.slice(currentIndex, match.index))
      }
      
      // Add the bold text
      parts.push(
        <strong key={match.index} className="font-semibold">
          {match[2]}
        </strong>
      )
      
      currentIndex = match.index + match[0].length
    }

    // Handle italic text (*text* or _text_)
    const italicRegex = /(\*|_)(.*?)\1/g
    currentIndex = 0
    const newParts: React.ReactNode[] = []
    
    parts.forEach((part, partIndex) => {
      if (typeof part === 'string') {
        let partCurrentIndex = 0
        while ((match = italicRegex.exec(part)) !== null) {
          // Add text before the match
          if (match.index > partCurrentIndex) {
            newParts.push(part.slice(partCurrentIndex, match.index))
          }
          
          // Add the italic text
          newParts.push(
            <em key={`${partIndex}-${match.index}`} className="italic">
              {match[2]}
            </em>
          )
          
          partCurrentIndex = match.index + match[0].length
        }
        
        // Add remaining text
        if (partCurrentIndex < part.length) {
          newParts.push(part.slice(partCurrentIndex))
        }
      } else {
        newParts.push(part)
      }
    })

    // Handle inline code (`code`)
    const codeRegex = /`([^`]+)`/g
    currentIndex = 0
    const finalParts: React.ReactNode[] = []
    
    newParts.forEach((part, partIndex) => {
      if (typeof part === 'string') {
        let partCurrentIndex = 0
        while ((match = codeRegex.exec(part)) !== null) {
          // Add text before the match
          if (match.index > partCurrentIndex) {
            finalParts.push(part.slice(partCurrentIndex, match.index))
          }
          
          // Add the code
          finalParts.push(
            <code key={`${partIndex}-${match.index}`} className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
              {match[1]}
            </code>
          )
          
          partCurrentIndex = match.index + match[0].length
        }
        
        // Add remaining text
        if (partCurrentIndex < part.length) {
          finalParts.push(part.slice(partCurrentIndex))
        }
      } else {
        finalParts.push(part)
      }
    })

    return finalParts.length > 0 ? finalParts : text
  }

  return (
    <div className={`markdown-content ${className}`}>
      {parseMarkdown(content)}
    </div>
  )
}
