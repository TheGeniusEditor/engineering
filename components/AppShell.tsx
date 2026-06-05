"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const NAVBAR_H = 47;
const W_OPEN   = 260;
const W_CLOSED = 52;

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  eyebrow?: string;
}

export default function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const sideW = collapsed ? W_CLOSED : W_OPEN;

  return (
    <div className="h-screen overflow-hidden" style={{ background: "var(--bg-page)" }}>
      {/* Fixed topbar — full width, z-50 */}
      <TopBar sidebarWidth={sideW} />

      {/* Fixed sidebar — starts from top, sits under topbar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

      {/* Main content — offset by sidebar width and navbar height */}
      <div
        className="flex flex-col"
        style={{
          marginLeft: sideW,
          marginTop: NAVBAR_H,
          height: `calc(100vh - ${NAVBAR_H}px)`,
          overflow: "hidden",
          transition: "margin-left 300ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-5 max-w-[1600px] mx-auto animate-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
