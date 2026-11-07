export class ApiError extends Error {}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(path, { ...options, headers, credentials: "include" });
  if (response.headers.get("content-type")?.includes("application/pdf")) {
    if (!response.ok) throw new ApiError("The PDF could not be prepared.");
    return response as T;
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(data.error || "The request could not be completed.");
  return data as T;
}

export function download(path: string, filename: string) {
  return api<Response>(path).then(async (response) => {
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  });
}

export type Profile = {
  id: number;
  email: string;
  full_name: string;
  mobile: string | null;
  age_group: string;
  state: string;
  district: string;
  language: "en" | "hi" | "te";
  onboarding_complete: number;
  text_size: "sm" | "md" | "lg" | "xl";
  voice_assist: number;
  interests: string;
};
