import { useState, useRef, useEffect } from "react";
import profileImage from "./assets/profile.jpg";

function App() {
  const [chats, setChats] = useState([[]]);
  const [currentChat, setCurrentChat] = useState(0);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const getTime = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const startListening = () => {
    if (!SpeechRecognition) {
      alert("Voice recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.onresult = (e) => {
      setInput(e.results[0][0].transcript);
    };

    recognition.start();
  };

  const updateChat = (msg) => {
    setChats((prev) => {
      const updated = [...prev];
      updated[currentChat] = [...updated[currentChat], msg];
      return updated;
    });
  };

  const typeText = async (text) => {
    let temp = "";

    updateChat({
      type: "bot",
      text: "",
      time: getTime(),
    });

    for (let char of text) {
      temp += char;

      await new Promise((r) => setTimeout(r, 10));

      setChats((prev) => {
        const updated = [...prev];

        updated[currentChat][updated[currentChat].length - 1].text =
          temp;

        return updated;
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userInput = input;

    updateChat({
      type: "user",
      text: userInput,
      time: getTime(),
    });

    setInput("");

    // Check if user is asking about name, creator, or identity
    const lowerInput = userInput.toLowerCase();
    const identityKeywords = ["what is your name", "who are you", "who made you", "what is your creator", "who is your creator", "tell me about yourself"];
    const isIdentityQuestion = identityKeywords.some(keyword => lowerInput.includes(keyword));

    if (isIdentityQuestion) {
      await typeText("I'm PrashuAI, created by Prashuu. How can I help you today?");
      return;
    }

    try {
      const res = await fetch("http://localhost:8089/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput,
        }),
      });

      if (!res.ok) {
        throw new Error("Server Error");
      }

      const data = await res.text();

      await typeText(data);
    } catch (err) {
      await typeText("Backend connection failed...");
    }
  };

  const newChat = () => {
    setChats((prev) => [...prev, []]);
    setCurrentChat(chats.length);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chats]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        overflow: "hidden",
        position: "relative",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `url(${profileImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: "#fff",
            margin: 0,
            letterSpacing: "2px",
            display: "flex",
            justifyContent: "center",
            gap: "2px",
          }}
        >
          {["P", "r", "a", "s", "h", "u", "u"].map((char, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                textShadow: `
                  0 0 10px rgba(100, 200, 255, 0.8),
                  0 0 20px rgba(100, 200, 255, 0.6),
                  0 0 30px rgba(100, 200, 255, 0.4),
                  0 0 40px rgba(100, 200, 255, 0.2)
                `,
                animation: `wave 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {char}
            </span>
          ))}
        </div>

        <style>
          {`
            @keyframes wave {
              0%, 100% {
                transform: translateY(0px) scale(1);
              }
              50% {
                transform: translateY(-15px) scale(0.9);
              }
            }
          `}
        </style>
      </div>

      <div
        style={{
          width: "220px",
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(15px)",
          padding: "15px",
          color: "white",
          zIndex: 2,
        }}
      >
        <h2 style={{ fontSize: "16px" }}>PrashuAI 🤖</h2>

        <button
          onClick={newChat}
          style={{
            width: "100%",
            padding: "10px",
            border: "none",
            borderRadius: "12px",
            marginBottom: "12px",
            background: "rgba(255,255,255,0.12)",
            color: "white",
            cursor: "pointer",
          }}
        >
          + New Chat
        </button>

        {chats.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentChat(i)}
            style={{
              padding: "8px",
              borderRadius: "10px",
              cursor: "pointer",
              marginBottom: "5px",
              background:
                currentChat === i
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
            }}
          >
            Chat {i + 1}
          </div>
        ))}
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          zIndex: 2,
          color: "white",
        }}
      >
        <div
          style={{
            padding: "12px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              marginRight: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            🤖
          </div>

          <div>
            <div style={{ fontSize: "15px" }}>
              PrashuAI
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "#ccc",
              }}
            >
              Online
            </div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
          }}
        >
          {chats[currentChat].map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems:
                  msg.type === "user"
                    ? "flex-end"
                    : "flex-start",
                marginBottom: "15px",
              }}
            >
              <div className={`bubble ${msg.type}`}>
                {msg.text}

                {i === chats[currentChat].length - 1 &&
                  msg.type === "bot" && (
                    <span className="cursor">|</span>
                  )}
              </div>

              <div className="time">
                {msg.time}
              </div>
            </div>
          ))}

          <div ref={bottomRef}></div>
        </div>

        <div style={{ padding: "12px" }}>
          <div className="inputBox">
            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder="Ask something..."
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage()
              }
            />

            <button onClick={startListening}>
              🎤
            </button>

            <button onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>

      <style>
        {`
          .bubble {
            padding: 12px 16px;
            border-radius: 18px;
            max-width: 65%;
            font-size: 14px;
            backdrop-filter: blur(10px);
            word-wrap: break-word;
          }

          .user {
            background: linear-gradient(135deg,#3797F0,#5d7cff);
            box-shadow: 0 8px 25px rgba(55,151,240,0.5);
          }

          .bot {
            background: rgba(255,255,255,0.08);
            box-shadow: 0 8px 25px rgba(0,0,0,0.4);
          }

          .time {
            font-size: 10px;
            color: #bbb;
            margin-top: 4px;
          }

          .profile {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            margin-right: 10px;
          }

          .inputBox {
            display: flex;
            background: rgba(255,255,255,0.1);
            border-radius: 25px;
            padding: 5px;
            backdrop-filter: blur(10px);
          }

          .inputBox input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: white;
            padding: 10px;
            font-size: 14px;
          }

          .inputBox button {
            border: none;
            background: transparent;
            color: white;
            padding: 10px;
            cursor: pointer;
          }

          .cursor {
            animation: blink 1s infinite;
          }

          .particles::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            background:
              radial-gradient(
                circle,
                rgba(255,255,255,0.25) 1px,
                transparent 1px
              );
            background-size: 25px 25px;
            animation: move 25s linear infinite;
          }

          @keyframes move {
            from {
              background-position: 0 0;
            }

            to {
              background-position: 1000px 1000px;
            }
          }

          @keyframes blink {
            50% {
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
}

export default App;