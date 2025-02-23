import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const user = useSelector((state) => state.auth.user);

    const chatEndRef = useRef(null); // Ref for scrolling

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        setIsTyping(true);

        try {
            const response = await fetch("https://api.dify.ai/v1/chat-messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer app-xTVCju6gHXKT4y5Cr3RdTYWp",
                },
                body: JSON.stringify({
                    query: input,
                    inputs: {},
                    user: user?.id || "guests"
                }),
            });

            const data = await response.json();
            setIsTyping(false);
            setMessages((prev) => [...prev, { text: data.answer, sender: "bot" }]);
        } catch (error) {
            setIsTyping(false);
            console.error("Error:", error);
        }
    };

    // Scroll to the bottom when new messages are added
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div>
            {/* Floating Chat Icon */}
            <button
                className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg"
                onClick={toggleChat}
            >
                💬
            </button>

            {/* Chatbox */}
            {isOpen && (
                <div className="fixed bottom-16 right-5 w-80 bg-white shadow-lg min-h-96 rounded-lg flex flex-col">
                    <div className="flex justify-between items-center bg-blue-600 text-white p-3 rounded-t-lg">
                        <h3 className="text-lg">Chatbot</h3>
                        <button onClick={toggleChat}>✖</button>
                    </div>
                    <div className="flex-1 max-h-[400px] p-3 overflow-y-auto bg-gray-100 space-y-2">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-2 my-1 rounded max-w-[75%] ${
                                    msg.sender === "user"
                                        ? "bg-blue-500 text-white self-end ml-auto"
                                        : "bg-gray-300 text-black"
                                }`}
                            >
                                {/<[a-z][\s\S]*>/i.test(msg.text) ? (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: `<div class="p-4 bg-white rounded-lg border border-black shadow-lg">${msg.text}</div>`
                                        }}
                                    />
                                ) : (
                                    msg.text
                                )}

                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="bg-gray-200 text-black p-2 my-1 rounded-xl flex items-center space-x-2 animate-pulse">
                                <span className="dot-animation">•</span>
                                <span className="dot-animation">•</span>
                                <span className="dot-animation">•</span>
                            </div>
                        )}
                        {/* Reference for scrolling */}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="p-3 border-t flex">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Type a message..."
                        />
                        <button onClick={sendMessage} className="ml-2 bg-blue-600 text-white p-2 rounded">
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
