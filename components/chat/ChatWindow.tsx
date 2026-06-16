"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { sendMessageAction } from "@/app/actions/messages"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Send, MessageSquare, ArrowLeft } from "lucide-react"

interface Contact {
  id: string
  name: string
  role: string
  email: string
}

interface ChatWindowProps {
  currentUserId: string
  currentUserRole: string
  contacts: Contact[]
}

export default function ChatWindow({ currentUserId, currentUserRole, contacts }: ChatWindowProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [inputText, setInputText] = useState("")
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const supabase = createClient()

  // Subscribe to real-time messages
  useEffect(() => {
    if (!currentUserId) return

    const channel = supabase
      .channel(`realtime_chat_${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload: any) => {
          const newMsg = payload.new
          // Check if this message belongs to the current user (either sender or receiver)
          if (newMsg.sender_id === currentUserId || newMsg.receiver_id === currentUserId) {
            setMessages((prev) => {
              // Avoid duplicates
              if (prev.some((m) => m.id === newMsg.id)) return prev
              return [...prev, newMsg]
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUserId])

  // Fetch messages when contact changes
  useEffect(() => {
    if (!selectedContact) return

    async function fetchChatHistory() {
      setLoadingMessages(true)
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(
            `and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedContact?.id}),and(sender_id.eq.${selectedContact?.id},receiver_id.eq.${currentUserId})`
          )
          .order("created_at", { ascending: true })

        setMessages(data || [])
      } catch (err) {
        console.error("Error loading chat history:", err)
      } finally {
        setLoadingMessages(false)
      }
    }

    fetchChatHistory()
  }, [selectedContact, currentUserId])

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !selectedContact || sending) return

    const textToSend = inputText
    setInputText("")
    setSending(true)

    const res = await sendMessageAction(currentUserId, selectedContact.id, textToSend)
    setSending(false)

    if (res.error) {
      alert("Failed to send message: " + res.error)
      setInputText(textToSend) // restore input
    }
  }

  return (
    <div className="flex h-[600px] border rounded-2xl bg-white shadow-xl overflow-hidden">
      {/* Contacts sidebar list */}
      <div className={`w-full md:w-80 border-r flex flex-col ${selectedContact ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 bg-slate-50 border-b flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-amber-600" />
          <span className="font-extrabold text-gray-800 text-sm">Inbox Conversations</span>
        </div>
        <div className="flex-1 overflow-y-auto divide-y">
          {contacts.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-xs">No contacts available to message.</div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                  selectedContact?.id === contact.id ? "bg-amber-50/50" : ""
                }`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-slate-200 text-slate-800 text-xs font-bold uppercase">
                    {contact.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <span className="block font-bold text-sm text-gray-800 truncate">{contact.name}</span>
                  <span className="block text-[10px] text-amber-600 font-bold uppercase tracking-wider mt-0.5">
                    {contact.role}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat conversation area */}
      <div className={`flex-1 flex flex-col ${!selectedContact ? "hidden md:flex items-center justify-center bg-gray-50 text-gray-400" : "flex"}`}>
        {selectedContact ? (
          <>
            {/* Active Contact Header */}
            <div className="p-4 bg-slate-50 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-gray-600"
                  onClick={() => setSelectedContact(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-amber-100 text-amber-800 text-xs font-bold uppercase">
                    {selectedContact.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="block font-bold text-sm text-gray-900">{selectedContact.name}</span>
                  <span className="block text-[10px] text-gray-500">{selectedContact.email}</span>
                </div>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-4">
              {loadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-400 text-xs pt-20">
                  No message logs. Send a greeting to begin!
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.sender_id === currentUserId
                  return (
                    <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] p-4 rounded-2xl shadow-sm text-sm ${
                          isOwn
                            ? "bg-amber-600 text-white rounded-tr-none"
                            : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <span
                          className={`block text-[9px] text-right mt-1.5 font-mono ${
                            isOwn ? "text-amber-100" : "text-gray-400"
                          }`}
                        >
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t bg-white">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input
                  required
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="rounded-xl border-gray-200"
                />
                <Button type="submit" disabled={sending || !inputText.trim()} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="text-center space-y-3">
            <MessageSquare className="h-12 w-12 text-slate-300 mx-auto" />
            <span className="block font-bold text-gray-600 text-base">Select a contact from the roster</span>
            <span className="block text-xs text-gray-400">to load secure chat channels.</span>
          </div>
        )}
      </div>
    </div>
  )
}
