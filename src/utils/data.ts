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
