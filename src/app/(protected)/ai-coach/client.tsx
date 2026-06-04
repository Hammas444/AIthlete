"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

export default function AICoachClient({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
      if (!response.body) throw new Error("No response body returned from server");

      const aiMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: aiMessageId, role: "assistant", content: "" },
      ]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunkText = decoder.decode(value, { stream: true });
          
          setMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            if (updated[lastIndex].id === aiMessageId) {
              updated[lastIndex].content += chunkText;
            }
            return updated;
          });
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch response");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">AI Trainer</h1>
        <p className="text-sm text-zinc-400">Ask anything about routines, form, or nutrition.</p>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 space-y-6 pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
        {messages.length === 0 && (
          <div className="text-center text-zinc-500 mt-20">
            No messages yet. Say hello to your AI Trainer!
          </div>
        )}
        
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl ${
                m.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-br-none' 
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-bl-none shadow-sm'
              }`}
            >
              {/* FIX: Render plain text for the user, but parse Markdown for the AI */}
              {m.role === 'user' ? (
                <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                  {m.content}
                </p>
              ) : (
                <div className="text-sm sm:text-base">
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => <p className="mb-4 last:mb-0 leading-relaxed" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-semibold text-zinc-100" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-2" {...props} />,
                      li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                      h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-3 mt-5 text-zinc-100" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2 mt-4 text-zinc-100" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-2 mt-3 text-zinc-100" {...props} />,
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
             <div className="bg-zinc-900 border border-zinc-800 text-zinc-400 p-4 rounded-2xl rounded-bl-none text-sm animate-pulse">
               Coach is thinking...
             </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-xl text-sm text-center">
          Connection Error: {error}
        </div>
      )}

      <form onSubmit={handleManualSubmit} className="flex gap-3">
        <input
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder="e.g., How do I break a bench press plateau?"
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-sm sm:text-base text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm disabled:opacity-50"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isLoading} 
          className="bg-emerald-600 cursor-pointer hover:bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-medium transition-all "
        >
          Send
        </button>
      </form>
    </div>
  );
}