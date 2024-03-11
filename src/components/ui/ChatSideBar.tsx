"use client"
import { DrizzleChat } from '@/lib/db/schema'
import Link from 'next/link'
import React, { useState } from 'react'

import { MessageCircle, PlusCircle } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'
import axios from 'axios'

type Props = {
    chats: DrizzleChat[],
    chatId: number
}

const ChatSideBar = ({ chats, chatId }: Props) => {
  const [loading,setLoading]=useState(false);
  const handleSubsription=async ()=>{
    try {
      setLoading(true);
      const response=await axios.get('/api/stripe');
      window.location.href=response.data.url
      
    } catch (error) {
      console.error(error);
    }
    finally{
      setLoading(false);
    }
  }
  return (
    <div className="w-full h-screen p-4 text-gray-900 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
      <Link href="/">
        <Button className="w-full border-dashed border-white border">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link>
      <div className="flex flex-col gap-2 mt-4">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div className={cn('rounded-lg p-3 text-white flex items-center', {
              "bg-blue-600": chat.id === chatId,
              "bg-indigo-600 hover:bg-indigo-700": chat.id !== chatId
            })}>
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="absolute bottom-4 left-4">
        <div className='flex items-center gap-2 text-sm text-white flex-wrap'>
          <Link href='/'>Home</Link>
          <Link href='/'>Source</Link>
        </div>
      </div>
    </div>
  )
}
export default ChatSideBar;