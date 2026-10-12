import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import type { HttpError, Result } from "@/types/results";

const AXIOS_TIMEOUT_MILLISECONDS = 10 * 1000;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
  timeout: AXIOS_TIMEOUT_MILLISECONDS,
});

interface ErrorBody {
  message?: string | string[];
}

const handleRequest = async <T>(
  request: Promise<AxiosResponse<T>>
): Promise<Result<T, HttpError>> => {
  try {
    const res = await request;
    return { data: res.data };
  } catch (err) {
    const error = err as AxiosError<ErrorBody>;
    const status = error.response?.status ?? 500;
    const rawMessage = error.response?.data?.message;
    const message =
      (Array.isArray(rawMessage) ? rawMessage.join(", ") : rawMessage) ||
      (error.response
        ? status >= 500
          ? "Server error"
          : "Unhandled error occurred"
        : "Couldn't reach the server");

    return { error: { message, statusCode: status } };
  }
};

interface RequestOptions {
  headers?: Record<string, string>;
}

const GET = <T>(url: string, options?: RequestOptions) =>
  handleRequest<T>(axiosInstance.get<T>(url, options));

const POST = <T>(url: string, body?: unknown, options?: RequestOptions) =>
  handleRequest<T>(axiosInstance.post<T>(url, body, options));

const PATCH = <T>(url: string, body?: unknown, options?: RequestOptions) =>
  handleRequest<T>(axiosInstance.patch<T>(url, body, options));

const DELETE = <T>(url: string, options?: RequestOptions) =>
  handleRequest<T>(axiosInstance.delete<T>(url, options));

export const httpClient = { GET, POST, PATCH, DELETE };