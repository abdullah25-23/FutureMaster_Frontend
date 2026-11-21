import assert from 'node:assert/strict';
import { test } from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { activities, activitiesForProfile } from '../src/data/activities';
import { academicEvidence, RT } from '../src/data/academic';
import { careerById, readinessFor } from '../src/data/careers';
import { drawerItems, futureStudyItems, journeySections, primaryDestinationFor } from '../src/data/content';
import { areaBranches, areaForCareer, careerAreas, areaForCluster, ExplorationSignal, rankAreas } from '../src/data/exploration';
import { broadPhotoQuestion, domainPhotoQuestion, healthcareFollowUps, photoQuestionParts } from '../src/data/photoExploration';
import { pickQuestion, questionBank, QuestionState, videoFollowUp } from '../src/data/questions';
import { recommendCareers } from '../src/data/recommendations';
import { sessionVideoRecommendations, videoById, videoPhoto, videosForProfile } from '../src/data/videos';
import { CareerAreaId, InterestDimensions, StudentProfile } from '../src/types';

const dims: InterestDimensions = { analyticalThinking: 40, technologyInterest: 40, creativity: 40, helpingPeople: 40, leadership: 40, communication: 40, handsOnWork: 40, researchInterest: 40, businessInterest: 40 };
const profile = (generalInterests: StudentProfile['generalInterests'] = []): StudentProfile => ({
  name: 'Test Student', email: '', age: '12', schoolName: '', studyGroup: '',
  favouriteSubjects: [], difficultSubjects: [], subjectMarks: {}, overallPercentage: '',
  academicResultType: '', academicResultStatus: '', academicYear: '', resultSubjects: [], assessmentSource: '',
  priorAcademic: null, futureIdeas: '', futureFields: [], activities: [], careerGoal: '', generalInterests,
});
const state = (overrides: Partial<QuestionState> = {}): QuestionState => ({
  dims, evidence: Object.fromEntries(Object.keys(dims).map(k => [k, 0])) as InterestDimensions,
  askedIds: [], tags: [], directions: [], ...overrides,
});
const signal = (area: CareerAreaId, tag: string, session = 1, source: ExplorationSignal['source'] = 'question'): ExplorationSignal => ({
  id: `${area}-${tag}-${session}-${source}`, source, session, areas: [area], tags: [tag],
  strength: source === 'video' ? 0.75 : source === 'activity' ? 2 : 4,
});
const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('four main destinations group all guidance routes without level or class selection', () => {
  const app = source('src/App.tsx');
  assert.doesNotMatch(app, /LevelScreen|StageTransition|AdvancedDashboard|IntermediateDashboard/);
  const setup = source('src/screens/SetupScreen.tsx');
  assert.doesNotMatch(setup, /currentClass|classList|educationLevel|setLevel/);
  assert.match(setup, /Step 1 of 2/);
  assert.match(setup, /Step 2 of 2/);
  assert.match(source('src/screens/LoginScreen.tsx'), /go\('setup'\)/);
  assert.match(source('src/screens/SignupScreen.tsx'), /go\('setup'\)/);
  assert.deepEqual(drawerItems.map(item => item.label), ['Home', 'Explore', 'My Journey', 'Profile']);
  const journeyRoutes = [...journeySections.flatMap(section => section.items), ...futureStudyItems].map(item => item.screen);
  for (const screen of ['subject-guidance', 'degree-explorer', 'roadmap', 'readiness', 'recommendations', 'clusters', 'interest-profile']) assert.ok(journeyRoutes.includes(screen as never));
  assert.equal(primaryDestinationFor('activities'), 'explore');
  assert.equal(primaryDestinationFor('assessment'), 'explore');
  assert.equal(primaryDestinationFor('career-details'), 'journey');
  assert.equal(primaryDestinationFor('videos'), 'journey');
  assert.equal(primaryDestinationFor('profile'), 'profile');
  assert.doesNotMatch(source('src/screens/DashboardScreen.tsx'), /nav\('videos'\)/);
  assert.match(source('src/screens/ExploreScreen.tsx'), /nav\('activities'\)/);
  assert.match(source('src/screens/JourneyScreen.tsx'), /Saved career ideas/);
  assert.doesNotMatch(source('src/screens/ProfileScreen.tsx'), /savedCareers|topDims|profileConfidence/);
});

