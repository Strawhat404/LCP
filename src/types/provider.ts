export interface Provider {
  id: number;
  name: string;
  company: string;
  country: string;
  state: string;
  stateCode: string;
  city: string;
  cityDisplay: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  certification: string;
  specialty: string;
  expirationDate: string;
  certificateNo: string;
  description: string;
  image: string;
  slug: string;
  lat?: number;
  lng?: number;
}

export interface ProvidersData {
  providers: Provider[];
  metadata: {
    total: number;
    totalRaw: number;
    skipped: number;
    lastUpdated: string;
    countries: string[];
    states: string[];
  };
}
