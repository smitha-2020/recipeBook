export interface IConfigDTO {
  host: string;
  port: string;
  dbName: string;
  logDir: string;

  credit: {
    initialLimit: number;
    initialDays: number;
  };
  privateKey: string;
}
