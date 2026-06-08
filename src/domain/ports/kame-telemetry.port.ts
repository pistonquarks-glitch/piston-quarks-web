/**
 * KAME Telemetry Port (Hexagonal Architecture)
 * Desacopla la adquisición física de datos de geolocalización y señales de sensor
 * de la lógica interna de subasta y optimización del motor Pistón.
 */

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  heading?: number; // Dirección en grados (0-360)
  speed?: number; // Velocidad del vehículo en m/s
  accuracy?: number; // Margen de error en metros
}

export interface DeviceTelemetrySignal {
  timestamp: string;
  driverId: string;
  location: GpsCoordinates;
  networkLatencyMs: number;
  batteryStatusPercentage: number;
  sensorMetadata: Record<string, string | number | boolean>;
}

export interface KameTelemetryPort {
  /**
   * Registra y valida atómicamente la posición del conductor
   */
  ingestTelemetrySignal(signal: DeviceTelemetrySignal): Promise<boolean>;

  /**
   * Recupera el último punto de control de estado del vehículo
   */
  getLastKnownLocation(driverId: string): Promise<GpsCoordinates | null>;

  /**
   * Retorna flujos reactivos de geolocalización en tiempo real
   */
  subscribeToDriverRoute(driverId: string, callback: (location: GpsCoordinates) => void): void;
}
