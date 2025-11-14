import React from "react";

export default function AppLayout({ sidebar, content }) {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">{sidebar}</aside>
      <main className="app-main">{content}</main>
    </div>
  );
}
