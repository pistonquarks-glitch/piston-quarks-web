import json
import time
import urllib.request
import urllib.error

class OllamaLocalClient:
    def __init__(self, host="http://localhost:11434"):
        self.host = host

    def check_health(self):
        """Verifica si el servicio local de Ollama está corriendo."""
        try:
            req = urllib.request.Request(f"{self.host}/api/tags")
            with urllib.request.urlopen(req, timeout=3) as response:
                return response.status == 200
        except urllib.error.URLError:
            return False

    def generate_response(self, model_name: str, prompt: str):
        """Genera una respuesta en base a inferencia local GGUF."""
        payload = {
            "model": model_name,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.3,
                "num_predict": 128
            }
        }
        
        data = json.dumps(payload).encode("utf-8")
        headers = {"Content-Type": "application/json"}
        
        start_time = time.time()
        try:
            req = urllib.request.Request(
                f"{self.host}/api/generate", 
                data=data, 
                headers=headers, 
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=15) as response:
                result = json.loads(response.read().decode("utf-8"))
                latency = time.time() - start_time
                return {
                    "status": "success",
                    "response": result.get("response"),
                    "latency_seconds": round(latency, 4)
                }
        except urllib.error.URLError as e:
            return {
                "status": "error",
                "message": f"Servidor Ollama local no disponible: {e.reason}"
            }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }

if __name__ == "__main__":
    client = OllamaLocalClient()
    print("[NEXUS WAN] Validando estado de Ollama local...")
    if client.check_health():
        print("⚡ Ollama en línea en puerto 11434.")
    else:
        print("❌ Ollama local no está activo. Ejecuta 'ollama serve' para iniciar.")
