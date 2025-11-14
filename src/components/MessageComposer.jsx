import React, { useState } from "react";

export default function MessageComposer({ onSend }) {
  const [value, setValue] = useState("");

  function submit(e) {
    e.preventDefault();
    onSend(value);
    setValue("");
  }

  return (
    <form className="composer" onSubmit={submit}>
      <button type="button" className="btn icon" title="Attach">
        📎
      </button>
      <input
        className="input"
        placeholder="Type a message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="btn primary">Send</button>
    </form>
  );
}
