import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Message({ message }) {
  const isUser = message.role === "user";

  return (
    <div className="w-full py-5">
      <div className="mx-auto flex max-w-3xl gap-4 px-4">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
            isUser ? "bg-purple-600" : "bg-emerald-600"
          }`}
        >
          {isUser ? "A" : "P"}
        </div>

        <div className="min-w-0 flex-1 pt-1">
          <p className="mb-2 text-sm font-semibold">
            {isUser ? "You" : "Pragya"}
          </p>

          <div className="text-[15px] leading-7 text-gray-200 break-words">
            {isUser ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              <div
                className="prose prose-invert max-w-none
                prose-p:my-3
                prose-headings:font-semibold
                prose-headings:text-white
                prose-strong:text-white
                prose-a:text-blue-400
                prose-code:text-emerald-300
                prose-pre:bg-[#171717]
                prose-pre:border prose-pre:border-gray-700
                prose-th:border prose-th:border-gray-600
                prose-td:border prose-td:border-gray-700
                prose-th:px-3 prose-th:py-2
                prose-td:px-3 prose-td:py-2
                prose-table:text-sm
                prose-li:my-1"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content || ""}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {!isUser && (
            <div className="mt-4 flex gap-4 text-gray-400">
              <button title="Copy" className="hover:text-white">
                ▢
              </button>
              <button title="Good response" className="hover:text-white">
                👍
              </button>
              <button title="Bad response" className="hover:text-white">
                👎
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
