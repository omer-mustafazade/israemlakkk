'use client';
import { useState, useEffect, useCallback } from 'react';
import { Mail, MailOpen, Trash2, Phone, ChevronLeft, ChevronRight } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/messages?page=${p}&limit=15`);
      const data = await res.json();
      setMessages(data.messages ?? []);
      setTotal(data.pagination?.total ?? 0);
      setTotalPages(data.pagination?.totalPages ?? 1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  const markRead = async (id: string, isRead: boolean) => {
    await fetch(`/api/admin/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isRead }),
    });
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead } : m)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu mesajı silmək istədiyinizdən əminsiniz?')) return;
    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
    load(page);
  };

  const handleExpand = async (msg: Message) => {
    if (expanded === msg.id) {
      setExpanded(null);
      return;
    }
    setExpanded(msg.id);
    if (!msg.isRead) {
      markRead(msg.id, true);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString('az-AZ', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111827' }}>Mesajlar</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: 2 }}>
          {loading ? '...' : `${total} mesaj`}
        </p>
      </div>

      {loading ? (
        <div style={{ color: '#9ca3af', padding: '2rem', textAlign: 'center' }}>Yüklənir...</div>
      ) : messages.length === 0 ? (
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            padding: '3rem',
            textAlign: 'center',
            color: '#9ca3af',
          }}
        >
          <Mail size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <p style={{ fontWeight: 500 }}>Heç bir mesaj yoxdur</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                background: '#fff',
                borderRadius: 10,
                border: `1px solid ${msg.isRead ? '#e5e7eb' : '#bfdbfe'}`,
                overflow: 'hidden',
                boxShadow: msg.isRead ? 'none' : '0 0 0 3px rgba(37,99,235,0.07)',
              }}
            >
              {/* Header row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                onClick={() => handleExpand(msg)}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 99,
                    background: msg.isRead ? '#f3f4f6' : '#dbeafe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {msg.isRead ? (
                    <MailOpen size={16} color="#9ca3af" />
                  ) : (
                    <Mail size={16} color="#2563eb" />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: msg.isRead ? 500 : 700, color: '#111827', fontSize: '0.9rem' }}>
                      {msg.name}
                    </span>
                    {!msg.isRead && (
                      <span
                        style={{
                          background: '#2563eb',
                          color: '#fff',
                          fontSize: '0.65rem',
                          padding: '2px 7px',
                          borderRadius: 99,
                          fontWeight: 700,
                        }}
                      >
                        YENİ
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      color: '#9ca3af',
                      fontSize: '0.78rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%',
                    }}
                  >
                    {msg.message}
                  </div>
                </div>
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                    {formatDate(msg.createdAt)}
                  </div>
                </div>
              </div>

              {/* Expanded body */}
              {expanded === msg.id && (
                <div
                  style={{
                    borderTop: '1px solid #f3f4f6',
                    padding: '1rem 1rem 1rem 4rem',
                    background: '#fafafa',
                  }}
                >
                  {/* Contact info */}
                  <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <a
                      href={`tel:${msg.phone}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        color: '#2563eb',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      <Phone size={14} />
                      {msg.phone}
                    </a>
                    {msg.email && (
                      <a
                        href={`mailto:${msg.email}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          color: '#6b7280',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                        }}
                      >
                        <Mail size={14} />
                        {msg.email}
                      </a>
                    )}
                  </div>

                  {/* Message */}
                  <p
                    style={{
                      color: '#374151',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      marginBottom: '1rem',
                    }}
                  >
                    {msg.message}
                  </p>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => markRead(msg.id, !msg.isRead)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '6px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: 6,
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: '#374151',
                      }}
                    >
                      {msg.isRead ? <Mail size={13} /> : <MailOpen size={13} />}
                      {msg.isRead ? 'Oxunmamış işarələ' : 'Oxunmuş işarələ'}
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '6px 12px',
                        border: '1px solid #fecaca',
                        borderRadius: 6,
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: '#ef4444',
                      }}
                    >
                      <Trash2 size={13} />
                      Sil
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: '1.25rem' }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '7px 10px', borderRadius: 6, border: '1px solid #d1d5db',
              background: page === 1 ? '#f9fafb' : '#fff',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              color: page === 1 ? '#d1d5db' : '#374151',
              display: 'flex', alignItems: 'center',
            }}
          >
            <ChevronLeft size={15} />
          </button>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: '7px 10px', borderRadius: 6, border: '1px solid #d1d5db',
              background: page === totalPages ? '#f9fafb' : '#fff',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              color: page === totalPages ? '#d1d5db' : '#374151',
              display: 'flex', alignItems: 'center',
            }}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