test('known interests start inside their primary area; unsure starts broad', () => {
  for (const area of careerAreas) {
    const q = pickQuestion(state({ generalInterests: [area.id], directions: ['science', area.id] })).question;
    assert.equal(q.careerArea, area.id);
    assert.notEqual(q.id, 'visual-discovery');
  }
  for (const generalInterests of [[], ['unsure']] as StudentProfile['generalInterests'][]) {
    assert.equal(pickQuestion(state({ generalInterests })).question.id, 'visual-discovery');
  }
});

test('every question has exactly four answers, including an equally neutral unsure choice; all original activities remain available', () => {
  const samples = [
    broadPhotoQuestion(), ...careerAreas.map(a => domainPhotoQuestion(a.id)), ...healthcareFollowUps, ...questionBank,
    videoFollowUp({ id: 'b-doctor', title: 'Doctor', rating: 2, area: 'healthcare', tags: ['patient-care'] }),
    videoFollowUp({ id: 'health-pharmacy', title: 'Pharmacy', rating: 5, area: 'healthcare', tags: ['medicines'] }),
  ];
  for (const q of samples) {
    const parts = photoQuestionParts(q);
    for (const part of parts) {
      assert.equal(part.options.length, 4, part.id);
      assert.equal(new Set(part.options.map(o => o.id)).size, 4, part.id);
      assert.equal(part.options.filter(o => o.id === 'unsure').length, 1, part.id);
      assert.deepEqual(part.options.find(o => o.id === 'unsure')!.effects, {});
      if (!part.visual) continue;
      assert.ok(part.options.every(o => o.photo), part.id);
      for (const option of part.options.filter(o => o.photo)) {
        assert.ok(option.photo!.alt);
        assert.ok(existsSync(new URL(`../public${option.photo!.src}`, import.meta.url)));
        assert.match(option.photo!.src, /\.webp$/);
      }
    }
    for (const original of q.options) assert.ok(parts.some(part => part.options.some(o => o.id === original.id)), `${q.id}: ${original.id}`);
  }
  const broadParts = photoQuestionParts(broadPhotoQuestion());
  assert.deepEqual([...new Set(broadParts.flatMap(q => q.options.filter(o => o.id !== 'unsure').map(o => o.id)))], ['help', 'tech', 'design', 'build', 'discover']);
});

test('text-only questions also have four choices without changing their scoring', () => {
  const text = questionBank.find(q => q.id === 'a-compare')!;
  const parts = photoQuestionParts(text);
  assert.ok(parts.every(part => !part.visual && part.options.length === 4));
  for (const option of text.options) assert.deepEqual(parts.flatMap(part => part.options).find(o => o.id === option.id)!.effects, option.effects);
  assert.ok(parts.every(part => !part.prompt.toLowerCase().includes('degree')));
});

test('adaptive selection keeps four answers through later sessions and uncertain responses', () => {
  for (const preference of [undefined, ...careerAreas.map(area => area.id)]) {
    const p = profile(preference ? [preference] : ['unsure']);
    const current = { ...dims };
    const evidence = Object.fromEntries(Object.keys(dims).map(key => [key, 0])) as InterestDimensions;
    const askedIds: string[] = [], tags: string[] = [];
    const signals: ExplorationSignal[] = [];
    for (let index = 0; index < 40; index++) {
      const areas = rankAreas(p, current, signals);
      const q = pickQuestion({ dims: current, evidence, askedIds, tags, generalInterests: p.generalInterests, directions: areas.map(area => area.id) }).question;
      assert.equal(q.options.length, 4, q.id);
      assert.equal(q.options[3].id, 'unsure', q.id);
      if (q.visual) assert.ok(q.options.every(option => option.photo), q.id);
      askedIds.push(q.id);
      const answer = q.options[index % 7 === 0 ? 3 : index % 3];
      if (answer.id === 'unsure') continue;
      tags.push(...(answer.tags ?? []), ...(answer.tag ? [answer.tag] : []));
      for (const [key, effect] of Object.entries(answer.effects)) {
        current[key as keyof InterestDimensions] = Math.min(96, current[key as keyof InterestDimensions] + effect);
        evidence[key as keyof InterestDimensions]++;
      }
      signals.push({ id: String(index), source: 'question', strength: 4, areas: answer.areas ?? [], tags: answer.tags ?? [] });
    }
  }
});

