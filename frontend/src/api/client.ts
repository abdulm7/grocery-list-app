export class ApiRequestError extends Error {
  fieldErrors: Record<string, string> = {};

  constructor(message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "ApiRequestError";
    if (fieldErrors) {
      this.fieldErrors = fieldErrors;
    }
  }
}

// Parse DRF field errors into a flat Record<fieldName, errorMessage>
function parseFieldErrors(data: unknown): Record<string, string> {
  if (!data || typeof data !== "object") return {};

  const errors: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value) && value.length > 0) {
      errors[key] = String(value[0]);
    }
  }
  return errors;
}

// Generic fetch wrapper
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  // Handle 204 No Content (empty response)
  if (response.status === 204) {
    return {} as T;
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  // Success responses
  if (response.ok) {
    return data as T;
  }

  // Error handling
  const fieldErrors = parseFieldErrors(data);
  const message =
    Object.keys(fieldErrors).length > 0
      ? "Please fix the highlighted fields."
      : String(
          (data as Record<string, unknown>)?.detail ||
            (data as Record<string, unknown>)?.error ||
            "An error occurred. Please try again.",
        );

  throw new ApiRequestError(message, fieldErrors);
}

export { request };
