export interface ResponseData {
  error: string;
  status: number;
  statusText: string;
  body: string;
  headers: Record<string, string>;
  duration: number;
  size: number;
}