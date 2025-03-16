
import { ISystemInfoRepository, SystemInfo } from '../../domain/ports/secondary/system-info.repository.port';

export class BrowserSystemInfoRepository implements ISystemInfoRepository {
  /**
   * Obtiene información del sistema desde el navegador
   */
  public async getSystemInfo(): Promise<SystemInfo> {
    try {
      // Información básica del navegador y sistema
      const userAgent = navigator.userAgent;
      const platform = navigator.platform;
      
      // Detectar el sistema operativo
      let os = 'Desconocido';
      if (userAgent.indexOf('Win') !== -1) os = 'Windows';
      else if (userAgent.indexOf('Mac') !== -1) os = 'MacOS';
      else if (userAgent.indexOf('Linux') !== -1) os = 'Linux';
      else if (userAgent.indexOf('Android') !== -1) os = 'Android';
      else if (userAgent.indexOf('iOS') !== -1) os = 'iOS';
      
      return {
        language: 'TypeScript (React)',
        os,
        processor: platform,
        memory: 'Información no disponible',
        motherboard: 'Información no disponible'
      };
    } catch (error) {
      console.error('Error al obtener información del sistema:', error);
      
      return {
        language: 'TypeScript (React)',
        os: 'Multiplataforma',
        processor: 'Información no disponible',
        memory: 'Información no disponible',
        motherboard: 'Información no disponible'
      };
    }
  }
}