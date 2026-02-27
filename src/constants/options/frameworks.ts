import { useEffect, useState } from "react";

import { loadReportingFrameworks } from "@/connections/ReportingFramework";
import { ReportingFrameworkDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Log from "@/utils/log";

interface FrameworkChoice {
  id: string | null;
  name: string;
}

async function getFrameworkChoices(): Promise<FrameworkChoice[]> {
  const connected = await loadReportingFrameworks({});

  if (connected.loadFailure != null || connected.data == null) {
    return [];
  }

  return connected.data.map((framework: ReportingFrameworkDto) => ({
    id: framework.slug,
    name: framework.name
  }));
}

export function useFrameworkChoices(): FrameworkChoice[] {
  const [frameworkChoices, setFrameworkChoices] = useState<FrameworkChoice[]>([]);

  const fetchFrameworkChoices = async function () {
    try {
      setFrameworkChoices(await getFrameworkChoices());
    } catch (error) {
      Log.error("Error fetching framework choices", error);
    }
  };

  useEffect(() => {
    fetchFrameworkChoices();
  }, []);

  return frameworkChoices;
}
