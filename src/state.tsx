import { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { DimensionKey, InterestDimensions, NavParams, QuestionOption, Screen, StudentProfile } from './types';
import { pickQuestion, Question, VideoFollowUp } from './data/questions';
import { videoById, videoTags } from './data/videos';
import { AreaInterest, areaForCluster, ExplorationSignal, rankAreas } from './data/exploration';
import { activityById } from './data/activities';
import { primaryDestinationFor } from './data/content';

export const SESSION_LENGTH = 4;
export const MIN_SESSIONS = 3;
export interface ResponseLog { questionId: string; optionLabel: string | null; session: number }

const emptyProfile: StudentProfile = {
  name: '', email: '', age: '', schoolName: '', studyGroup: '',
  favouriteSubjects: [], difficultSubjects: [], subjectMarks: {}, overallPercentage: '', academicResultType: '', academicResultStatus: '', academicYear: '', resultSubjects: [], assessmentSource: '', priorAcademic: null,
  futureIdeas: '', futureFields: [], activities: [], careerGoal: '',
  generalInterests: [],
};

const dimKeys: DimensionKey[] = ['analyticalThinking', 'technologyInterest', 'creativity', 'helpingPeople', 'leadership', 'communication', 'handsOnWork', 'researchInterest', 'businessInterest'];
const baseDims = (): InterestDimensions => Object.fromEntries(dimKeys.map(k => [k, 30])) as InterestDimensions;
const zeroEvidence = () => Object.fromEntries(dimKeys.map(k => [k, 0])) as Record<DimensionKey, number>;

interface Entry { screen: Screen; params: NavParams }

export interface AppCtx {
  screen: Screen; params: NavParams;
  nav: (s: Screen, p?: NavParams) => void;
  back: () => void;
  go: (s: Screen, p?: NavParams) => void;
  loadNav: (message: string, s: Screen, p?: NavParams) => void;
  loading: string | null;
  canGoBack: boolean;

  profile: StudentProfile; updateProfile: (p: Partial<StudentProfile>) => void;
  displayName: string; firstName: string;
  responses: ResponseLog[];
  profileStability: number; evidenceCoverage: number; unresolvedContradictions: number;
  recommendationsReady: boolean; unclearDims: DimensionKey[];
  signUp: (name: string, email: string) => void;
  logIn: (email: string) => void;
  googleLogin: () => void;
  logout: () => void;

  dims: InterestDimensions; topDims: Array<{ key: DimensionKey; value: number }>;
  areaInterests: AreaInterest[]; explorationSignals: ExplorationSignal[];
  questionsAnswered: number; profileConfidence: number;
  sessionsCompleted: number; sessionAnswered: number; currentSession: number;
  profileReady: boolean; lastReadyCheck: 'none' | 'ready' | 'more';
  currentQuestion: { question: Question; note?: string };
  answerQuestion: (q: Question, opt: QuestionOption | null) => void;
  finishSession: () => 'ready' | 'more';
  startNextSession: () => void;

  completedActivities: string[]; completeActivity: (id: string, answers?: number[]) => void;
  videoFeedback: Record<string, number>; rateVideo: (id: string, rating: number) => void;
  savedCareers: string[]; toggleCareer: (id: string) => void;
  savedDegrees: string[]; toggleDegree: (id: string) => void;
  exploredClusters: string[]; exploreCluster: (id: string) => void;
  factIndex: number; nextFact: () => void;
}

const g = globalThis as unknown as { __fmCtx?: React.Context<AppCtx | null> };
const Ctx = (g.__fmCtx ??= createContext<AppCtx | null>(null));
export const useApp = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp outside provider');
  return c;
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Entry[]>([{ screen: 'splash', params: {} }]);
  const [loading, setLoading] = useState<string | null>(null);
  const [profile, setProfile] = useState<StudentProfile>(emptyProfile);
  const [dims, setDims] = useState<InterestDimensions>(baseDims());
  const [evidence, setEvidence] = useState(zeroEvidence());
  const [askedIds, setAskedIds] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [explorationSignals, setSignals] = useState<ExplorationSignal[]>([]);
  const [pendingVideo, setPendingVideo] = useState<VideoFollowUp | null>(null);
  const [questionsAnswered, setQA] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [sessionsCompleted, setSessions] = useState(0);
  const [sessionAnswered, setSessionAnswered] = useState(0);
  const [profileReady, setReady] = useState(false);
  const [lastReadyCheck, setLastCheck] = useState<'none' | 'ready' | 'more'>('none');
  const [completedActivities, setActs] = useState<string[]>([]);
  const [videoFeedback, setVF] = useState<Record<string, number>>({});
  const [savedCareers, setSC] = useState<string[]>([]);
  const [savedDegrees, setSD] = useState<string[]>([]);
  const [exploredClusters, setEC] = useState<string[]>([]);
  const [factIndex, setFact] = useState(0);
  const [responses, setResponses] = useState<ResponseLog[]>([]);
  const [metrics, setMetrics] = useState({ stability: 0, coverage: 0, contradictions: 0 });
  const dimsRef = useRef(dims); const evRef = useRef(evidence); const confRef = useRef(confidence);
  const snapsRef = useRef<InterestDimensions[]>([]);
  const sessionsRef = useRef(0);
  const tagsRef = useRef<string[]>([]);
  const answeredRef = useRef(0);
  const completedRef = useRef<string[]>([]);
  const videoRef = useRef<Record<string, number>>({});

  const cur = stack[stack.length - 1];
  const nav = useCallback((screen: Screen, params: NavParams = {}) => setStack(s => [...s, { screen, params }]), []);
  const back = useCallback(() => setStack(s => (s.length > 1 ? s.slice(0, -1) : s)), []);
  const go = useCallback((screen: Screen, params: NavParams = {}) => setStack(
    ['dashboard', 'explore', 'journey', 'profile', 'splash', 'login', 'signup', 'setup'].includes(screen)
      ? [{ screen, params }]
      : [{ screen: primaryDestinationFor(screen), params: {} }, { screen, params }]), []);
  const loadNav = useCallback((message: string, screen: Screen, params: NavParams = {}) => {
    setLoading(message);
    setTimeout(() => { setLoading(null); nav(screen, params); }, 800);
  }, [nav]);

  const updateProfile = (p: Partial<StudentProfile>) => setProfile(prev => ({ ...prev, ...p }));

  const signUp = (name: string, email: string) => { setProfile(p => ({ ...p, name: name.trim(), email: email.trim() })); };
  const logIn = (email: string) => {
    setProfile(p => {
      if (p.name) return { ...p, email: p.email || email.trim() };
      const prefix = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
      const name = prefix ? prefix.replace(/\b\w/g, c => c.toUpperCase()) : 'Student';
      return { ...p, name, email: email.trim() };
    });
  };
  const googleLogin = () => setProfile(p => ({ ...p, name: p.name || 'Ayesha Khan', email: p.email || 'ayesha.khan@gmail.com' }));

  const logout = () => {
    setProfile(emptyProfile); setDims(baseDims()); setEvidence(zeroEvidence()); setAskedIds([]); setTags([]); setSignals([]); setPendingVideo(null);
    setQA(0); setConfidence(0); setSessions(0); setSessionAnswered(0); setReady(false); setLastCheck('none');
    setActs([]); setVF({}); setSC([]); setSD([]); setEC([]); setFact(0);
    setStack([{ screen: 'login', params: {} }]);
    setResponses([]); setMetrics({ stability: 0, coverage: 0, contradictions: 0 });
    dimsRef.current = baseDims(); evRef.current = zeroEvidence(); confRef.current = 0; snapsRef.current = []; sessionsRef.current = 0; tagsRef.current = [];
    answeredRef.current = 0; completedRef.current = []; videoRef.current = {};
  };

  const areaInterests = useMemo(() => rankAreas(profile, dims, explorationSignals), [profile, dims, explorationSignals]);
  const currentQuestion = useMemo(() => pickQuestion({ askedIds, tags, evidence, dims, directions: areaInterests.map(a => a.id), generalInterests: profile.generalInterests, pendingVideo }), [askedIds, tags, evidence, dims, areaInterests, profile.generalInterests, pendingVideo]);

  const applyOption = (opt: QuestionOption, scale = 1, countEvidence = true) => {
    const nd = { ...dimsRef.current }; const ne = { ...evRef.current };
    for (const [k, v] of Object.entries(opt.effects) as [DimensionKey, number][]) {
      nd[k] = Math.max(0, Math.min(96, nd[k] + Math.round(v * scale)));
      if (countEvidence && v > 0) ne[k] += 1;
    }
    dimsRef.current = nd; setDims(nd); evRef.current = ne; setEvidence(ne);
    const discovered = [...(opt.tags ?? []), ...(opt.tag ? [opt.tag] : [])];
    tagsRef.current = [...tagsRef.current, ...discovered]; setTags(tagsRef.current);
  };

  const answerQuestion = (q: Question, opt: QuestionOption | null) => {
    if (answeredRef.current >= SESSION_LENGTH) return;
    const session = sessionsRef.current + 1;
    setAskedIds(a => [...a, q.id]);
    setQA(n => n + 1);
    answeredRef.current += 1; setSessionAnswered(answeredRef.current);
    if (q.id.startsWith('feedback-')) setPendingVideo(null);
    setResponses(r => [...r, { questionId: q.id, optionLabel: opt ? opt.label : null, session }]);
    if (opt) {
      applyOption(opt);
      setSignals(s => [...s, { id: `question-${session}-${q.id}`, source: 'question', session, effects: opt.effects, areas: opt.areas ?? [], tags: [...(opt.tags ?? []), ...(opt.tag ? [opt.tag] : [])], strength: 4 }]);
    }
    confRef.current = Math.min(95, confRef.current + (opt ? 6 : 1)); setConfidence(confRef.current);
  };

  const finishSession = () => {
    // Only a full exploration session advances progress.
    if (answeredRef.current < SESSION_LENGTH) return 'more' as const;
    const done = sessionsRef.current + 1;
    sessionsRef.current = done; setSessions(done);
    setSessionAnswered(0);
    answeredRef.current = 0;
    const snaps = [...snapsRef.current, { ...dimsRef.current }];
    snapsRef.current = snaps;
    const top = (d: InterestDimensions, n: number) => (Object.entries(d) as [DimensionKey, number][]).sort((a, b) => b[1] - a[1]).slice(0, n).map(x => x[0]);
    const bottom = (d: InterestDimensions, n: number) => (Object.entries(d) as [DimensionKey, number][]).sort((a, b) => a[1] - b[1]).slice(0, n).map(x => x[0]);
    let stability = 0; let contradictions = 0;
    if (snaps.length >= 2) {
      const a = snaps[snaps.length - 2]; const b = snaps[snaps.length - 1];
      const ta = top(a, 3); const tb = top(b, 3);
      const overlap = ta.filter(k => tb.includes(k)).length / 3;
      const drift = dimKeys.reduce((s, k) => s + Math.abs(a[k] - b[k]), 0) / dimKeys.length;
      stability = Math.max(0, Math.min(1, overlap * 0.7 + Math.max(0, 1 - drift / 12) * 0.3));
      const first = snaps[0]; const bt = bottom(b, 3);
      contradictions = top(first, 3).filter(k => bt.includes(k) && evRef.current[k] >= 2).length;
    }
    const coverage = dimKeys.filter(k => evRef.current[k] >= 2).length / dimKeys.length;
    setMetrics({ stability, coverage, contradictions });
    const strong = done >= MIN_SESSIONS && confRef.current >= 60 && stability >= 0.6 && coverage >= 0.55 && contradictions === 0;
    const ready = strong;
    setReady(ready);
    setLastCheck(done < MIN_SESSIONS ? 'none' : ready ? 'ready' : 'more');
    return ready ? 'ready' as const : 'more' as const;
  };
  const startNextSession = () => { if (!answeredRef.current) setSessionAnswered(0); };

  const completeActivity = (id: string, answers: number[] = []) => {
    const activity = activityById(id);
    if (!activity || completedRef.current.includes(id) || answers.length !== activity.steps.length) return;
    completedRef.current = [...completedRef.current, id]; setActs(completedRef.current);
    confRef.current = Math.min(95, confRef.current + 3); setConfidence(confRef.current);
    activity.steps.forEach((step, i) => {
      const opt = step.signals?.[answers[i]];
      if (opt) {
        applyOption(opt, 0.3);
        setSignals(s => [...s, { id: `activity-${id}-${i}`, source: 'activity', areas: opt.areas ?? [], tags: opt.tags ?? [], strength: 2 }]);
      }
    });
    if (!activity.steps.some(s => s.signals)) {
      const dim: DimensionKey = /creative/.test(id) ? 'creativity' : /help/.test(id) ? 'helpingPeople' : /research/.test(id) ? 'researchInterest' : /build/.test(id) ? 'handsOnWork' : 'analyticalThinking';
      applyOption({ id, label: activity.title, effects: { [dim]: 2 } });
    }
  };
  const rateVideo = (id: string, rating: number) => {
    const vid = videoById(id);
    if (!vid || !Number.isInteger(rating) || rating < 1 || rating > 5) return;
    const previous = videoRef.current[id];
    const bonus = (r: number) => r >= 4 ? r - 3 : 0;
    applyOption({ id, label: vid.title, effects: { [vid.dim]: bonus(rating) - bonus(previous ?? 0) } }, 1, false);
    videoRef.current = { ...videoRef.current, [id]: rating }; setVF(videoRef.current);
    const area = areaForCluster(vid.clusterId);
    setSignals(s => [...s.filter(x => x.id !== `video-${id}`), { id: `video-${id}`, source: 'video', areas: area ? [area] : [], tags: rating >= 4 ? videoTags(vid) : [], strength: rating >= 4 ? 0.75 : 0 }]);
    setPendingVideo({ id, title: vid.title, rating, area, tags: videoTags(vid) });
    if (!previous && rating >= 4) { confRef.current = Math.min(95, confRef.current + 1); setConfidence(confRef.current); }
  };
  const toggle = (set: React.Dispatch<React.SetStateAction<string[]>>) => (id: string) => set(a => (a.includes(id) ? a.filter(x => x !== id) : [...a, id]));
  const exploreCluster = (id: string) => setEC(a => (a.includes(id) ? a : [...a, id]));

  const topDims = (Object.entries(dims) as [DimensionKey, number][]).sort((a, b) => b[1] - a[1]).map(([key, value]) => ({ key, value }));
  const displayName = profile.name || 'Student';

  const value: AppCtx = {
    screen: cur.screen, params: cur.params, nav, back, go, loadNav, loading, canGoBack: stack.length > 1,
    profile, updateProfile, displayName, firstName: displayName.split(' ')[0], responses,
    profileStability: metrics.stability, evidenceCoverage: metrics.coverage, unresolvedContradictions: metrics.contradictions,
    recommendationsReady: profileReady,
    unclearDims: dimKeys.filter(k => evidence[k] < 2),
    signUp, logIn, googleLogin, logout,
    dims, topDims, areaInterests, explorationSignals, questionsAnswered, profileConfidence: confidence, sessionsCompleted, sessionAnswered,
    currentSession: sessionsCompleted + 1, profileReady, lastReadyCheck, currentQuestion, answerQuestion, finishSession, startNextSession,
    completedActivities, completeActivity, videoFeedback, rateVideo,
    savedCareers, toggleCareer: toggle(setSC), savedDegrees, toggleDegree: toggle(setSD), exploredClusters, exploreCluster,
    factIndex, nextFact: () => setFact(i => i + 1),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
