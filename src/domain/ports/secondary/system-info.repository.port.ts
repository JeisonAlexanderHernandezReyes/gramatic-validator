export interface SystemInfo {
  language: string;
  os: string;
  processor: string;
  memory: string;
  motherboard: string;
}

export interface ISystemInfoRepository {
  getSystemInfo(): Promise<SystemInfo>;
}