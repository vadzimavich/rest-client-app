export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestHeader {
  id: string; // unique key
  key: string;
  value: string;
}

export interface RequestState {
  method: HttpMethod;
  url: string;
  headers: RequestHeader[];
  body: string;
}