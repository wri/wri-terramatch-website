import Log from "@/utils/log";

const ENVIRONMENT_NAMES = ["local", "dev", "test", "staging", "prod"] as const;
type EnvironmentName = (typeof ENVIRONMENT_NAMES)[number];

type Environment = {
  apiBaseUrl: string;
  userServiceUrl: string;
  jobServiceUrl: string;
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

// This is structured so that each environment can be targeted by a NextJS build with a single
// NEXT_PUBLIC_TARGET_ENV variable, but each value can be overridden if desired with an associated
// value.
const ENVIRONMENTS: { [Property in EnvironmentName]: Environment } = {
  // Local omits the sentry DSN
  local: {
    apiBaseUrl: "http://localhost:8080",
    userServiceUrl: "http://localhost:4010",
    jobServiceUrl: "http://localhost:4020",
    mapboxToken: GLOBAL_MAPBOX_TOKEN,
    geoserverUrl: GLOBAL_GEOSERVER_URL,
    geoserverWorkspace: "wri_staging"
  },
  dev: {
    apiBaseUrl: "https://api-dev.terramatch.org",
    userServiceUrl: "https://api-dev.terramatch.org",
    jobServiceUrl: "https://api-dev.terramatch.org",
    mapboxToken: GLOBAL_MAPBOX_TOKEN,
    geoserverUrl: GLOBAL_GEOSERVER_URL,
    geoserverWorkspace: "wri_staging",
    sentryDsn: GLOBAL_SENTRY_DSN
  },
  test: {
    apiBaseUrl: "https://api-test.terramatch.org",
    userServiceUrl: "https://api-test.terramatch.org",
    jobServiceUrl: "https://api-test.terramatch.org",
    mapboxToken: GLOBAL_MAPBOX_TOKEN,
    geoserverUrl: GLOBAL_GEOSERVER_URL,
    geoserverWorkspace: "wri_test",
    sentryDsn: GLOBAL_SENTRY_DSN
  },
  staging: {
    apiBaseUrl: "https://api-staging.terramatch.org",
    userServiceUrl: "https://api-staging.terramatch.org",
    jobServiceUrl: "https://api-staging.terramatch.org",
    mapboxToken: GLOBAL_MAPBOX_TOKEN,
    geoserverUrl: GLOBAL_GEOSERVER_URL,
    geoserverWorkspace: "wri_staging",
    sentryDsn: GLOBAL_SENTRY_DSN
  },
  prod: {
    apiBaseUrl: "https://api.terramatch.org",
    userServiceUrl: "https://api.terramatch.org",
    jobServiceUrl: "https://api.terramatch.org",
    mapboxToken: GLOBAL_MAPBOX_TOKEN,
    geoserverUrl: GLOBAL_GEOSERVER_URL,
    geoserverWorkspace: "wri_prod",
    sentryDsn: GLOBAL_SENTRY_DSN
  }
};

let declaredEnv = process.env.NEXT_PUBLIC_TARGET_ENV ?? "local";
if (!ENVIRONMENT_NAMES.includes(declaredEnv as EnvironmentName)) {
  Log.error("Environment name not valid! Defaulting to local dev", { declaredEnv });
  declaredEnv = "local";
} else {
  Log.info("Booting up with target environment", { declaredEnv });
}

const DEFAULTS = ENVIRONMENTS[declaredEnv as EnvironmentName];
export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULTS.apiBaseUrl;
export const userServiceUrl = process.env.NEXT_PUBLIC_USER_SERVICE_URL ?? DEFAULTS.userServiceUrl;
export const jobServiceUrl = process.env.NEXT_PUBLIC_JOB_SERVICE_URL ?? DEFAULTS.jobServiceUrl;
export const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? DEFAULTS.mapboxToken;
export const geoserverUrl = process.env.NEXT_PUBLIC_GEOSERVER_URL ?? DEFAULTS.geoserverUrl;
export const geoserverWorkspace = process.env.NEXT_PUBLIC_GEOSERVER_WORKSPACE ?? DEFAULTS.geoserverWorkspace;
export const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN ?? DEFAULTS.sentryDsn;
