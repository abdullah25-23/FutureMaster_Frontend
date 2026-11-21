import { Career, careerAlignment, careers, clusters, fitLabel, readinessFor } from './careers';
import { videoById } from './videos';
import { dimensionMeta } from './content';
import { DimensionKey, Fit, InterestDimensions, Readiness, StudentProfile } from '../types';
import { areaForCareer, careerTags, ExplorationSignal } from './exploration';

export interface Recommendation {
  career: Career; clusterName: string; clusterColor: string; score: number;
  interestMatch: Fit; readiness: Readiness; readinessLabel: string; readinessSummary: string; why: string;
}

// Prototype heuristic: an area is "overwhelmingly" stronger when its 3rd career still beats the best alternative by this margin.
const OVERWHELMING_GAP = 15;
const MAX_PER_AREA = 2;

export const readinessDisplay = (r: Readiness) => (r === 'Result unavailable' ? 'Academic Information Pending' : r);

/** Dimension fit dominates. Starting preferences and videos are bounded supporting signals; marks never enter interest ranking. */
export function interestScore(c: Career, dims: InterestDimensions, videoFeedback: Record<string, number>, profile: StudentProfile, signals: ExplorationSignal[] = []) {
  let bonus = 0;
  for (const [id, rating] of Object.entries(videoFeedback)) {
    const v = videoById(id);
    if (!v || rating < 4) continue;
    if (v.careerIds?.includes(c.id)) bonus += rating === 5 ? 2 : 1;
    else if (v.clusterId === c.clusterId) bonus += 0.5;
  }
  const area = areaForCareer(c);
  const preference = area ? profile.generalInterests.indexOf(area) : -1;
  const prior = preference === 0 ? 1.5 : preference === 1 ? 0.75 : 0;
  const observed = signals.filter(s => s.source !== 'video' && s.strength > 0);
  const areaSupport = Math.min(4, observed.filter(s => area && s.areas.includes(area)).length);
  const tags = careerTags[c.id] ?? [];
  const taskSupport = Math.min(8, observed.reduce((n, s) => n + s.tags.filter(t => tags.includes(t)).length * (s.source === 'activity' ? 0.75 : 1.5), 0));
  const recentTags = observed.slice(-8).flatMap(s => s.tags);
  const contrast = ['doctor', 'pediatrician'].includes(c.id)
    ? (recentTags.includes('less-patient-contact') ? 5 : 0) + (recentTags.includes('calm-setting') ? 2 : 0) : 0;
  return Math.max(0, Math.min(100, careerAlignment(c, dims) + prior + areaSupport + taskSupport + Math.min(3, bonus) - contrast));
}

function whyText(c: Career, dims: InterestDimensions) {
  const keys = (Object.entries(c.weights) as [DimensionKey, number][])
    .sort((a, b) => b[1] * dims[b[0]] - a[1] * dims[a[0]])
    .slice(0, 2).map(([k]) => dimensionMeta[k].label);
  return `Your ${keys[0]}${keys[1] ? ` and ${keys[1]}` : ''} align well with this career.`;
}

export function recommendCareers(dims: InterestDimensions, videoFeedback: Record<string, number>, profile: StudentProfile, signals: ExplorationSignal[] = []): Recommendation[] {
  const ranked = careers.map(c => ({ c, s: interestScore(c, dims, videoFeedback, profile, signals) })).sort((a, b) => b.s - a.s);
  // Diversity: at most two careers per area, unless one area is overwhelmingly stronger.
  const diverse: typeof ranked = [];
  const count: Record<string, number> = {};
  for (const r of ranked) {
    const area = areaForCareer(r.c) ?? r.c.clusterId;
    if ((count[area] ?? 0) >= MAX_PER_AREA) continue;
    diverse.push(r); count[area] = (count[area] ?? 0) + 1;
    if (diverse.length === 3) break;
  }
  const naive = ranked.slice(0, 3);
  const sameArea = naive.every(r => (areaForCareer(r.c) ?? r.c.clusterId) === (areaForCareer(naive[0].c) ?? naive[0].c.clusterId));
  const pick = sameArea && naive[2].s - diverse[2].s >= OVERWHELMING_GAP ? naive : diverse;
  return pick.map(({ c, s }) => {
    const cl = clusters.find(x => x.id === c.clusterId);
    const r = readinessFor(c, profile);
    return {
      career: c, clusterName: cl?.name ?? '', clusterColor: cl?.color ?? '#00D2FF', score: Math.round(s),
      interestMatch: fitLabel(s), readiness: r.readiness, readinessLabel: readinessDisplay(r.readiness), readinessSummary: r.summary, why: whyText(c, dims),
    };
  });
}
