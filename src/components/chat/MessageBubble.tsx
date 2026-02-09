import { memo } from 'react'
import { motion } from 'framer-motion'
import { Bot, User } from 'lucide-react'

import { MarkdownMessage } from '@/components/chat/MarkdownMessage'
import { cn } from '@/lib/utils'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface MessageBubbleProps {
  message: ChatMessage
  isMobile: boolean
}

export const MessageBubble = memo(({ message, isMobile }: MessageBubbleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-start',
        message.role === 'user' ? 'flex-row-reverse space-x-reverse space-x-2' : 'space-x-2',
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 rounded-full flex items-center justify-center',
          isMobile ? 'w-8 h-8' : 'w-6 h-6',
          message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
        )}
      >
        {message.role === 'user' ? (
          <User className={cn(isMobile ? 'h-4 w-4' : 'h-3 w-3')} />
        ) : (
          <Bot className={cn(isMobile ? 'h-4 w-4' : 'h-3 w-3')} />
        )}
      </div>
      <div
        className={cn(
          'rounded-lg break-words',
          isMobile ? 'p-3 text-base max-w-[80%]' : 'p-3 text-sm max-w-[85%]',
          message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
        )}
      >
        {message.role === 'assistant' ? <MarkdownMessage content={message.content} /> : message.content}
      </div>
    </motion.div>
  )
})

MessageBubble.displayName = 'MessageBubble'
