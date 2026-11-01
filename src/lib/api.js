const API_BASE = import.meta.env?.VITE_API_BASE || '/api';

export class EnquiryError extends Error {
  constructor(kind) {
    super(kind);
    this.kind = kind; // 'network' | 'server'
  }
}

/** POST an enquiry to the existing Express API. Never logs payloads. */
export async function postEnquiry(payload) {
  let response;
  try {
    response = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new EnquiryError('network');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new EnquiryError(response.status === 503 || response.status === 404 ? 'network' : 'server');
  return data;
}

export async function postChat(message, language) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, language }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Chat service not configured');
  return data.reply;
}
