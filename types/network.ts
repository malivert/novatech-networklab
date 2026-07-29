export type Difficulty = "Débutant" | "Intermédiaire" | "Avancé";

export type DeviceStatus = "online" | "degraded" | "offline";

export type ScenarioStatus = "briefing" | "active" | "corrected" | "validated";

export type LogLevel = "Information" | "Avertissement" | "Erreur";

export type ViewKey =
  | "accueil"
  | "cours"
  | "supervision"
  | "defis"
  | "terminal"
  | "journaux"
  | "resultat"
  | "progression"
  | "competences"
  | "a-propos";

export interface NetworkDevice {
  id: string;
  name: string;
  type: string;
  ip: string;
  mask: string;
  gateway: string;
  vlan: string;
  status: DeviceStatus;
  services: string[];
  connections: string[];
  anomaly?: string;
}

export interface ScenarioLog {
  time: string;
  source: "Windows" | "DNS" | "DHCP" | "Pare-feu" | "Switch" | "Connexion";
  level: LogLevel;
  message: string;
}

export interface CorrectionAction {
  id: string;
  label: string;
  description: string;
}

export interface Scenario {
  id: string;
  title: string;
  shortTitle: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  context: string;
  testimony: string;
  symptom: string;
  cause: string;
  affectedDeviceIds: string[];
  workstationId: string;
  hints: string[];
  actions: CorrectionAction[];
  correctActionId: string;
  expectedCommands: string[];
  packetDestination: string;
  packetStopDeviceId: string;
  explanation: string;
  prevention: string[];
  logs: ScenarioLog[];
}

export interface CommandRecord {
  command: string;
  output: string;
  useful: boolean;
  timestamp: string;
}

export interface ActionRecord {
  actionId: string;
  label: string;
  correct: boolean;
  timestamp: string;
}

export interface ScoreBreakdown {
  diagnostic: number;
  correction: number;
  validation: number;
  method: number;
  penalties: number;
  total: number;
}

export interface ScenarioProgress {
  scenarioId: string;
  bestScore: number;
  completed: boolean;
  bestDurationSeconds: number;
  attempts: number;
  updatedAt: string;
}

export interface CourseProgress {
  courseId: string;
  bestScore: number;
  completed: boolean;
  attempts: number;
  updatedAt: string;
}

export interface StoredProgress {
  scenarios: ScenarioProgress[];
  courses: CourseProgress[];
  theme: "dark" | "light";
}
