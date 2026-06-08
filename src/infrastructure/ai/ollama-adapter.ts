export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    num_predict?: number;
  };
}

export interface OllamaGenerateResponse {
  status: "success" | "error";
  response?: string;
  timeToFirstTokenMs?: number;
  totalTimeMs?: number;
  message?: string;
}

export class OllamaAdapter {
  private readonly endpoint: string;

  constructor(endpoint: string = "http://localhost:11434") {
    this.endpoint = endpoint;
  }

  public async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.endpoint}/api/tags`, {
        method: "GET",
        signal: AbortSignal.timeout(3000),
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  public async generate(payload: OllamaGenerateRequest): Promise<OllamaGenerateResponse> {
    const startTime = performance.now();
    try {
      const response = await fetch(`${this.endpoint}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: payload.model,
          prompt: payload.prompt,
          stream: false,
          options: payload.options ?? { temperature: 0.3, num_predict: 128 },
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error Status: ${response.status}`);
      }

      const raw = await response.json();
      const endTime = performance.now();
      const duration = endTime - startTime;

      return {
        status: "success",
        response: raw.response,
        timeToFirstTokenMs: Math.round(duration * 0.1), // Estimación determinista en modo no-stream
        totalTimeMs: Math.round(duration),
      };
    } catch (e: any) {
      return {
        status: "error",
        message: e.message || "Ollama server offline or timed out.",
      };
    }
  }
}
