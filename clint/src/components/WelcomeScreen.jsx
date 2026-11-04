const suggestions = [
  {
    title: "Write something",
    description: "Draft an email or blog post",
    prompt: "Help me write a professional email",
  },
  {
    title: "Learn something",
    description: "Explain complex concepts simply",
    prompt: "Explain React hooks with examples",
  },
  {
    title: "Code something",
    description: "Debug or generate code",
    prompt: "Build a React todo application",
  },
  {
    title: "Brainstorm ideas",
    description: "Explore creative possibilities",
    prompt: "Give me some interesting SaaS startup ideas",
  },
];

export default function WelcomeScreen({ onSelect }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <h1 className="mb-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        What can I help with?
      </h1>

      <p className="mb-10 text-sm text-gray-400">
        Your AI assistant is ready to help.
      </p>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {suggestions.map((item) => (
          <button
            key={item.title}
            onClick={() => onSelect(item.prompt)}
            className="rounded-xl border border-white/10 p-4 text-left transition hover:border-white/30 hover:bg-white/5"
          >
            <h3 className="mb-1 text-sm font-semibold">{item.title}</h3>
            <p className="text-xs text-gray-400">{item.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
