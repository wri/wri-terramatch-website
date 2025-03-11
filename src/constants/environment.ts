import Log from "@/utils/log";

const ENVIRONMENT_NAMES = ["local", "dev", "test", "staging", "prod"] as const;
type EnvironmentName = (typeof ENVIRONMENT_NAMES)[number];

const SERVICES = ["apiBaseUrl", "userServiceUrl", "jobServiceUrl", "entityServiceUrl"] as const;
type Service = (typeof SERVICES)[number];

type ServicesDefinition = {
  apiBaseUrl: string;
  userServiceUrl: string;
  jobServiceUrl: string;
  researchServiceUrl: string;
  entityServiceUrl: string;
};

type Environment = ServicesDefinition & {
  mapboxToken: string;
  geoserverUrl: string;
  geoserverWorkspace: string;
  sentryDsn?: string;
};

const GLOBAL_MAPBOX_TOKEN =
  "pk.eyJ1IjoidGVycmFtYXRjaCIsImEiOiJjbHN4b2drNnAwNHc0MnBtYzlycmQ1dmxlIn0.ImQurHBtutLZU5KAI5rgng";
const GLOBAL_GEOSERVER_URL = "https://geoserver-prod.wri-restoration-marketplace-api.com";
const GLOBAL_SENTRY_DSN =
  "https://ab2bb67320b91a124ca3c42460b0e005@o4507018550181888.ingest.us.sentry.io/4507018664869888";

const GATEWAYS = {
  dev: "https://api-dev.terramatch.org",
  test: "https://api-test.terramatch.org",
  staging: "https://api-staging.terramatch.org",
  prod: "https://api.terramatch.org"
};

const LOCAL_SERVICE_URLS = {
  apiBaseUrl: "http://localhost:8080",
  userServiceUrl: "http://localhost:4010",
  jobServiceUrl: "http://localhost:4020",
  researchServiceUrl: "http://localhost:4030",
  entityServiceUrl: "http://localhost:4050"
};

const defaultServiceUrl = (env: EnvironmentName, service: Service) =>
  env === "local" ? LOCAL_SERVICE_URLS[service] : GATEWAYS[env];

const defaultGeoserverWorkspace = (env: EnvironmentName) =>
  env === "test" ? "wri_test" : env === "prod" ? "wri_prod" : "wri_staging";

// This is structured so that each environment can be targeted by a NextJS build with a single
// NEXT_PUBLIC_TARGET_ENV variable, but each value can be overridden if desired with an associated
// value.
const buildDefaults = (env: EnvironmentName): Environment => ({
  ...(SERVICES.reduce(
    (serviceUrls, service) => ({
      ...serviceUrls,
      [service]: defaultServiceUrl(env, service)
    }),
    {}
  ) as ServicesDefinition),
  mapboxToken: GLOBAL_MAPBOX_TOKEN,
  geoserverUrl: GLOBAL_GEOSERVER_URL,
  geoserverWorkspace: defaultGeoserverWorkspace(env),
  // Local omits the sentry DSN
  sentryDsn: env === "local" ? undefined : GLOBAL_SENTRY_DSN
});

let declaredEnv = process.env.NEXT_PUBLIC_TARGET_ENV ?? "local";
if (!ENVIRONMENT_NAMES.includes(declaredEnv as EnvironmentName)) {
  Log.error("Environment name not valid! Defaulting to local dev", { declaredEnv });
  declaredEnv = "local";
} else {
  Log.info("Booting up with target environment", { declaredEnv });
}

const DEFAULTS = buildDefaults(declaredEnv as EnvironmentName);
export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULTS.apiBaseUrl;
export const userServiceUrl = process.env.NEXT_PUBLIC_USER_SERVICE_URL ?? DEFAULTS.userServiceUrl;
export const jobServiceUrl = process.env.NEXT_PUBLIC_JOB_SERVICE_URL ?? DEFAULTS.jobServiceUrl;
export const researchServiceUrl = process.env.NEXT_PUBLIC_RESEARCH_SERVICE_URL ?? DEFAULTS.researchServiceUrl;
export const entityServiceUrl = process.env.NEXT_PUBLIC_ENTITY_SERVICE_URL ?? DEFAULTS.entityServiceUrl;
export const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? DEFAULTS.mapboxToken;
export const geoserverUrl = process.env.NEXT_PUBLIC_GEOSERVER_URL ?? DEFAULTS.geoserverUrl;
export const geoserverWorkspace = process.env.NEXT_PUBLIC_GEOSERVER_WORKSPACE ?? DEFAULTS.geoserverWorkspace;
export const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN ?? DEFAULTS.sentryDsn;
