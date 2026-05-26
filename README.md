# 🔍 AI Search Engine

A full-stack conversational AI assistant that can browse the real-time web. Built to handle complex context windows, format code blocks with syntax highlighting, and gracefully handle API rate limits. 

## ✨ Current Features (v1.0)
* **Short-Term Conversational Memory:** Remembers context across the entire active chat session.
* **Real-Time Web Search:** Toggles on Tavily API to fetch live internet data when the AI needs current facts.
* **Smart UI/UX:** Features a sleek dark mode, Markdown support, and VS Code-style syntax highlighting for code blocks.
* **Bulletproof Error Handling:** Catches API quota limits and server disconnects without crashing the React frontend.

## 🚀 Roadmap (Coming Soon)
This project is actively evolving. Upcoming features include:
- [ ] **Streaming Responses:** Implementing Server-Sent Events (SSE) so the AI types out answers in real-time.
- [ ] **Long-Term Memory:** Integrating MongoDB to save user chat histories across sessions.
- [ ] **Voice Interface:** Hooking up the Web Speech API for hands-free voice prompting.
- [ ] **Cloud Deployment:** Moving from `localhost` to live hosting on Vercel and Render.

## 🛠️ Tech Stack
* **Frontend:** React, Tailwind CSS, Lucide Icons, React Markdown, React Syntax Highlighter
* **Backend:** Node.js, Express
* **APIs:** Google Gemini 2.0 Flash, Tavily Web Search

## 💻 How to Run Locally
1. Clone the repository
2. Run `npm install` in both the `/frontend` and `/backend` directories.
3. Create a `.env` file in the backend with your `GEMINI_API_KEY` and `TAVILY_API_KEY`.
4. Run `npm run dev` in both directories to start the servers.
