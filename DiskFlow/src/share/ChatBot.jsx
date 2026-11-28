import { useState, useRef, useEffect } from 'react';

const LANGFLOW_URL =
  import.meta.env.VITE_LANGFLOW_URL ||
  '/api/v1/run/40de0c84-1d0b-4f33-bc48-3a70111176a0';
const LANGFLOW_API_KEY = import.meta.env.VITE_LANGFLOW_API_KEY || '';

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Halo, aku Diska! Tanyakan apa saja soal penjadwalan disk (FCFS, SSTF, SCAN) 🌸',
    },
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { sender: 'user', text: trimmed }]);
    setInput('');
    setLoading(true);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (LANGFLOW_API_KEY) {
        headers['x-api-key'] = LANGFLOW_API_KEY;
      }

      const response = await fetch(LANGFLOW_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          input_value: trimmed,
          output_type: 'chat',
          input_type: 'chat',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const reply =
        data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text ||
        data?.outputs?.[0]?.outputs?.[0]?.messages?.[0]?.message ||
        'Maaf, Diska belum mendapat jawaban dari server.';

      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    } catch (err) {
      console.error('Langflow error:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: '⚠️ Tidak bisa terhubung ke Langflow (pastikan Langflow Desktop aktif dan API key di .env sudah benar).',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: 22, right: 22, zIndex: 9999 }}>
      {open && (
        <div
          style={{
            width: 340,
            height: 440,
            marginBottom: 12,
            background: '#FFF8F0',
            borderRadius: 24,
            border: '2px solid #FBCFE0',
            boxShadow: '0 12px 28px rgba(89, 61, 76, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'Nunito, sans-serif',
          }}
        >
          <div
            style={{
              padding: '14px 18px',
              background: '#F29AB8',
              color: 'white',
              fontFamily: 'Baloo 2, sans-serif',
              fontWeight: 800,
              fontSize: 17,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Asisten DiskFlow</span>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: 18,
                cursor: 'pointer',
                fontWeight: 800,
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              flex: 1,
              padding: 14,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  padding: '10px 14px',
                  borderRadius: 18,
                  fontSize: 14,
                  lineHeight: 1.45,
                  background: msg.sender === 'user' ? '#63B382' : 'white',
                  color: msg.sender === 'user' ? 'white' : '#4A3A46',
                  border:
                    msg.sender === 'user' ? 'none' : '1.5px solid #FBCFE0',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  padding: '8px 14px',
                  borderRadius: 18,
                  fontSize: 13,
                  background: 'white',
                  color: '#9A7F8D',
                  border: '1.5px solid #FBCFE0',
                }}
              >
                Diska sedang mengetik... 🌸
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={sendMessage}
            style={{
              padding: 10,
              background: '#FFF8F0',
              borderTop: '1.5px solid #FBCFE0',
              display: 'flex',
              gap: 8,
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pertanyaan..."
              style={{
                flex: 1,
                padding: '9px 14px',
                borderRadius: 999,
                border: '1.5px solid #FBCFE0',
                outline: 'none',
                fontSize: 14,
                fontFamily: 'Nunito, sans-serif',
                color: '#4A3A46',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '9px 16px',
                borderRadius: 999,
                border: 'none',
                background: '#F29AB8',
                boxShadow: '0 3px 0 #D9658F',
                color: 'white',
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Kirim
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          width: 62,
          height: 62,
          borderRadius: '50%',
          background: '#F29AB8',
          border: '2px solid white',
          boxShadow: '0 8px 20px rgba(0,0,0,0.20), 0 5px 0 #D9658F',
          color: 'white',
          fontSize: 24,
          cursor: 'pointer',
        }}
        title="Chat dengan Diska"
      >
        💬
      </button>
    </div>
  );
}