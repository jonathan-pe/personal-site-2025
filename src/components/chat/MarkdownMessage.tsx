import type { ReactNode } from 'react'
import type { Components } from 'react-markdown'
import { memo, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface MarkdownMessageProps {
  content: string
  className?: string
}

export const MarkdownMessage = memo(({ content, className }: MarkdownMessageProps) => {
  const markdownComponents = useMemo<Components>(
    () => ({
      // Customize paragraph spacing
      p: ({ children }: { children?: ReactNode }) => <p className='mb-3 last:mb-0 leading-relaxed'>{children}</p>,

      // Style strong/bold text
      strong: ({ children }: { children?: ReactNode }) => (
        <strong className='font-semibold text-foreground'>{children}</strong>
      ),

      // Style emphasis/italic text
      em: ({ children }: { children?: ReactNode }) => <em className='italic text-muted-foreground'>{children}</em>,

      // Style code blocks
      code: ({ children, className }: { children?: ReactNode; className?: string }) => {
        const isInline = !className
        if (isInline) {
          return (
            <code className='bg-muted/60 px-1.5 py-0.5 rounded text-xs font-mono text-foreground border'>
              {children}
            </code>
          )
        }
        return (
          <code className='block bg-muted/60 p-3 rounded-md text-xs font-mono text-foreground whitespace-pre-wrap border my-2'>
            {children}
          </code>
        )
      },

      // Style pre blocks (code blocks)
      pre: ({ children }: { children?: ReactNode }) => (
        <pre className='bg-muted/60 p-3 rounded-md text-xs font-mono text-foreground whitespace-pre-wrap overflow-x-auto border my-2'>
          {children}
        </pre>
      ),

      // Style lists with better spacing and proper alignment
      ul: ({ children }: { children?: ReactNode }) => (
        <ul className='list-disc list-outside mb-3 space-y-1.5 ml-4'>{children}</ul>
      ),
      ol: ({ children }: { children?: ReactNode }) => (
        <ol className='list-decimal list-outside mb-3 space-y-1.5 ml-4'>{children}</ol>
      ),
      li: ({ children }: { children?: ReactNode }) => <li className='text-sm leading-relaxed pl-1'>{children}</li>,

      // Style links
      a: ({ href, children }: { href?: string; children?: ReactNode }) => (
        <a
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          className='text-primary hover:text-primary/80 underline underline-offset-2 transition-colors'
        >
          {children}
        </a>
      ),

      // Style headers (appropriately sized for chat)
      h1: ({ children }: { children?: ReactNode }) => (
        <h1 className='text-base font-semibold mb-2 mt-3 first:mt-0 text-foreground'>{children}</h1>
      ),
      h2: ({ children }: { children?: ReactNode }) => (
        <h2 className='text-sm font-semibold mb-2 mt-3 first:mt-0 text-foreground'>{children}</h2>
      ),
      h3: ({ children }: { children?: ReactNode }) => (
        <h3 className='text-sm font-medium mb-1.5 mt-2 first:mt-0 text-foreground'>{children}</h3>
      ),

      // Style blockquotes
      blockquote: ({ children }: { children?: ReactNode }) => (
        <blockquote className='border-l-2 border-primary/30 pl-3 italic text-muted-foreground my-2 bg-muted/20 py-2 rounded-r'>
          {children}
        </blockquote>
      ),

      // Style horizontal rules
      hr: () => <hr className='border-t border-muted-foreground/20 my-4' />,

      // Style tables (in case they're used)
      table: ({ children }: { children?: ReactNode }) => (
        <div className='overflow-x-auto my-2'>
          <table className='min-w-full text-xs border border-muted'>{children}</table>
        </div>
      ),
      th: ({ children }: { children?: ReactNode }) => (
        <th className='border border-muted bg-muted/40 px-2 py-1 text-left font-medium'>{children}</th>
      ),
      td: ({ children }: { children?: ReactNode }) => <td className='border border-muted px-2 py-1'>{children}</td>,
    }),
    [],
  )

  return (
    <div className={cn('text-sm leading-relaxed', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  )
})

MarkdownMessage.displayName = 'MarkdownMessage'
