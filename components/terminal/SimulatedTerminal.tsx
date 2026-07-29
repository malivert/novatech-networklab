"use client";

import { Check, Clipboard, RotateCcw, TerminalSquare, Trash2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { executeCommand } from "@/lib/terminal";
import type { CommandRecord, Scenario } from "@/types/network";

interface SimulatedTerminalProps {
  scenario: Scenario;
  corrected: boolean;
  commands: CommandRecord[];
  onCommand: (record: CommandRecord) => void;
  onClear: () => void;
}

const suggestions = [
  "help",
  "ipconfig",
  "ipconfig /all",
  "ipconfig /renew",
  "ping 8.8.8.8",
  "nslookup intranet.novatech.local",
  "tracert 10.50.0.20",
  "arp -a",
  "route print",
  "netstat -an",
  "Test-NetConnection 10.50.0.20 -Port 445",
];

export function SimulatedTerminal({
  scenario,
  corrected,
  commands,
  onCommand,
  onClear,
}: SimulatedTerminalProps) {
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const outputText = useMemo(
    () => commands.map((record) => `PS C:\\NovaTech> ${record.command}\n${record.output}`).join("\n\n"),
    [commands],
  );

  function runCommand(raw: string) {
    const command = raw.trim();
    if (!command) return;
    if (command.toLowerCase() === "clear") {
      onClear();
      setInput("");
      return;
    }
    const result = executeCommand(command, { scenario, corrected });
    onCommand({
      command,
      output: result.output,
      useful: result.useful,
      timestamp: new Date().toISOString(),
    });
    setInput("");
    setHistoryIndex(-1);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      runCommand(input);
    }
    if (event.key === "ArrowUp" && commands.length) {
      event.preventDefault();
      const nextIndex = Math.min(commands.length - 1, historyIndex + 1);
      setHistoryIndex(nextIndex);
      setInput(commands[commands.length - 1 - nextIndex].command);
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setInput(nextIndex < 0 ? "" : commands[commands.length - 1 - nextIndex].command);
    }
    if (event.key === "Tab") {
      const matches = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().startsWith(input.toLowerCase()),
      );
      if (matches.length === 1) {
        event.preventDefault();
        setInput(matches[0]);
      }
    }
  }

  async function copyOutput() {
    if (!outputText) return;
    await navigator.clipboard?.writeText(outputText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="terminal-card" aria-labelledby="terminal-title">
      <div className="terminal-toolbar">
        <div>
          <span className="eyebrow">POSTE ACTIF · {scenario.workstationId.toUpperCase()}</span>
          <h2 id="terminal-title">
            <TerminalSquare size={20} aria-hidden="true" />
            Terminal de diagnostic
          </h2>
        </div>
        <div className="toolbar-actions">
          <button className="icon-button" type="button" onClick={copyOutput} aria-label="Copier la sortie">
            {copied ? <Check size={17} /> : <Clipboard size={17} />}
          </button>
          <button className="icon-button" type="button" onClick={onClear} aria-label="Effacer le terminal">
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      <div className="terminal-screen" onClick={() => inputRef.current?.focus()}>
        <p className="terminal-welcome">
          NovaTech Windows PowerShell Simulator v1.0
          <br />
          Incident chargé : {scenario.shortTitle}. Saisissez <strong>help</strong> pour commencer.
        </p>
        {commands.map((record, index) => (
          <div className="terminal-entry" key={`${record.timestamp}-${index}`}>
            <p>
              <span>PS C:\NovaTech&gt;</span> {record.command}
            </p>
            <pre>{record.output}</pre>
          </div>
        ))}
        <label className="terminal-input-row">
          <span>PS C:\NovaTech&gt;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Commande PowerShell simulée"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </label>
      </div>

      <div className="terminal-helpbar">
        <span>Entrée pour exécuter</span>
        <span>↑ ↓ historique</span>
        <span>Tab autocomplétion</span>
        <button type="button" onClick={() => runCommand("help")}>
          <RotateCcw size={14} /> Afficher l’aide
        </button>
      </div>
    </section>
  );
}

