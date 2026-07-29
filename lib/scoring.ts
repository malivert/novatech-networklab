import type { ActionRecord, CommandRecord, ScoreBreakdown } from "@/types/network";

export interface ScoreInput {
  commands: CommandRecord[];
  actions: ActionRecord[];
  hintsUsed: number;
  validated: boolean;
  durationSeconds: number;
  expectedCommands: string[];
}

function normalize(command: string) {
  return command.trim().toLowerCase().replace(/\s+/g, " ");
}

export function calculateScore(input: ScoreInput): ScoreBreakdown {
  const used = new Set(input.commands.map((record) => normalize(record.command)));
  const expected = input.expectedCommands.map(normalize);
  const relevantCount = expected.filter((command) =>
    [...used].some((candidate) => candidate === command || candidate.startsWith(command)),
  ).length;

  const diagnostic = Math.round(40 * Math.min(1, relevantCount / Math.max(2, expected.length)));
  const correction = input.actions.some((action) => action.correct) ? 30 : 0;
  const validation = input.validated ? 15 : 0;
  const logicalSequence = relevantCount >= 2 && input.actions.some((action) => action.correct);
  const method = logicalSequence ? 15 : relevantCount > 0 ? 8 : 0;
  const wrongActions = input.actions.filter((action) => !action.correct).length;
  const repeatedCommands = Math.max(0, input.commands.length - new Set(input.commands.map((item) => normalize(item.command))).size);
  const slowPenalty = input.durationSeconds > 900 ? 3 : 0;
  const penalties = Math.min(35, input.hintsUsed * 4 + wrongActions * 7 + repeatedCommands * 2 + slowPenalty);
  const total = Math.max(0, Math.min(100, diagnostic + correction + validation + method - penalties));

  return { diagnostic, correction, validation, method, penalties, total };
}

