import React, { useState } from 'react'

const NEWS_ITEMS = [
  {
    headline:
      "AMD to sell Anthropic tens of billions in AI servers, invest up to $5 billion in startup",
    href: "/News1",
  },,
  {
    headline: "React Compiler now handles memoization automatically at build time",
    href: "https://medium.com/@mernstackdevbykevin/the-frontend-stack-is-evolving-fast-in-2026-heres-everything-you-need-to-know-029e55353268",
  },
  {
    headline: "Tailwind CSS remains the go-to styling layer for AI-assisted codebases",
    href: "https://www.builder.io/blog/react-ai-stack-2026",
  },
  {
    headline: "Storybook 10.4 adds AI-driven auto-setup and TanStack React support",
    href: "https://hackertab.dev/topics/javascript/react",
  },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const links = ["Home", "Docs", "Stack", "Community"];

  return (
    <nav className="bg-blue-900 text-slate-100 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="text-lg font-semibold">
          devstack
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a key={link} href="#" className="text-sm text-slate-300 hover:text-white">
              {link}
            </a>
          ))}
        </div>

        <button
          className="text-2xl leading-none md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-3 border-t border-slate-800 px-6 py-4 md:hidden">
          {links.map((link) => (
            <a key={link} href="#" className="text-sm text-slate-300 hover:text-white">
              {link}
            </a>
          ))}
        </div>
      )}

      <div className="border-t border-slate-800 bg-slate-950 px-6 py-2">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-400">
          <span className="font-medium text-slate-500">Tech News:</span>
          {NEWS_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              {item.headline}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar