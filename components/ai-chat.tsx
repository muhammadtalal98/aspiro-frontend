"use client"

import { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, User, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface AIChatProps {
  isOpen: boolean
  onClose: () => void
}

export function AIChat({ isOpen, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI career assistant. How can I help you with your learning journey today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sample AI responses for demo
  const aiResponses = [
    "That's a great question! Based on your current roadmap, I'd recommend focusing on the fundamentals first.",
    "I can help you understand that concept better. Would you like me to break it down into smaller steps?",
    "Your progress looks excellent! You're on track to complete your learning goals.",
    "I notice you're working on course #2. Here are some additional resources that might help.",
    "That's an interesting challenge. Let me suggest a different approach you could try.",
    "Great job on completing that course! Ready to move on to the next one?",
    "I can provide more context about that topic. What specific aspect would you like to explore?",
    "Based on your learning style, I think you might benefit from a more hands-on approach."
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Chat Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-[#0e2439]/95 backdrop-blur-xl border-l border-cyan-400/30 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-400/30 bg-[#0e2439]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">AI Assistant</h3>
              <p className="text-cyan-300/70 text-xs">Always here to help</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-cyan-300 hover:text-white hover:bg-cyan-500/20 rounded-full w-8 h-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 h-[calc(100vh-140px)]">
          <div className="p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-in slide-in-from-bottom-2 duration-300`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {message.sender === 'ai' ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-[#0e2439]/60 border border-cyan-400/20 rounded-2xl rounded-tl-md p-3 max-w-[85%]">
                        <p className="text-cyan-100 text-sm">{message.text}</p>
                      </div>
                      <p className="text-cyan-300/50 text-xs mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-end flex-1">
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="flex-1">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl rounded-tr-md p-3 ml-auto">
                          <p className="text-white text-sm">{message.text}</p>
                        </div>
                        <p className="text-cyan-300/50 text-xs mt-1 text-right">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 animate-in slide-in-from-bottom-2 duration-300">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-[#0e2439]/60 border border-cyan-400/20 rounded-2xl rounded-tl-md p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-cyan-400/30 bg-[#0e2439]/80">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your learning path..."
              className="flex-1 bg-[#0e2439]/60 border-cyan-400/30 text-cyan-100 placeholder:text-cyan-300/50 focus:border-cyan-400/60"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

// Chat Button Component
export function AIChatButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-30">
      {/* Glowing background layers */}
      <div className="absolute inset-0 w-14 h-14 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 opacity-60 animate-ping"></div>
      <div className="absolute inset-0 w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-40 animate-pulse"></div>
      
      {/* Main button */}
      <Button
        onClick={onClick}
        className="relative w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 border-2 border-cyan-400/30"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  )
}
