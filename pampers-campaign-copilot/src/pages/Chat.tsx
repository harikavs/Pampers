import React, { useState } from "react";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error("Failed to call backend");

      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Campaign Copilot</h1>

      <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
        <input
          className="flex-1 rounded-xl px-3 py-2 bg-slate-900 border border-slate-700"
          placeholder="e.g. Create a RAF campaign for US and DE"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-sky-500"
        >
          {loading ? "Thinking..." : "Generate"}
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {data && (
        <pre className="bg-slate-900 border border-slate-700 p-4 rounded-xl text-xs whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default Chat;
