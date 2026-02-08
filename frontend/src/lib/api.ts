const API_BASE_URL = 'http://localhost:3000'

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      let errorMessage = response.statusText
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch {
        // If response isn't JSON, use status text
      }
      const error = new Error(errorMessage || `HTTP error! status: ${response.status}`)
      ;(error as Error & { status?: number }).status = response.status
      throw error
    }

    // Handle empty responses
    const text = await response.text()
    return text ? JSON.parse(text) : (null as T)
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error)
    throw error
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  patch: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
}
