import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";

export default function MessageList({ messages, character }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="messages">
      {messages.map(msg => (
        <MessageBubble
          key={msg.id}
          sender={msg.sender}
          text={msg.text}
          timestamp={msg.timestamp}
          avatar={msg.sender === "character" ? character.avatar : null}
          name={msg.sender === "character" ? character.name : "You"}
        />
      ))}
      <div ref={bottomRef} />
    </section>
  );
}
