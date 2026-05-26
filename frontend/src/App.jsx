import { useState } from 'react';
import {
  Search, PenLine, LayoutGrid, Image as ImageIcon,
  FileText, Folder, Mic, ArrowUp, PanelLeft, Settings,
  Globe, Zap
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function App() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useWeb, setUseWeb] = useState(true);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const newMsg = { role: "user", content: prompt, sources: [] };
    setMessages((prev) => [...prev, newMsg]);
    setPrompt("");
    setIsLoading(true);

    // setTimeout(() => {
    //   setMessages((prev) => [
    //     ...prev,
    //     { 
    //       role: "ai", 
    //       content: "Hello! This is a **faked** response to prove your frontend UI is completely working and the white screen is gone! 🎉", 
    //       sources: [{ url: "https://www.success.com" }] 
    //     }
    //   ]);
    //   setIsLoading(false);
    // }, 1500);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: newMsg.content, useWeb: useWeb, history: messages }) // Send entire chat history for better context (optional),
      });

      const data = await response.json();

      // Safety check: if backend sends an error instead of an answer
      if (data.error) {
        setMessages((prev) => [...prev, { role: "ai", content: `Error: ${data.error}`, sources: [] }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: data.answer || "No response generated.", sources: data.sources || [] }
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { role: "ai", content: "Oops! The server is sleeping.", sources: [] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => setMessages([]);

  // Safely extract website names without crashing
  const getDomainName = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch (e) {
      return 'Website'; // Fallback if URL is broken
    }
  };

  const SearchBar = (
    <form
      onSubmit={handleSend}
      className="flex items-center bg-[#2f2f2f] border border-gray-600 rounded-full px-2 py-1.5 focus-within:border-gray-400 focus-within:bg-[#333333] transition-all duration-300 w-full max-w-3xl mx-auto shadow-lg"
    >
      <div className="pl-4 pr-2 text-gray-400">
        <Search size={20} />
      </div>

      <input
        type="text"
        placeholder="Search the web"
        className="flex-1 bg-transparent border-none text-gray-100 p-2 outline-none text-[15px] placeholder-gray-400"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={isLoading}
      />

      <div className="flex items-center gap-1 pr-1">
        <button
          type="button"
          onClick={() => setUseWeb(!useWeb)}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-[#404040] transition-colors ${useWeb ? 'text-blue-400' : 'text-gray-400'}`}
        >
          <Zap size={14} className={useWeb ? "fill-current" : ""} />
          {useWeb ? "Web" : "AI"}
          <span className="text-[10px] ml-1 opacity-50">▼</span>
        </button>

        <button type="button" className="p-2 text-gray-400 hover:text-gray-200 hover:bg-[#404040] rounded-full transition-colors hidden sm:block">
          <Mic size={20} />
        </button>

        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className={`p-2 rounded-full flex items-center justify-center transition-all ${prompt.trim() && !isLoading
            ? 'bg-white text-black hover:bg-gray-200'
            : 'bg-[#404040] text-gray-500 cursor-not-allowed'
            }`}
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </form>
  );

  return (
    <div className="flex h-screen bg-[#212121] font-sans text-gray-200 overflow-hidden">

      {/* --- SIDEBAR --- */}
      <div className="w-64 bg-[#171717] flex flex-col justify-between hidden md:flex border-r border-white/10">
        <div className="p-4 flex justify-between items-center text-gray-400">
          <Settings size={20} className="cursor-pointer hover:text-white transition-colors" />
          <PanelLeft size={20} className="cursor-pointer hover:text-white transition-colors" />
        </div>

        <div className="flex-1 px-3 space-y-1">
          <button onClick={handleNewChat} className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium bg-transparent border border-gray-700 text-gray-200 rounded-lg hover:bg-[#2a2a2a] mb-6 transition-colors">
            <div className="flex items-center gap-2">
              <PenLine size={16} />
              New Chat
            </div>
            <span className="text-xs text-gray-500 border border-gray-700 px-1.5 rounded">Ctrl o</span>
          </button>

          <NavButton icon={<LayoutGrid size={18} />} text="Apps" />
          <NavButton icon={<ImageIcon size={18} />} text="Images" />
          <NavButton icon={<FileText size={18} />} text="Documents" />
          <NavButton icon={<Folder size={18} />} text="Projects" />
          <NavButton icon={<Search size={18} />} text="Search Chat" />
        </div>


      </div>

      {/* --- MAIN CHAT AREA --- */}
      <div className="flex-1 flex flex-col h-full relative">
        {messages.length === 0 ? (
          // 1. EMPTY STATE
          <div className="flex-1 flex flex-col items-center justify-center px-4 w-full h-full">
            <h1 className="text-4xl font-semibold text-white mb-8 tracking-tight">AI Search Engine</h1>
            <div className="w-full max-w-3xl">
              {SearchBar}
              <p className="text-center text-xs text-gray-500 mt-6 font-medium">
                By using Chatbot, you agree to our <span className="underline cursor-pointer hover:text-gray-300">Terms of Service</span> and acknowledge our <span className="underline cursor-pointer hover:text-gray-300">Privacy Policy</span>.
              </p>
            </div>
          </div>
        ) : (
          // 2. CHATTING STATE
          <>
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center w-full">
              <div className="w-full max-w-3xl flex flex-col gap-6 pb-6">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-5 py-3.5 rounded-3xl max-w-[85%] text-[15px] leading-relaxed ${msg.role === 'user' ? 'bg-[#2f2f2f] text-white rounded-br-sm' : 'bg-transparent text-gray-200'}`}>
                      {/* Safety Net Added Here! */}
                      <ReactMarkdown
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={atomDark}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-lg my-3 shadow-lg text-[13px]"
                                {...props}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code className="bg-[#404040] text-blue-300 px-1.5 py-0.5 rounded-md font-mono text-sm" {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {msg.content || ""}

                      </ReactMarkdown>
                    </div>

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 pl-4">
                        {msg.sources.map((source, i) => (
                          <a key={i} href={source.url} target="_blank" rel="noreferrer"
                            className="bg-[#2a2a2a] border border-gray-700 px-3 py-1.5 rounded-full text-xs text-gray-300 flex items-center gap-1.5 hover:bg-[#3a3a3a] transition-colors">
                            <Globe size={12} className="text-blue-400" />
                            {/* Safer URL parsing used here! */}
                            {getDomainName(source.url)}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="self-start px-5 py-3.5 text-gray-400 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Pinned Search Bar */}
            <div className="w-full p-4 bg-gradient-to-t from-[#212121] via-[#212121] to-transparent pt-10">
              {SearchBar}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function NavButton({ icon, text }) {
  return (
    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:bg-[#2f2f2f] hover:text-gray-200 rounded-lg transition-colors">
      {icon}
      {text}
    </button>
  );
}

export default App;