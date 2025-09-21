export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestHeader {
  id: string;
  key: string;
  value: string;
}

export interface RequestState {
  method: HttpMethod;
  url: string;
  headers: RequestHeader[];
  body: string;
}

export interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

export interface HistoryItem {
  id: string;
  userId: string;
  request: {
    method: HttpMethod;
    url: string;
    headers: Record<string, string>;
    body?: unknown;
  };
  response: {
    status: number;
    size: number;
  };
  duration: number;
  timestamp: FirestoreTimestamp;
  error?: string;
}
