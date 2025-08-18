import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { MarkdownMessage } from '@/components/chat/MarkdownMessage'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/useMobile'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface ChatBotProps {
  className?: string
}

export const ChatBot = ({ className }: ChatBotProps) => {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hi! I'm here to help you learn about Jonathan's professional experience, projects, and technical skills. What would you like to know?",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        // Try to parse error response as JSON
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to get response')
        } else {
          throw new Error(`Server error: ${response.status}`)
        }
      }

      // Check if this is a streaming response or JSON response
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        // Handle JSON response (shouldn't happen for successful requests, but just in case)
        const data = await response.json()
        throw new Error(data.error || 'Unexpected JSON response')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response stream')

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
      }

      setMessages((prev) => [...prev, assistantMessage])

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantMessage.id ? { ...msg, content: msg.content + chunk } : msg))
        )
      }
    } catch (err) {
      setError('Sorry, I encountered an error. Please try again.')
      console.error('Chat error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat Window Container */}
      <div className={cn('fixed z-50', isMobile ? 'inset-0' : 'bottom-20 right-4', className)}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={cn(isMobile ? 'h-full' : '')}
            >
              <Card
                className={cn(
                  'flex flex-col bg-background border shadow-lg',
                  isMobile ? 'w-full h-full rounded-none' : 'w-[28rem] h-[36rem] rounded-lg'
                )}
              >
                {/* Header */}
                <div className={cn('flex items-center justify-between border-b', isMobile ? 'p-4 pt-6' : 'p-4')}>
                  <div className='flex items-center space-x-2'>
                    <Bot className={cn('text-primary', isMobile ? 'h-6 w-6' : 'h-5 w-5')} />
                    <h3 className={cn('font-semibold', isMobile ? 'text-base' : 'text-sm')}>Ask about Jonathan</h3>
                  </div>
                  <Button
                    variant='ghost'
                    size={isMobile ? 'default' : 'sm'}
                    onClick={() => setIsOpen(false)}
                    className={cn('p-0 hover:bg-muted', isMobile ? 'h-10 w-10' : 'h-8 w-8')}
                  >
                    <X className={cn(isMobile ? 'h-5 w-5' : 'h-4 w-4')} />
                  </Button>
                </div>

                {/* Messages */}
                <div className={cn('flex-1 overflow-y-auto space-y-3', isMobile ? 'p-4 pb-2' : 'p-4')}>
                  {messages.map((message: ChatMessage) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        'flex items-start',
                        message.role === 'user' ? 'flex-row-reverse space-x-reverse space-x-2' : 'space-x-2'
                      )}
                    >
                      <div
                        className={cn(
                          'flex-shrink-0 rounded-full flex items-center justify-center',
                          isMobile ? 'w-8 h-8' : 'w-6 h-6',
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
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
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {message.role === 'assistant' ? <MarkdownMessage content={message.content} /> : message.content}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className='flex items-start space-x-2'
                    >
                      <div
                        className={cn(
                          'flex-shrink-0 rounded-full bg-muted text-muted-foreground flex items-center justify-center',
                          isMobile ? 'w-8 h-8' : 'w-6 h-6'
                        )}
                      >
                        <Bot className={cn(isMobile ? 'h-4 w-4' : 'h-3 w-3')} />
                      </div>
                      <div
                        className={cn(
                          'bg-muted rounded-lg',
                          isMobile ? 'p-3 text-base max-w-[80%]' : 'p-3 text-sm max-w-[85%]'
                        )}
                      >
                        <div className='flex space-x-1'>
                          <div
                            className={cn(
                              'bg-muted-foreground rounded-full animate-bounce',
                              isMobile ? 'w-3 h-3' : 'w-2 h-2'
                            )}
                          />
                          <div
                            className={cn(
                              'bg-muted-foreground rounded-full animate-bounce',
                              isMobile ? 'w-3 h-3' : 'w-2 h-2'
                            )}
                            style={{ animationDelay: '0.1s' }}
                          />
                          <div
                            className={cn(
                              'bg-muted-foreground rounded-full animate-bounce',
                              isMobile ? 'w-3 h-3' : 'w-2 h-2'
                            )}
                            style={{ animationDelay: '0.2s' }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className='flex items-start space-x-2'
                    >
                      <div
                        className={cn(
                          'flex-shrink-0 rounded-full bg-destructive/10 text-destructive flex items-center justify-center',
                          isMobile ? 'w-8 h-8' : 'w-6 h-6'
                        )}
                      >
                        <Bot className={cn(isMobile ? 'h-4 w-4' : 'h-3 w-3')} />
                      </div>
                      <div
                        className={cn(
                          'bg-destructive/10 text-destructive rounded-lg',
                          isMobile ? 'p-3 text-base max-w-[80%]' : 'p-3 text-sm max-w-[85%]'
                        )}
                      >
                        Sorry, I encountered an error. Please try again.
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className={cn('border-t', isMobile ? 'p-4 pb-6' : 'p-4')}>
                  <div className='flex space-x-2'>
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder='Ask about my experience...'
                      disabled={isLoading}
                      className={cn('flex-1', isMobile ? 'text-base h-12' : 'text-sm')}
                      autoComplete='off'
                    />
                    <Button
                      type='submit'
                      disabled={isLoading || !input.trim()}
                      size={isMobile ? 'default' : 'sm'}
                      className={cn(isMobile ? 'px-4 h-12' : 'px-3')}
                    >
                      <Send className={cn(isMobile ? 'h-5 w-5' : 'h-4 w-4')} />
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Toggle Button - Always fixed in bottom-right */}
      {!isMobile && (
        <motion.div className='fixed bottom-4 right-4 z-50' whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={() => setIsOpen(!isOpen)} size='lg' className='rounded-full w-14 h-14 shadow-lg'>
            <MessageCircle className='h-6 w-6' />
          </Button>
        </motion.div>
      )}

      {/* Mobile Toggle Button */}
      {isMobile && !isOpen && (
        <motion.div className='fixed bottom-4 right-4 z-50' whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={() => setIsOpen(!isOpen)} size='lg' className='rounded-full w-16 h-16 shadow-lg'>
            <MessageCircle className='h-7 w-7' />
          </Button>
        </motion.div>
      )}
    </>
  )
}
