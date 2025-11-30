import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { chatWithGemini, searchRegulations } from "../services/geminiService";
import { XMarkIcon, PaperAirplaneIcon, GlobeAltIcon, SparklesIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AIChatDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "您好！我是您的 AI 审核助手。我可以帮您分析风险、起草意见，或查询最新的政策法规。",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"chat" | "search">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      if (mode === "search") {
        // Use Gemini Flash with Grounding
        const result = await searchRegulations(userMsg.text);
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: result.text,
          groundingSources: result.sources
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        // Use Gemini Pro for Chat
        // Convert internal history format to API format
        const history = messages.filter(m => m.id !== 'welcome').map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));
        
        const responseText = await chatWithGemini(history, userMsg.text);
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: responseText,
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "model", text: "处理您的请求时出错。", isError: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 flex flex-col border-l border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-brand-600 text-white">
        <div className="flex items-center space-x-2">
            <SparklesIcon className="w-5 h-5" />
            <h2 className="font-semibold text-lg">AI 智能助手</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-brand-700 rounded-full">
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Mode Switcher */}
      <div className="p-3 bg-gray-50 border-b border-gray-200 flex space-x-2">
        <button
          onClick={() => setMode("chat")}
          className={`flex-1 py-1.5 px-3 rounded text-sm font-medium flex items-center justify-center space-x-1 ${
            mode === "chat" ? "bg-white text-brand-600 shadow-sm ring-1 ring-gray-200" : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <ChatBubbleLeftRightIcon className="w-4 h-4" />
          <span>对话 (Gemini Pro)</span>
        </button>
        <button
          onClick={() => setMode("search")}
          className={`flex-1 py-1.5 px-3 rounded text-sm font-medium flex items-center justify-center space-x-1 ${
            mode === "search" ? "bg-white text-brand-600 shadow-sm ring-1 ring-gray-200" : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <GlobeAltIcon className="w-4 h-4" />
          <span>法规检索</span>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 text-sm shadow-sm ${
                msg.role === "user"
                  ? "bg-brand-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
              } ${msg.isError ? "bg-red-50 text-red-600 border-red-200" : ""}`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              {msg.groundingSources && msg.groundingSources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 mb-1">来源:</p>
                    <ul className="space-y-1">
                        {msg.groundingSources.map((source, idx) => (
                            <li key={idx}>
                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center truncate">
                                    <GlobeAltIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                                    {source.title || source.uri}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white p-3 rounded-lg rounded-bl-none shadow-sm border border-gray-200">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={mode === 'chat' ? "询问风险点或起草意见..." : "搜索法规..."}
            className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none text-sm"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 p-1.5 bg-brand-600 text-white rounded-md hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
            Powered by Gemini {mode === 'chat' ? '3 Pro' : '2.5 Flash'}
        </p>
      </div>
    </div>
  );
};

export default AIChatDrawer;