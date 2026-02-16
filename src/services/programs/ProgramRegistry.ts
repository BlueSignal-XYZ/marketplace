/**
 * ProgramRegistry — central registry of all trading programs.
 * New programs register here. Frontend and backend look up programs by ID.
 */

import type { ProgramService } from './ProgramService';
import { VirginiaNceProgram } from './VirginiaNceProgram';

// ── Registry ──────────────────────────────────────────────

const programs = new Map<string, ProgramService>();

function register(program: ProgramService): void {
  programs.set(program.metadata.id, program);
}

/**
 * Get a specific program by ID.
 */
export function getProgram(id: string): ProgramService | undefined {
  return programs.get(id);
}

/**
 * Get all registered programs.
 */
export function getAllPrograms(): ProgramService[] {
  return Array.from(programs.values());
}

/**
 * Get only active programs.
 */
export function getActivePrograms(): ProgramService[] {
  return getAllPrograms().filter((p) => p.metadata.active);
}

/**
 * Get programs that support a given nutrient type.
 */
export function getProgramsByNutrient(
  nutrientType: 'nitrogen' | 'phosphorus' | 'combined'
): ProgramService[] {
  return getActivePrograms().filter((p) =>
    p.metadata.supportedNutrients.includes(nutrientType)
  );
}

// ── Register built-in programs ────────────────────────────

register(new VirginiaNceProgram());

// Future programs:
// register(new ChesapeakeBayProgram());
// register(new PennsylvaniaNutrientProgram());
// register(new MarylandWaterQualityProgram());