test('choice rendering is equal-sized, and completion always prioritizes the dashboard', () => {
  const screen = source('src/screens/AssessmentScreen.tsx');
  assert.match(screen, /grid-cols-2/);
  assert.doesNotMatch(screen, /col-span-2|\[\.\.\.q.options/);
  assert.match(screen, /questionChoice/);
  assert.match(source('src/components/ui.tsx'), /h-48 overflow-hidden/);
  const completion = source('src/screens/SessionResultScreen.tsx');
  const footer = completion.slice(completion.indexOf('footer={'), completion.indexOf('<CheckAnim'));
  assert.ok(footer.indexOf('Go to Dashboard') < footer.indexOf('View My Interest Profile'));
  assert.match(footer, /<Btn onClick=\{\(\) => go\('dashboard'\)\}>Go to Dashboard/);
});

test('unsure discovery shows the next small group; caring establishes Healthcare, not a scoring tie with teaching', () => {
  const next = pickQuestion(state({ askedIds: ['visual-discovery'] })).question;
  assert.equal(next.id, 'visual-discovery-more-1');
  const care = broadPhotoQuestion().options.find(o => o.id === 'help')!;
  assert.deepEqual(care.areas, ['healthcare']);
  const areas = rankAreas(profile(), dims, [signal('healthcare', 'patient-care')]);
  const domain = pickQuestion(state({ askedIds: ['visual-discovery'], directions: areas.map(a => a.id) })).question;
  assert.equal(domain.careerArea, 'healthcare');
});

test('Healthcare activity choices create focused follow-ups and never determine a final career', () => {
  const expected: Record<string, string> = { talk: 'patient-care', cause: 'medical-research', medicine: 'medicines', urgent: 'emergency-work', children: 'children', mind: 'mental-health' };
  const intro = domainPhotoQuestion('healthcare');
  for (const option of intro.options) {
    const next = pickQuestion(state({
      generalInterests: ['healthcare', 'science'], askedIds: [intro.id], directions: ['healthcare', 'science'], tags: option.tags,
    })).question;
    assert.equal(next.id, `explore-healthcare-depth-${expected[option.id]}`);
    assert.equal(next.options.length, 4);
  }
  assert.ok(areaBranches.every(branch => branch.verify.some(o => o.areas?.some(a => a !== branch.area))));
});

test('video feedback continues to redirect exploration without removing a whole field', () => {
  const q = videoFollowUp({ id: 'b-doctor', title: 'Doctor', rating: 2, area: 'healthcare', tags: ['patient-care'] });
  assert.equal(q.prompt, "What didn't appeal to you?");
  assert.ok(q.options.find(o => o.id === 'medicines')!.tags!.includes('medicines'));
  const next = pickQuestion(state({ askedIds: ['explore-healthcare-explore'], directions: ['healthcare'], pendingVideo: { id: 'b-doctor', title: 'Doctor', rating: 2, area: 'healthcare', tags: [] } }));
  assert.match(next.question.id, /feedback-/);
  assert.equal(next.question.options.length, 4);
});

test('completion recommends exactly two photographic videos from different meaningful areas', () => {
  const signals = [signal('healthcare', 'medicines'), signal('healthcare', 'medical-research')];
  const p = profile(['healthcare', 'science']);
  const areas = rankAreas(p, dims, signals);
  const pair = sessionVideoRecommendations(dims, areas, p, {}, signals, 1);
  assert.equal(pair.length, 2);
  assert.equal(areaForCluster(pair[0].clusterId), 'healthcare');
  assert.equal(areaForCluster(pair[1].clusterId), 'science');
  assert.notEqual(pair[0].id, pair[1].id);
  for (const video of pair) assert.ok(existsSync(new URL(`../public${videoPhoto(video).src}`, import.meta.url)));
});

test('completed-session evidence outweighs an original preference when choosing videos', () => {
  const p = profile(['healthcare', 'science']);
  const signals = [signal('healthcare', 'patient-care', 1), signal('technology', 'software', 2), signal('technology', 'data', 2)];
  const areas = rankAreas(p, dims, signals);
  const pair = sessionVideoRecommendations(dims, areas, p, {}, signals, 2);
  assert.equal(areaForCluster(pair[0].clusterId), 'technology');
  assert.notEqual(areaForCluster(pair[1].clusterId), 'technology');
  const historic = rankAreas(p, dims, Array.from({ length: 10 }, () => signal('healthcare', 'patient-care', 1)));
  const noArea = [{ ...signal('technology', 'logic', 3), areas: [], effects: { technologyInterest: 12, analyticalThinking: 8 } }];
  const fromDimensions = sessionVideoRecommendations(dims, historic, p, {}, noArea, 3);
  assert.equal(areaForCluster(fromDimensions[0].clusterId), 'technology');
  assert.notEqual(areaForCluster(fromDimensions[1].clusterId), 'healthcare');
  const generic = sessionVideoRecommendations(dims, [], profile(['unsure']), {}, [], 1);
  assert.equal(generic.length, 2);
  assert.notEqual(areaForCluster(generic[0].clusterId), areaForCluster(generic[1].clusterId));
});

test('no automatic video navigation interrupts a session, and completion retains optional actions without percentages', () => {
  assert.doesNotMatch(source('src/screens/AssessmentScreen.tsx'), /nav\('videos'/);
  const completion = source('src/screens/SessionResultScreen.tsx');
  assert.doesNotMatch(completion, /Interest Profile V1|profileConfidence|topDims|<Bar|%/);
  for (const label of ['Recommended Videos for You', 'Go to Dashboard', 'View My Interest Profile', 'Explore Another Field']) assert.ok(completion.includes(label));
  assert.match(completion, /returnTo: 'session-result'/);
  assert.match(source('src/screens/VideoFeedbackScreen.tsx'), /Back to Session Completed/);
});

test('activities, preferences, feedback and history remain independent evidence sources', () => {
  const p = profile(['healthcare']);
  const signals = [signal('healthcare', 'medicines'), signal('healthcare', 'medicines', 1, 'activity')];
  const areas = rankAreas(p, dims, signals);
  assert.ok(activities.length >= 15);
  assert.match(activitiesForProfile(areas, dims, [], signals)[0].id, /healthcare/);
  assert.ok(videosForProfile(dims, areas, { 'b-doctor': 2 }, signals).interests.length);
  assert.ok(videoById('health-movement')!.careerIds!.includes('physiotherapist'));
  assert.equal(rankAreas(profile(['unsure']), dims, []).length, 0);
  assert.equal(rankAreas(p, dims, [signal('technology', 'software')])[0].id, 'technology');
});

test('recommendations stay exactly three, diverse, and independent of academic readiness', () => {
  const p = profile(['healthcare']);
  const health = { ...dims, analyticalThinking: 75, researchInterest: 90, helpingPeople: 65 };
  const signals = [signal('healthcare', 'medicines')];
  const recs = recommendCareers(health, {}, p, signals);
  assert.equal(recs.length, 3);
  assert.equal(new Set(recs.map(r => r.career.id)).size, 3);
  assert.ok(new Set(recs.map(r => areaForCareer(r.career))).size >= 2);
  const high = { ...p, academicResultType: RT.internal, subjectMarks: { Biology: '99', Chemistry: '99' }, overallPercentage: '99' };
  const low = { ...high, subjectMarks: { Biology: '25', Chemistry: '25' }, overallPercentage: '25' };
  assert.deepEqual(recommendCareers(health, {}, high, signals).map(r => [r.career.id, r.score]), recommendCareers(health, {}, low, signals).map(r => [r.career.id, r.score]));
  assert.equal(academicEvidence(p).overall, null);
  assert.equal(readinessFor(careerById('doctor')!, high).readiness, 'On Track');
  assert.equal(readinessFor(careerById('doctor')!, low).readiness, 'Needs Improvement');
});
