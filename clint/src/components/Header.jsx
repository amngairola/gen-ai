export default function Header({ onToggleSidebar }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"
        >
          ☰
        </button>

        <span className="font-medium"> Pragya Chat</span>
        <span className="rounded-md bg-white/10 px-2 py-1 text-xs text-gray-300">
          Demo
        </span>
      </div>

      <button className="rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/10">
        Share
      </button>
    </header>
  );
}
