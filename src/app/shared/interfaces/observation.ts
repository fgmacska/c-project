export interface IObservation {
  location: string;
  date: Date;
  gps: string;
  group: string;
  specie: string;
  count: number;
  meteo: string;
  note?: string;
  dateCreated: Date;
  dateUpdated: Date;
  creator: {"name": string, "uid": string};
}