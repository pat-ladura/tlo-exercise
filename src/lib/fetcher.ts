import { RequestInit } from "next/dist/server/web/spec-extension/request";

export type FetcherResponse = {
  status: number;
  ok: boolean;
  // eslint-disable-next-line
  data?: any;
  message?: string;
};

export default async function fetcher(
  input: string | URL | Request,
  init?: RequestInit
): Promise<FetcherResponse> {
  const response = await fetch(input, {
    cache: "no-store",
    ...init,
  });
  try {
    const data = await response.json();
    return {
      status: response.status,
      ok: response.ok,
      data: data,
    };
  } catch (error) {
    return {
      status: response.status,
      ok: response.ok,
      message: "Server error",
    };
  }
}
