"use client";

import {
  Activity,
  ArrowRight,
  Award,
  BookOpenCheck,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Clipboard,
  Clock3,
  Code2,
  ContactRound,
  ExternalLink,
  FileCheck2,
  FileText,
  Gauge,
  GitBranch,
  GraduationCap,
  Home,
  Info,
  Laptop,
  Lightbulb,
  ListChecks,
  Menu,
  Moon,
  Network,
  PanelLeftClose,
  Play,
  RotateCcw,
  Router,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Sun,
  TerminalSquare,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { getScenario, scenarios } from "@/data/scenarios";
import { networkDevices } from "@/data/network";
import { calculateScore } from "@/lib/scoring";
import {
  defaultProgress,
  mergeCourseProgress,
  mergeScenarioProgress,
  readProgress,
  writeProgress,
} from "@/lib/storage";
import { VIEW_ROUTES, viewFromPath } from "@/lib/navigation";
import type {
  ActionRecord,
  CommandRecord,
  LogLevel,
  ScenarioStatus,
  StoredProgress,
  ViewKey,
} from "@/types/network";
import { PacketTrace } from "@/components/network/PacketTrace";
import { SimulatedTerminal } from "@/components/terminal/SimulatedTerminal";
import { CourseHub } from "@/components/courses/CourseHub";
import { TechnicalProofs } from "@/components/proofs/TechnicalProofs";
import { networkCourses } from "@/data/courses";

const NetworkTopology = dynamic(
  () => import("@/components/network/NetworkTopology").then((module) => module.NetworkTopology),
  {
    ssr: false,
    loading: () => <div className="topology-canvas topology-loading">Chargement de la topologie…</div>,
  },
);

const navItems: Array<{ key: ViewKey; label: string; icon: typeof Home }> = [
  { key: "accueil", label: "Accueil", icon: Home },
  { key: "cours", label: "Cours réseau", icon: BookOpenCheck },
  { key: "preuves", label: "Preuves techniques", icon: FileText },
  { key: "supervision", label: "Centre de supervision", icon: Gauge },
  { key: "defis", label: "Défis", icon: ListChecks },
  { key: "terminal", label: "Terminal", icon: TerminalSquare },
  { key: "journaux", label: "Journaux", icon: ScrollText },
  { key: "resultat", label: "Résultat & rapport", icon: FileCheck2 },
  { key: "progression", label: "Progression", icon: Trophy },
  { key: "competences", label: "Compétences BTS SIO", icon: GraduationCap },
  { key: "a-propos", label: "À propos", icon: Info },
];

const profileLinks = {
  github: "https://github.com/malivert",
  linkedin: "https://www.linkedin.com/in/christian-malivert-274506211",
  repository: "https://github.com/malivert/novatech-networklab",
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
};

export function NetworkLabApp({ initialRecruiterMode = false }: { initialRecruiterMode?: boolean }) {
  const initialScenarioId = initialRecruiterMode ? "dns-incorrect" : scenarios[0].id;
  const [view, setView] = useState<ViewKey>(initialRecruiterMode ? "terminal" : "accueil");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCompact, setSidebarCompact] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [progress, setProgress] = useState<StoredProgress>(defaultProgress);
  const [scenarioId, setScenarioId] = useState(initialScenarioId);
  const [scenarioStatus, setScenarioStatus] = useState<ScenarioStatus>(
    initialRecruiterMode ? "active" : "briefing",
  );
  const [commands, setCommands] = useState<CommandRecord[]>([]);
  const [actions, setActions] = useState<ActionRecord[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [selectedDeviceId, setSelectedDeviceId] = useState(
    getScenario(initialScenarioId).workstationId,
  );
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [recruiterMode, setRecruiterMode] = useState(initialRecruiterMode);
  const [logSource, setLogSource] = useState("Toutes");
  const [logLevel, setLogLevel] = useState<LogLevel | "Tous">("Tous");
  const [copiedReport, setCopiedReport] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  const scenario = useMemo(() => getScenario(scenarioId), [scenarioId]);
  const corrected = scenarioStatus === "corrected" || scenarioStatus === "validated";
  const validated = scenarioStatus === "validated";
  const selectedDevice =
    networkDevices.find((device) => device.id === selectedDeviceId) ?? networkDevices[0];

  const score = useMemo(
    () =>
      calculateScore({
        commands,
        actions,
        hintsUsed,
        validated,
        durationSeconds: durationSeconds || elapsed,
        expectedCommands: scenario.expectedCommands,
      }),
    [actions, commands, durationSeconds, elapsed, hintsUsed, scenario.expectedCommands, validated],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = readProgress(window.localStorage);
      setProgress(stored);
      setTheme(stored.theme);
      setView(viewFromPath(window.location.pathname));
      if (initialRecruiterMode) setStartedAt(Date.now());
      setStorageReady(true);
    }, 0);
    const onPopState = () => setView(viewFromPath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("popstate", onPopState);
    };
  }, [initialRecruiterMode]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (!storageReady) return;
    const next = { ...progress, theme };
    writeProgress(next, window.localStorage);
  }, [progress, storageReady, theme]);

  useEffect(() => {
    if (!startedAt || validated) return;
    const timer = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [startedAt, validated]);

  function navigate(nextView: ViewKey) {
    setView(nextView);
    setMobileMenuOpen(false);
    window.history.pushState({}, "", VIEW_ROUTES[nextView]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetSimulation(nextScenarioId = scenarioId, keepRecruiterMode = false) {
    setScenarioId(nextScenarioId);
    setScenarioStatus("briefing");
    setCommands([]);
    setActions([]);
    setHintsUsed(0);
    setStartedAt(null);
    setDurationSeconds(0);
    setElapsed(0);
    setRecruiterMode(keepRecruiterMode);
    const nextScenario = getScenario(nextScenarioId);
    setSelectedDeviceId(nextScenario.workstationId);
  }

  function startScenario(nextScenarioId = scenarioId, recruiter = false) {
    resetSimulation(nextScenarioId, recruiter);
    setScenarioStatus("active");
    setStartedAt(Date.now());
    setRecruiterMode(recruiter);
    if (recruiter) {
      setView("terminal");
      setMobileMenuOpen(false);
      window.history.pushState({}, "", "/recruteur");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate("supervision");
  }

  function selectScenario(nextScenarioId: string) {
    resetSimulation(nextScenarioId);
    navigate("defis");
  }

  function applyAction(actionId: string, label: string) {
    if (scenarioStatus === "briefing") return;
    const correct = actionId === scenario.correctActionId;
    setActions((current) => [
      ...current,
      { actionId, label, correct, timestamp: new Date().toISOString() },
    ]);
    if (correct) setScenarioStatus("corrected");
  }

  function validateService() {
    if (!corrected || validated) return;
    const finalDuration = startedAt ? Math.max(1, Math.floor((Date.now() - startedAt) / 1000)) : elapsed;
    setDurationSeconds(finalDuration);
    setScenarioStatus("validated");

    const finalScore = calculateScore({
      commands,
      actions,
      hintsUsed,
      validated: true,
      durationSeconds: finalDuration,
      expectedCommands: scenario.expectedCommands,
    }).total;
    const previous = progress.scenarios.find((item) => item.scenarioId === scenario.id);
    const next = mergeScenarioProgress(progress, {
      scenarioId: scenario.id,
      bestScore: finalScore,
      completed: true,
      bestDurationSeconds: finalDuration,
      attempts: (previous?.attempts ?? 0) + 1,
    });
    setProgress(next);
    writeProgress(next, window.localStorage);
    window.setTimeout(() => navigate("resultat"), 650);
  }

  function completeCourse(courseId: string, quizScore: number) {
    const previous = progress.courses.find((item) => item.courseId === courseId);
    const next = mergeCourseProgress(progress, {
      courseId,
      bestScore: quizScore,
      completed: quizScore >= 67,
      attempts: (previous?.attempts ?? 0) + 1,
    });
    setProgress(next);
    writeProgress(next, window.localStorage);
  }

  function changeTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  function openBlockedDevice() {
    setSelectedDeviceId(scenario.packetStopDeviceId);
    navigate("supervision");
  }

  function buildReport() {
    const commandLines = commands.length
      ? commands.map((command) => `- ${command.command}`).join("\n")
      : "- Aucune commande";
    const actionLines = actions.length
      ? actions.map((action) => `- ${action.label} (${action.correct ? "correcte" : "non retenue"})`).join("\n")
      : "- Aucune action";
    return `RAPPORT D’INTERVENTION — NOVATECH NETWORKLAB
Date : ${new Date().toLocaleString("fr-FR")}
Scénario : ${scenario.shortTitle}
Équipement : ${scenario.affectedDeviceIds.map((id) => networkDevices.find((item) => item.id === id)?.name ?? id).join(", ")}
Symptôme : ${scenario.symptom}

COMMANDES EXÉCUTÉES
${commandLines}

ACTIONS TENTÉES
${actionLines}

Cause identifiée : ${validated ? scenario.cause : "Diagnostic non validé"}
Correction appliquée : ${actions.find((action) => action.correct)?.label ?? "Aucune"}
Test de validation : ${validated ? "Réussi" : "Non effectué"}
Temps de résolution : ${formatDuration(durationSeconds || elapsed)}
Score : ${score.total}/100

MESURES PRÉVENTIVES
${scenario.prevention.map((item) => `- ${item}`).join("\n")}

Technicien : Christian Malivert`;
  }

  async function copyReport() {
    await navigator.clipboard?.writeText(buildReport());
    setCopiedReport(true);
    window.setTimeout(() => setCopiedReport(false), 1500);
  }

  const completedCount = progress.scenarios.filter((item) => item.completed).length;
  const completedCourseCount = progress.courses.filter((item) => item.completed).length;
  const bestAverage = completedCount
    ? Math.round(
        progress.scenarios.reduce((sum, item) => sum + item.bestScore, 0) /
          progress.scenarios.length,
      )
    : 0;
  const courseAverage = progress.courses.length
    ? Math.round(
        progress.courses.reduce((sum, item) => sum + item.bestScore, 0) /
          progress.courses.length,
      )
    : 0;

  return (
    <div className={`app-shell ${sidebarCompact ? "sidebar-compact" : ""}`}>
      <a className="skip-link" href="#main-content">
        Aller au contenu principal
      </a>

      <aside className={`sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <Network size={23} />
          </div>
          <div className="brand-copy">
            <strong>NovaTech</strong>
            <span>NetworkLab</span>
          </div>
          <button
            className="sidebar-collapse"
            type="button"
            onClick={() => setSidebarCompact((current) => !current)}
            aria-label={sidebarCompact ? "Déployer la navigation" : "Réduire la navigation"}
          >
            <PanelLeftClose size={18} />
          </button>
          <button
            className="mobile-close"
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav aria-label="Navigation principale">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={view === item.key ? "active" : ""}
                type="button"
                key={item.key}
                onClick={() => navigate(item.key)}
                aria-current={view === item.key ? "page" : undefined}
                title={sidebarCompact ? item.label : undefined}
              >
                <Icon size={19} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-incident">
          <span className={`status-dot ${corrected ? "online" : scenarioStatus === "active" ? "degraded" : ""}`} />
          <div>
            <small>Incident chargé</small>
            <strong>{scenario.shortTitle}</strong>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="avatar">CM</div>
          <div className="sidebar-profile">
            <strong>Christian Malivert</strong>
            <span>BTS SIO SISR</span>
          </div>
          <a
            href={profileLinks.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="Profil LinkedIn de Christian Malivert"
            title="LinkedIn"
          >
            <ContactRound size={17} />
          </a>
        </div>
      </aside>

      {mobileMenuOpen && <button className="menu-backdrop" type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Fermer le menu" />}

      <div className="app-main">
        <header className="topbar">
          <button className="mobile-menu" type="button" onClick={() => setMobileMenuOpen(true)} aria-label="Ouvrir le menu">
            <Menu size={21} />
          </button>
          <div className="breadcrumb">
            <span>NetworkLab</span>
            <ChevronRight size={14} />
            <strong>
              {recruiterMode && view === "terminal"
                ? "Démonstration recruteur"
                : navItems.find((item) => item.key === view)?.label}
            </strong>
          </div>
          <div className="topbar-actions">
            {scenarioStatus !== "briefing" && (
              <div className="timer">
                <Clock3 size={16} />
                {formatDuration(durationSeconds || elapsed)}
              </div>
            )}
            <button className="icon-button" type="button" onClick={changeTheme} aria-label={`Activer le mode ${theme === "dark" ? "clair" : "sombre"}`}>
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a
              className="secondary-button compact-button profile-button"
              href={profileLinks.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              <ContactRound size={16} />
              Me contacter
            </a>
            <button className="primary-button compact-button" type="button" onClick={() => startScenario(scenario.id)}>
              <Play size={16} />
              {scenarioStatus === "briefing" ? "Lancer le défi" : "Recommencer"}
            </button>
          </div>
        </header>

        <main id="main-content" tabIndex={-1}>
          {view === "accueil" && (
            <div className="page-content home-page">
              <section className="hero">
                <div className="hero-grid" aria-hidden="true" />
                <div className="hero-glow" aria-hidden="true" />
                <div className="hero-copy">
                  <div className="hero-badge">
                    <Activity size={15} />
                    LABORATOIRE RÉSEAU INTERACTIF
                  </div>
                  <h1>
                    Trouvez la panne.
                    <br />
                    <span>Rétablissez le réseau.</span>
                  </h1>
                  <p>
                    Apprenez les fondamentaux, puis diagnostiquez une panne DNS, DHCP, VLAN ou pare-feu directement depuis votre navigateur.
                  </p>
                  <div className="hero-actions">
                    <button className="primary-button hero-button" type="button" onClick={() => startScenario(scenarios[0].id)}>
                      <Play size={18} /> Lancer le défi
                    </button>
                    <button className="secondary-button hero-button" type="button" onClick={() => navigate("cours")}>
                      <BookOpenCheck size={18} /> Suivre les cours
                    </button>
                    <button className="secondary-button hero-button" type="button" onClick={() => startScenario("dns-incorrect", true)}>
                      <Sparkles size={18} /> Démonstration recruteur — moins de 2 min
                    </button>
                    <button className="secondary-button hero-button" type="button" onClick={() => navigate("preuves")}>
                      <FileText size={18} /> Voir la preuve technique
                    </button>
                  </div>
                  <div className="hero-proof">
                    <span><Check size={15} /> 8 cours et quiz</span>
                    <span><Check size={15} /> 6 incidents réalistes</span>
                    <span><Check size={15} /> Sans compte</span>
                    <span><Check size={15} /> Données 100 % locales</span>
                  </div>
                </div>
                <div className="hero-console">
                  <div className="console-titlebar">
                    <div><i /><i /><i /></div>
                    <span>diagnostic.ps1</span>
                    <Activity size={15} />
                  </div>
                  <div className="console-content">
                    <p><span>PS C:\NovaTech&gt;</span> ping 8.8.8.8</p>
                    <p className="console-success">Réponse : temps=18 ms TTL=117</p>
                    <p><span>PS C:\NovaTech&gt;</span> nslookup intranet.novatech.local</p>
                    <p className="console-error">*** Le délai de la requête DNS a expiré.</p>
                    <div className="console-diagnosis">
                      <CircleAlert size={18} />
                      <div>
                        <small>HYPOTHÈSE PRIORITAIRE</small>
                        <strong>Configuration DNS du poste</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="home-stats">
                <article><strong>6</strong><span>scénarios de panne</span></article>
                <article><strong>8</strong><span>cours avec quiz</span></article>
                <article><strong>12</strong><span>commandes simulées</span></article>
                <article><strong>100</strong><span>points à obtenir</span></article>
              </section>

              <section className="feature-section">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">APPRENDRE EN FAISANT</span>
                    <h2>Une méthode complète de diagnostic</h2>
                  </div>
                  <button className="text-button" type="button" onClick={() => navigate("defis")}>
                    Voir tous les défis <ArrowRight size={16} />
                  </button>
                </div>
                <div className="feature-grid">
                  {[
                    [TerminalSquare, "Observer", "Interrogez le poste avec des commandes Windows réalistes."],
                    [Network, "Localiser", "Suivez les paquets sur une topologie interactive."],
                    [ShieldCheck, "Corriger", "Appliquez une action ciblée et mesurez son impact."],
                    [FileText, "Documenter", "Générez un rapport d’intervention prêt à imprimer."],
                  ].map(([Icon, title, text]) => {
                    const FeatureIcon = Icon as typeof TerminalSquare;
                    return (
                      <article className="feature-card" key={title as string}>
                        <div className="feature-icon"><FeatureIcon size={22} /></div>
                        <span className="feature-index">0{title === "Observer" ? 1 : title === "Localiser" ? 2 : title === "Corriger" ? 3 : 4}</span>
                        <h3>{title as string}</h3>
                        <p>{text as string}</p>
                      </article>
                    );
                  })}
                </div>
              </section>

              <section className="candidate-card">
                <div className="candidate-avatar">CM</div>
                <div className="candidate-copy">
                  <span className="eyebrow">RECHERCHE D’ALTERNANCE</span>
                  <h2>Christian Malivert · BTS SIO option SISR</h2>
                  <p>
                    Je recherche une entreprise où mettre en pratique le support, l’administration
                    système et le diagnostic réseau.
                  </p>
                </div>
                <div className="candidate-actions">
                  <a
                    className="primary-button"
                    href={profileLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ContactRound size={17} /> Me contacter sur LinkedIn
                  </a>
                  <a
                    className="secondary-button"
                    href={profileLinks.repository}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GitBranch size={17} /> Voir le code source
                  </a>
                </div>
              </section>
            </div>
          )}

          {view === "cours" && (
            <div className="page-content">
              <PageTitle
                eyebrow="ACADÉMIE NETWORKLAB"
                title="Cours réseau & quiz"
                description="Apprenez une notion, validez-la avec trois questions, puis appliquez-la dans un incident réaliste."
              />
              <CourseHub
                progress={progress.courses}
                onComplete={completeCourse}
                onLaunchScenario={(courseScenarioId) => startScenario(courseScenarioId)}
              />
            </div>
          )}

          {view === "preuves" && (
            <div className="page-content">
              <PageTitle
                eyebrow="PREUVE TECHNIQUE RÉELLE"
                title="Plan d’adressage NovaTech"
                description="Un livrable réseau documenté et téléchargeable : segmentation VLAN, sous-réseaux IPv4, passerelles, plages DHCP, affectations et règles d’isolement."
              />
              <TechnicalProofs />
            </div>
          )}

          {view === "supervision" && (
            <div className="page-content">
              <PageTitle eyebrow="CENTRE DE SUPERVISION" title="État de l’infrastructure" description="Explorez la topologie, inspectez les équipements et suivez le trajet d’un paquet." />
              <div className="status-grid">
                <StatusCard label="Équipements en ligne" value={corrected ? "11 / 11" : "9 / 11"} tone="success" icon={CircleCheck} />
                <StatusCard label="État du service" value={corrected ? "Opérationnel" : "Dégradé"} tone={corrected ? "success" : "warning"} icon={Activity} />
                <StatusCard label="Incident actif" value={scenario.shortTitle} tone="info" icon={CircleAlert} />
                <StatusCard label="Score provisoire" value={`${score.total} / 100`} tone="purple" icon={Award} />
              </div>

              <div className="supervision-layout">
                <section className="panel topology-panel">
                  <div className="panel-header">
                    <div>
                      <span className="eyebrow">CARTE RÉSEAU</span>
                      <h2>Topologie NovaTech</h2>
                    </div>
                    <div className="legend">
                      <span><i className="online" /> En ligne</span>
                      <span><i className="degraded" /> Dégradé</span>
                      <span><i className="offline" /> Hors ligne</span>
                    </div>
                  </div>
                  <NetworkTopology
                    scenario={scenario}
                    corrected={corrected}
                    selectedDeviceId={selectedDeviceId}
                    onSelectDevice={(device) => setSelectedDeviceId(device.id)}
                  />
                </section>

                <aside className="panel device-panel">
                  <div className="device-title">
                    <div className="device-icon"><Router size={23} /></div>
                    <div>
                      <span className="eyebrow">ÉQUIPEMENT SÉLECTIONNÉ</span>
                      <h2>{selectedDevice.name}</h2>
                      <p>{selectedDevice.type}</p>
                    </div>
                  </div>
                  {!corrected && scenario.affectedDeviceIds.includes(selectedDevice.id) && (
                    <div className="inline-alert warning">
                      <CircleAlert size={17} /> Anomalie potentielle détectée
                    </div>
                  )}
                  <dl className="device-details">
                    <div><dt>Adresse IP</dt><dd>{selectedDevice.ip}</dd></div>
                    <div><dt>Masque</dt><dd>{selectedDevice.mask}</dd></div>
                    <div><dt>Passerelle</dt><dd>{selectedDevice.gateway}</dd></div>
                    <div><dt>VLAN</dt><dd>{selectedDevice.vlan}</dd></div>
                    <div><dt>État</dt><dd><span className={`state-badge ${corrected ? "online" : scenario.affectedDeviceIds.includes(selectedDevice.id) ? "degraded" : selectedDevice.status}`}>{corrected ? "En ligne" : scenario.affectedDeviceIds.includes(selectedDevice.id) ? "Dégradé" : "En ligne"}</span></dd></div>
                  </dl>
                  <div className="device-section">
                    <h3>Services actifs</h3>
                    <div className="tag-list">{selectedDevice.services.map((service) => <span key={service}>{service}</span>)}</div>
                  </div>
                  <div className="device-section">
                    <h3>Connexions</h3>
                    <p>{selectedDevice.connections.map((id) => networkDevices.find((item) => item.id === id)?.name ?? id).join(" · ")}</p>
                  </div>
                </aside>
              </div>

              <PacketTrace scenario={scenario} corrected={corrected} onInspectBlockedDevice={openBlockedDevice} onValidated={validateService} />
            </div>
          )}

          {view === "defis" && (
            <div className="page-content">
              <PageTitle eyebrow="CATALOGUE D’INCIDENTS" title="Choisissez votre défi" description="Six pannes conçues pour mettre en pratique une démarche SISR structurée." />
              <div className="challenge-layout">
                <div className="challenge-grid">
                  {scenarios.map((item, index) => {
                    const itemProgress = progress.scenarios.find((entry) => entry.scenarioId === item.id);
                    const selected = item.id === scenario.id;
                    return (
                      <button className={`challenge-card ${selected ? "selected" : ""}`} type="button" key={item.id} onClick={() => selectScenario(item.id)}>
                        <div className="challenge-card-top">
                          <span className={`difficulty ${item.difficulty.toLowerCase()}`}>{item.difficulty}</span>
                          {itemProgress?.completed ? <CircleCheck className="completed-icon" size={20} /> : <span className="challenge-number">0{index + 1}</span>}
                        </div>
                        <h3>{item.shortTitle}</h3>
                        <p>{item.symptom}</p>
                        <div className="challenge-meta">
                          <span><Clock3 size={14} /> ~{item.estimatedMinutes} min</span>
                          <span>{itemProgress?.bestScore ? `${itemProgress.bestScore}/100` : "Non tenté"}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <aside className="challenge-brief panel">
                  <span className="eyebrow">BRIEF D’INCIDENT</span>
                  <h2>{scenario.title}</h2>
                  <blockquote>{scenario.testimony}</blockquote>
                  <div className="brief-block">
                    <h3>Contexte</h3>
                    <p>{scenario.context}</p>
                  </div>
                  <div className="brief-block">
                    <h3>Symptôme observé</h3>
                    <p>{scenario.symptom}</p>
                  </div>
                  <div className="brief-actions">
                    <button className="primary-button" type="button" onClick={() => startScenario(scenario.id)}>
                      <Play size={17} /> Lancer ce défi
                    </button>
                    <button className="secondary-button" type="button" onClick={() => startScenario(scenario.id, true)}>
                      Mode guidé
                    </button>
                  </div>
                </aside>
              </div>
            </div>
          )}

          {view === "terminal" && (
            <div className="page-content">
              <PageTitle
                eyebrow={recruiterMode ? "DÉMONSTRATION RECRUTEUR · ÉTAPE 2/5" : "OUTIL DE DIAGNOSTIC"}
                title="Interrogez le réseau"
                description="Les sorties changent selon la panne et les corrections déjà appliquées."
              />
              {scenarioStatus === "briefing" ? (
                <EmptyState icon={TerminalSquare} title="Le terminal attend un incident" text="Lancez le défi pour charger la configuration du poste." action="Lancer le défi" onAction={() => startScenario(scenario.id)} />
              ) : (
                <>
                  {recruiterMode && <RecruiterSteps active={2} />}
                  <div className="terminal-layout">
                    <SimulatedTerminal scenario={scenario} corrected={corrected} commands={commands} onCommand={(record) => setCommands((current) => [...current, record])} onClear={() => setCommands([])} />
                    <aside className="diagnostic-guide panel">
                      <span className="eyebrow">FIL CONDUCTEUR</span>
                      <h2>Méthode OSI</h2>
                      {[
                        ["1", "Configuration", "ipconfig /all"],
                        ["2", "Connectivité", "ping [adresse]"],
                        ["3", "Routage", "tracert / route print"],
                        ["4", "Services", "nslookup / Test-NetConnection"],
                      ].map(([number, title, command]) => (
                        <div className="guide-step" key={number}>
                          <span>{number}</span>
                          <div><strong>{title}</strong><code>{command}</code></div>
                          <ChevronRight size={16} />
                        </div>
                      ))}
                      <div className="hint-box">
                        <Lightbulb size={18} />
                        <div>
                          <strong>Indice {Math.min(hintsUsed + 1, 3)}/3</strong>
                          <p>{hintsUsed ? scenario.hints[hintsUsed - 1] : "Les indices coûtent 4 points. Utilisez-les si vous êtes bloqué."}</p>
                          <button type="button" disabled={hintsUsed >= 3} onClick={() => setHintsUsed((current) => Math.min(3, current + 1))}>
                            {hintsUsed >= 3 ? "Tous les indices révélés" : "Révéler un indice"}
                          </button>
                        </div>
                      </div>
                      <button className="secondary-button full-button" type="button" onClick={() => navigate("journaux")}>
                        <ScrollText size={16} /> Consulter les journaux
                      </button>
                    </aside>
                  </div>
                  <CorrectionPanel scenarioId={scenario.id} status={scenarioStatus} actions={scenario.actions} attempts={actions} onApply={applyAction} onPacketTest={() => navigate("supervision")} />
                </>
              )}
            </div>
          )}

          {view === "journaux" && (
            <div className="page-content">
              <PageTitle eyebrow="OBSERVABILITÉ" title="Journaux techniques" description="Filtrez les événements utiles sans vous laisser distraire par le bruit normal." />
              {scenarioStatus === "briefing" ? (
                <EmptyState icon={ScrollText} title="Aucun journal d’incident" text="Lancez un défi pour charger des événements cohérents avec la panne." action="Choisir un défi" onAction={() => navigate("defis")} />
              ) : (
                <>
                  <div className="log-toolbar panel">
                    <label>Source<select value={logSource} onChange={(event) => setLogSource(event.target.value)}><option>Toutes</option>{["Windows", "DNS", "DHCP", "Pare-feu", "Switch", "Connexion"].map((source) => <option key={source}>{source}</option>)}</select></label>
                    <label>Niveau<select value={logLevel} onChange={(event) => setLogLevel(event.target.value as LogLevel | "Tous")}><option>Tous</option><option>Information</option><option>Avertissement</option><option>Erreur</option></select></label>
                    <div className="log-count"><Activity size={16} /> {scenario.logs.filter((log) => (logSource === "Toutes" || log.source === logSource) && (logLevel === "Tous" || log.level === logLevel)).length} événements affichés</div>
                  </div>
                  <div className="log-table-wrap panel">
                    <table className="log-table">
                      <thead><tr><th>Heure</th><th>Niveau</th><th>Source</th><th>Événement</th></tr></thead>
                      <tbody>
                        {scenario.logs
                          .filter((log) => (logSource === "Toutes" || log.source === logSource) && (logLevel === "Tous" || log.level === logLevel))
                          .map((log) => (
                            <tr key={`${log.time}-${log.message}`}>
                              <td><code>{log.time}</code></td>
                              <td><span className={`log-level ${log.level.toLowerCase()}`}>{log.level}</span></td>
                              <td>{log.source}</td>
                              <td>{log.message}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <button className="primary-button" type="button" onClick={() => navigate("terminal")}><TerminalSquare size={16} /> Retourner au terminal</button>
                </>
              )}
            </div>
          )}

          {view === "resultat" && (
            <div className="page-content report-page">
              {!validated ? (
                <EmptyState icon={FileText} title="Rapport non disponible" text="Corrigez la panne et validez le trajet du paquet pour générer le rapport." action="Continuer le diagnostic" onAction={() => navigate(scenarioStatus === "briefing" ? "defis" : "terminal")} />
              ) : (
                <>
                  <section className="result-hero">
                    <div className="score-ring" style={{ "--score": `${score.total * 3.6}deg` } as React.CSSProperties}>
                      <div><strong>{score.total}</strong><span>/100</span></div>
                    </div>
                    <div>
                      <span className="eyebrow">INCIDENT RÉSOLU</span>
                      <h1>{score.total >= 85 ? "Excellent diagnostic !" : score.total >= 65 ? "Intervention réussie" : "Service rétabli"}</h1>
                      <p>{scenario.explanation}</p>
                      <div className="result-meta"><span><Clock3 size={15} /> {formatDuration(durationSeconds)}</span><span><TerminalSquare size={15} /> {commands.length} commandes</span><span><Lightbulb size={15} /> {hintsUsed} indice(s)</span></div>
                    </div>
                  </section>
                  <div className="score-breakdown">
                    {[["Diagnostic", score.diagnostic, 40], ["Correction", score.correction, 30], ["Validation", score.validation, 15], ["Méthode", score.method, 15]].map(([label, value, max]) => (
                      <article key={label as string}><span>{label as string}</span><strong>{value as number}<small>/{max as number}</small></strong></article>
                    ))}
                    <article className="penalty"><span>Pénalités</span><strong>-{score.penalties}</strong></article>
                  </div>
                  <article className="intervention-report panel">
                    <div className="report-header">
                      <div><span className="eyebrow">DOCUMENTATION</span><h2>Rapport d’intervention</h2></div>
                      <div><button className="secondary-button" type="button" onClick={copyReport}>{copiedReport ? <Check size={16} /> : <Clipboard size={16} />}{copiedReport ? "Copié" : "Copier"}</button><button className="primary-button" type="button" onClick={() => window.print()}><FileText size={16} /> Imprimer ou enregistrer en PDF</button></div>
                    </div>
                    <dl className="report-grid">
                      <div><dt>Scénario</dt><dd>{scenario.shortTitle}</dd></div><div><dt>Technicien</dt><dd>Christian Malivert</dd></div>
                      <div><dt>Équipement concerné</dt><dd>{scenario.affectedDeviceIds.map((id) => networkDevices.find((item) => item.id === id)?.name).join(", ")}</dd></div><div><dt>Temps de résolution</dt><dd>{formatDuration(durationSeconds)}</dd></div>
                      <div className="wide"><dt>Symptôme</dt><dd>{scenario.symptom}</dd></div><div className="wide"><dt>Cause identifiée</dt><dd>{scenario.cause}</dd></div>
                      <div className="wide"><dt>Correction appliquée</dt><dd>{actions.find((action) => action.correct)?.label}</dd></div>
                    </dl>
                    <div className="report-columns">
                      <div><h3>Commandes exécutées</h3><ul>{commands.map((item, index) => <li key={`${item.command}-${index}`}><code>{item.command}</code>{item.useful && <Check size={14} />}</li>)}</ul></div>
                      <div><h3>Mesures préventives</h3><ul>{scenario.prevention.map((item) => <li key={item}><ShieldCheck size={15} />{item}</li>)}</ul></div>
                    </div>
                  </article>
                  <div className="next-actions"><button className="secondary-button" type="button" onClick={() => startScenario(scenario.id)}><RotateCcw size={16} /> Recommencer</button><button className="primary-button" type="button" onClick={() => navigate("defis")}>Choisir un autre défi <ArrowRight size={16} /></button></div>
                </>
              )}
            </div>
          )}

          {view === "progression" && (
            <div className="page-content">
              <PageTitle eyebrow="PROGRESSION LOCALE" title="Votre parcours NetworkLab" description="Vos résultats sont conservés uniquement dans ce navigateur." />
              <div className="progress-summary">
                <StatusCard label="Scénarios terminés" value={`${completedCount} / 6`} tone="success" icon={CircleCheck} />
                <StatusCard label="Cours validés" value={`${completedCourseCount} / ${networkCourses.length}`} tone="info" icon={BookOpenCheck} />
                <StatusCard label="Moyenne défis" value={`${bestAverage} / 100`} tone="purple" icon={Award} />
                <StatusCard label="Moyenne quiz" value={`${courseAverage} / 100`} tone="info" icon={BrainCircuit} />
              </div>
              <section className="panel progress-list">
                <div className="panel-header"><div><span className="eyebrow">MAÎTRISE PAR INCIDENT</span><h2>Résultats détaillés</h2></div></div>
                {scenarios.map((item) => {
                  const itemProgress = progress.scenarios.find((entry) => entry.scenarioId === item.id);
                  return (
                    <div className="progress-row" key={item.id}>
                      <div className={`progress-status ${itemProgress?.completed ? "done" : ""}`}>{itemProgress?.completed ? <Check size={16} /> : <span />}</div>
                      <div className="progress-name"><strong>{item.shortTitle}</strong><span>{item.difficulty}</span></div>
                      <div className="progress-bar"><i style={{ width: `${itemProgress?.bestScore ?? 0}%` }} /></div>
                      <strong>{itemProgress?.bestScore ?? 0}/100</strong>
                      <span>{itemProgress?.attempts ?? 0} tentative(s)</span>
                      <button type="button" onClick={() => startScenario(item.id)} aria-label={`Lancer ${item.shortTitle}`}><Play size={15} /></button>
                    </div>
                  );
                })}
              </section>
              <section className="panel progress-list course-progress-list">
                <div className="panel-header">
                  <div><span className="eyebrow">MAÎTRISE DES COURS</span><h2>Quiz et notions validées</h2></div>
                  <button className="text-button" type="button" onClick={() => navigate("cours")}>
                    Continuer les cours <ArrowRight size={16} />
                  </button>
                </div>
                {networkCourses.map((course) => {
                  const itemProgress = progress.courses.find((entry) => entry.courseId === course.id);
                  return (
                    <div className="progress-row" key={course.id}>
                      <div className={`progress-status ${itemProgress?.completed ? "done" : ""}`}>{itemProgress?.completed ? <Check size={16} /> : <span />}</div>
                      <div className="progress-name"><strong>{course.shortTitle}</strong><span>{course.level}</span></div>
                      <div className="progress-bar"><i style={{ width: `${itemProgress?.bestScore ?? 0}%` }} /></div>
                      <strong>{itemProgress?.bestScore ?? 0}/100</strong>
                      <span>{itemProgress?.attempts ?? 0} tentative(s)</span>
                      <button type="button" onClick={() => navigate("cours")} aria-label={`Ouvrir ${course.shortTitle}`}><BookOpenCheck size={15} /></button>
                    </div>
                  );
                })}
              </section>
            </div>
          )}

          {view === "competences" && (
            <div className="page-content">
              <PageTitle eyebrow="PORTFOLIO BTS SIO SISR" title="Compétences démontrées" description="Chaque fonctionnalité relie une situation professionnelle à une preuve concrète." />
              <div className="skills-grid">
                {[
                  [Activity, "Répondre aux incidents", "Qualifier un symptôme, formuler des hypothèses et rétablir le service.", "Terminal, indices, historique"],
                  [Network, "Exploiter un réseau IP", "Diagnostiquer TCP/IP, DNS, DHCP, VLAN, routage et pare-feu.", "6 scénarios, topologie"],
                  [Router, "Mettre à disposition un service", "Valider la disponibilité par des tests de bout en bout.", "Trajet du paquet"],
                  [ShieldCheck, "Sécuriser l’infrastructure", "Appliquer une règle ciblée selon le moindre privilège.", "Scénario pare-feu"],
                  [FileText, "Documenter une intervention", "Tracer commandes, cause, correction, validation et prévention.", "Rapport imprimable"],
                  [Code2, "Travailler en mode projet", "Structurer données, moteur réseau, tests et interface responsive.", "Architecture TypeScript"],
                  [BookOpenCheck, "Développer son parcours", "Présenter une démarche technique claire à un recruteur.", "Mode recruteur"],
                ].map(([Icon, title, description, proof]) => {
                  const SkillIcon = Icon as typeof Activity;
                  return (
                    <article className="skill-card" key={title as string}>
                      <div className="skill-icon"><SkillIcon size={24} /></div>
                      <h2>{title as string}</h2><p>{description as string}</p><span>Preuve : {proof as string}</span>
                    </article>
                  );
                })}
              </div>
              <section className="competence-callout">
                <GraduationCap size={34} />
                <div><span className="eyebrow">RÉALISATION PERSONNELLE</span><h2>Un projet pensé pour rendre la méthode visible</h2><p>Le score récompense la pertinence des tests et la qualité de la démarche, pas uniquement la vitesse.</p></div>
                <button className="primary-button" type="button" onClick={() => startScenario("dns-incorrect", true)}>Tester le parcours recruteur <ArrowRight size={16} /></button>
              </section>
            </div>
          )}

          {view === "a-propos" && (
            <div className="page-content about-page">
              <PageTitle eyebrow="À PROPOS DU PROJET" title="NovaTech NetworkLab" description="Un simulateur de diagnostic réseau créé par Christian Malivert pour démontrer ses compétences BTS SIO SISR." />
              <section className="about-hero panel">
                <div><span className="eyebrow">LE PROBLÈME</span><h2>Montrer une compétence réseau, pas seulement en parler</h2><p>Un CV affirme des compétences. NetworkLab les rend observables : le visiteur suit la même démarche qu’un technicien face à une panne réelle, de l’analyse au rapport final.</p></div>
                <div className="about-flow">{["Observer", "Tester", "Isoler", "Corriger", "Valider"].map((item, index) => <span key={item}><i>{index + 1}</i>{item}</span>)}</div>
              </section>
              <div className="about-grid">
                <article className="panel"><Code2 size={24} /><h2>Choix techniques</h2><p>Next.js App Router, React, TypeScript strict, React Flow, Lucide et CSS personnalisé. Aucune base de données, aucun compte, aucune clé API.</p></article>
                <article className="panel"><Laptop size={24} /><h2>Fonctionnement local</h2><p>Les cours et scénarios sont versionnés dans le code. La progression, les scores et les préférences restent dans localStorage.</p></article>
                <article className="panel"><CircleAlert size={24} /><h2>Limites assumées</h2><p>Les commandes et paquets sont simulés : aucun trafic réel n’est envoyé et aucune infrastructure externe n’est nécessaire.</p></article>
                <article className="panel"><Sparkles size={24} /><h2>Améliorations futures</h2><p>Éditeur de scénarios, mode chronométré en équipe, davantage de protocoles et export de progression multiappareil.</p></article>
              </div>
              <section className="recruiter-cta">
                <div><span className="eyebrow">VOUS RECRUTEZ UN ALTERNANT ?</span><h2>Évaluez ma démarche en moins de 2 minutes.</h2><p>Ping, nslookup, trajet du paquet, correction DNS, score et rapport.</p></div>
                <button className="primary-button hero-button" type="button" onClick={() => startScenario("dns-incorrect", true)}><Play size={18} /> Tester la démonstration recruteur</button>
              </section>
              <section className="contact-panel panel">
                <div>
                  <span className="eyebrow">CONTACT & CODE SOURCE</span>
                  <h2>Échangeons sur une alternance SISR</h2>
                  <p>
                    Retrouvez mon parcours sur LinkedIn et inspectez l’intégralité du projet sur GitHub.
                  </p>
                </div>
                <div className="contact-links">
                  <a
                    className="primary-button"
                    href={profileLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ContactRound size={17} /> LinkedIn <ExternalLink size={14} />
                  </a>
                  <a
                    className="secondary-button"
                    href={profileLinks.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GitBranch size={17} /> GitHub <ExternalLink size={14} />
                  </a>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function PageTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="page-title"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>;
}

function StatusCard({ label, value, tone, icon: Icon }: { label: string; value: string; tone: string; icon: typeof Activity }) {
  return <article className={`status-card ${tone}`}><div><span>{label}</span><strong>{value}</strong></div><Icon size={22} /></article>;
}

function EmptyState({ icon: Icon, title, text, action, onAction }: { icon: typeof Activity; title: string; text: string; action: string; onAction: () => void }) {
  return <section className="empty-state panel"><div><Icon size={30} /></div><h2>{title}</h2><p>{text}</p><button className="primary-button" type="button" onClick={onAction}>{action}<ArrowRight size={16} /></button></section>;
}

function RecruiterSteps({ active }: { active: number }) {
  return <div className="recruiter-steps">{["Incident", "Tests", "Trajet", "Correction", "Rapport"].map((item, index) => <div className={index + 1 <= active ? "active" : ""} key={item}><span>{index + 1 <= active ? <Check size={13} /> : index + 1}</span>{item}</div>)}</div>;
}

function CorrectionPanel({
  scenarioId,
  status,
  actions,
  attempts,
  onApply,
  onPacketTest,
}: {
  scenarioId: string;
  status: ScenarioStatus;
  actions: Array<{ id: string; label: string; description: string }>;
  attempts: ActionRecord[];
  onApply: (id: string, label: string) => void;
  onPacketTest: () => void;
}) {
  const corrected = status === "corrected" || status === "validated";
  return (
    <section className="correction-panel panel">
      <div className="section-heading compact"><div><span className="eyebrow">RESTAURATION DU SERVICE</span><h2>Actions de correction</h2></div><span className="scenario-ref">{scenarioId}</span></div>
      {corrected && <div className="inline-alert success"><CircleCheck size={18} /><span>Bonne correction appliquée. Vérifiez maintenant le trajet du paquet.</span><button type="button" onClick={onPacketTest}>Tester le service</button></div>}
      <div className="action-grid">
        {actions.map((action) => {
          const latest = [...attempts].reverse().find((attempt) => attempt.actionId === action.id);
          return (
            <button className={`action-card ${latest?.correct ? "correct" : latest ? "wrong" : ""}`} type="button" key={action.id} onClick={() => onApply(action.id, action.label)} disabled={corrected}>
              <span>{latest?.correct ? <Check size={17} /> : latest ? <X size={17} /> : <Zap size={17} />}</span>
              <div><strong>{action.label}</strong><p>{action.description}</p></div>
            </button>
          );
        })}
      </div>
      {attempts.some((attempt) => !attempt.correct) && !corrected && <p className="action-feedback"><CircleAlert size={15} /> Cette action ne traite pas la cause observée. Reprenez les résultats du diagnostic.</p>}
    </section>
  );
}
