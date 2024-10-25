'use client'

import { Companion } from "@prisma/client"
import ChatMessage from "./chat-message";
import { ElementRef, useEffect, useRef, useState } from "react";

interface ChatMessagesProps {
    companion: Companion;
    isLoading: boolean;
    messages: ChatMessagesProps[];
}

const ChatMessages = ( { companion, isLoading, messages = [] }: ChatMessagesProps) => {
  const scrollRef = useRef<ElementRef<'div'>>(null);
  const [fakeLoading, setFakeLoading] = useState(messages.length === 0 ? true : false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFakeLoading(false);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className='flex-1 overflow-y-auto pr-4'>
      <ChatMessage
        isLoading={fakeLoading}
        src={companion.src}
        role="system"
        content={`Hello, I am ${companion.name}, ${companion.description}`}
      />
      {messages.map((message: any) => (
        <ChatMessage
          key={message.content}
          role={message.role}
          content={message.content}
          src={companion.src}
        />
      ))}
      {isLoading && (
        <ChatMessage
          isLoading
          src={companion.src}
          role="system"
        />
      )}
      <div ref={scrollRef} />
    </div>
  )
}

export default ChatMessages
