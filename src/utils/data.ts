import type { Provider } from "../types/provider";
import rawData from "../data/providers.json";

const providers: Provider[] = rawData?.providers ?? [];

export function getAllStates(): string[] {
  return Array.from(new Set(providers.map((p) => p.state))).sort();
}

export function getStatesByCountry(country: string): string[] {
  return Array.from(
    new Set(
      providers.filter((p) => p.country === country).map((p) => p.state)
    )
  ).sort();
}

export function getCitiesByState(state: string): string[] {
  return Array.from(
    new Set(providers.filter((p) => p.state === state).map((p) => p.city))
  ).sort();
}

export function getProvidersByState(state: string): Provider[] {
  return providers.filter((p) => p.state === state).sort((a, b) => a.name.localeCompare(b.name));
}

export function getProvidersByCity(state: string, city: string): Provider[] {
  return providers
    .filter((p) => p.state === state && p.city === city)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getProviderBySlug(slug: string): Provider | undefined {
  return providers.find((p) => p.slug === slug);
}

export function getStateName(stateSlug: string): string {
  return providers.find((p) => p.state === stateSlug)?.state ?? stateSlug;
}

export function getCityName(citySlug: string): string {
  return providers.find((p) => p.city === citySlug)?.city ?? citySlug;
}

export function getProviderCountByState(state: string): number {
  return providers.filter((p) => p.state === state).length;
}

export function getProviderCountByCity(state: string, city: string): number {
  return providers.filter((p) => p.state === state && p.city === city).length;
}

export function getAllProviders(): Provider[] {
  return providers;
}

// Physician helpers — MD/DO providers only
export function isPhysician(provider: Provider): boolean {
  const name = provider.name || '';
  return /,\s*(MD|DO|M\.D|D\.O)(\b|,|$)/i.test(name);
}

export function getPhysiciansByState(state: string): Provider[] {
  return getProvidersByState(state).filter(isPhysician);
}

export function getPhysiciansByCity(state: string, city: string): Provider[] {
  return getProvidersByCity(state, city).filter(isPhysician);
}

export function getPhysicianCountByState(state: string): number {
  return getPhysiciansByState(state).length;
}

export function getPhysicianCountByCity(state: string, city: string): number {
  return getPhysiciansByCity(state, city).length;
}

export function getAllPhysicianStates(): string[] {
  // Only states with 2+ physicians (avoids thin pages)
  return getAllStates().filter(state => getPhysicianCountByState(state) >= 2);
}

export function getPhysicianCitiesByState(state: string): string[] {
  return Array.from(
    new Set(getPhysiciansByState(state).map(p => p.city))
  ).sort();
}
