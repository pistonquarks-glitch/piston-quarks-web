/**
 * Piston Music Streaming Port (Hexagonal Architecture)
 * Define las firmas operativas para el procesamiento y decodificación de audio on-device,
 * desacoplando la lógica matemática del renderizado y el motor Web Audio API.
 */

export interface AudioTrackMetadata {
  trackId: string;
  title: string;
  artist: string;
  durationSeconds: number;
  mimeType: string;
  bitrateKbps: number;
  localPath: string; // Ruta local del archivo sin dependencia de APIs externas
}

export interface FftFrequencyData {
  timestamp: number;
  frequencies: Uint8Array; // Datos binarios crudos obtenidos del espectro de frecuencias
  amplitude: number; // Nivel consolidado de volumen
}

export interface MusicStreamPort {
  /**
   * Carga una pista de audio local sin conexión a la nube
   */
  loadTrack(trackId: string): Promise<AudioTrackMetadata>;

  /**
   * Procesa la Transformada Rápida de Fourier (FFT) en tiempo real para renderizado interactivo
   */
  getLiveSpectrumData(): Promise<FftFrequencyData>;

  /**
   * Modula la velocidad de bits y buffer local para evitar fugas de memoria
   */
  purgeUnusedCacheBuffers(): Promise<void>;
}
