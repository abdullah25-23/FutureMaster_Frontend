import { CareerAreaId, DimensionKey, InterestDimensions, QuestionOption, StudentProfile } from '../types';

export interface AreaDefinition {
  id: CareerAreaId; label: string; short: string; icon: string; clusters: string[];
  weights: Partial<Record<DimensionKey, number>>; next: string[];
}
export const careerAreas: AreaDefinition[] = [
  { id: 'healthcare', label: 'Healthcare & Medicine', short: 'healthcare', icon: 'HeartPulse', clusters: ['health'], weights: { helpingPeople: 3, researchInterest: 2 }, next: ['Patient Care', 'Medical Research', 'Psychology & Mental Health'] },
  { id: 'technology', label: 'Computing & Technology', short: 'technology', icon: 'Laptop', clusters: ['tech'], weights: { technologyInterest: 3, analyticalThinking: 2 }, next: ['Digital Creation', 'Cybersecurity', 'Data & AI'] },
  { id: 'engineering', label: 'Engineering', short: 'building and engineering', icon: 'Wrench', clusters: ['engineering'], weights: { handsOnWork: 3, analyticalThinking: 2 }, next: ['Building & Fixing', 'Robotics', 'Structures & Energy'] },
  { id: 'business', label: 'Business & Entrepreneurship', short: 'business', icon: 'Briefcase', clusters: ['business', 'finance'], weights: { businessInterest: 3, leadership: 2 }, next: ['Starting a Venture', 'Understanding Customers', 'Managing Money'] },
  { id: 'design', label: 'Design & Creative Fields', short: 'design and creativity', icon: 'Palette', clusters: ['design', 'media'], weights: { creativity: 3, communication: 1 }, next: ['Visual Design', 'Storytelling', 'Designing for People'] },
  { id: 'science', label: 'Science & Research', short: 'science and research', icon: 'Microscope', clusters: ['research', 'natural', 'agri'], weights: { researchInterest: 3, analyticalThinking: 2 }, next: ['Experiments', 'Living Things', 'Patterns & Evidence'] },
  { id: 'social', label: 'Teaching & Social Sciences', short: 'teaching and understanding people', icon: 'Users', clusters: ['education', 'social'], weights: { communication: 3, helpingPeople: 2 }, next: ['Helping Others Learn', 'Understanding People', 'Community Support'] },
  { id: 'public-service', label: 'Law & Public Service', short: 'law and public service', icon: 'Scale', clusters: ['law'], weights: { communication: 2, leadership: 2, analyticalThinking: 1 }, next: ['Fair Decisions', 'Public Service', 'Understanding Evidence'] },
];
export const areaById = (id?: string) => careerAreas.find(a => a.id === id);
export const areaForCluster = (id?: string) => careerAreas.find(a => a.clusters.includes(id ?? ''))?.id;
export const areaForCareer = (career: { id: string; clusterId: string }) => career.id === 'physiotherapist' ? 'healthcare' : areaForCluster(career.clusterId);

export interface ExplorationSignal {
  id: string; source: 'question' | 'activity' | 'video'; areas: CareerAreaId[]; tags: string[]; strength: number;
  session?: number; effects?: QuestionOption['effects'];
}
export interface AreaInterest extends AreaDefinition { score: number; observations: number; evidenceLabel: string }

/** Preferences are a small prior, never observed evidence. Marks are deliberately absent. */
export function rankAreas(profile: StudentProfile, dims: InterestDimensions, signals: ExplorationSignal[]): AreaInterest[] {
  return careerAreas.map(area => {
    const relevant = signals.filter(s => s.areas.includes(area.id));
    const observed = relevant.filter(s => s.source !== 'video' && s.strength > 0).length;
    const preference = profile.generalInterests.indexOf(area.id);
    const prior = preference === 0 ? 2 : preference === 1 ? 1 : 0;
    const evidence = relevant.reduce((n, s) => n + s.strength, 0);
    const affinity = Object.entries(area.weights).reduce((n, [k, w]) => n + Math.max(0, dims[k as DimensionKey] - 30) * w!, 0) / 100;
    return { ...area, score: prior + evidence + affinity, observations: observed,
      evidenceLabel: observed >= 4 ? 'Strong evidence' : observed >= 2 ? 'Growing evidence' : observed ? 'Early evidence' : 'Starting preference' };
  }).filter(a => a.observations > 0 || profile.generalInterests.includes(a.id) || signals.some(s => s.areas.includes(a.id) && s.strength > 0))
    .sort((a, b) => b.score - a.score);
}

export const signalOption = (id: string, label: string, effects: QuestionOption['effects'], areas: CareerAreaId[], tags: string[], icon?: string): QuestionOption =>
  ({ id, label, effects, areas, tags, icon });

export const discoveryOptions: QuestionOption[] = [
  signalOption('help', 'Helping someone feel better', { helpingPeople: 10, communication: 4 }, ['healthcare', 'social'], ['patient-care'], 'HeartHandshake'),
  signalOption('tech', 'Creating something with technology', { technologyInterest: 10, analyticalThinking: 4, creativity: 3 }, ['technology'], ['digital-creation'], 'Laptop'),
  signalOption('design', 'Designing something new', { creativity: 10, communication: 3 }, ['design'], ['visual-design'], 'Palette'),
  signalOption('build', 'Building or fixing something', { handsOnWork: 10, analyticalThinking: 4 }, ['engineering'], ['practical-work'], 'Wrench'),
  signalOption('discover', 'Discovering how something works', { researchInterest: 10, analyticalThinking: 4 }, ['science'], ['investigation'], 'Microscope'),
];

export interface AreaBranch {
  area: CareerAreaId; prompt: string; options: QuestionOption[]; verifyPrompt: string; verify: QuestionOption[];
}
const op = signalOption;
export const areaBranches: AreaBranch[] = [
  { area: 'healthcare', prompt: 'Someone is feeling unwell. What part would interest you most?', options: [
    op('talk', 'Talking to them and understanding the problem', { helpingPeople: 10, communication: 7 }, ['healthcare'], ['patient-care', 'communication'], 'MessagesSquare'),
    op('cause', 'Finding out what may be causing it', { analyticalThinking: 9, researchInterest: 9 }, ['healthcare', 'science'], ['medical-research', 'lab-work'], 'Search'),
    op('urgent', 'Helping during an emergency', { helpingPeople: 8, handsOnWork: 8, leadership: 5 }, ['healthcare'], ['emergency-work', 'patient-care'], 'HeartPulse'),
    op('medicine', 'Understanding medicines', { researchInterest: 10, analyticalThinking: 7 }, ['healthcare'], ['medicines'], 'Pill'),
    op('body', 'Learning how the human body works', { researchInterest: 10, analyticalThinking: 6 }, ['healthcare', 'science'], ['biology', 'medical-research'], 'Dna'),
    op('mind', 'Listening to their worries and feelings', { communication: 10, helpingPeople: 8 }, ['healthcare', 'social'], ['mental-health'], 'Brain'),
  ], verifyPrompt: 'There are many ways to help people. Which would you like to try next?', verify: [
    op('children', 'Helping a child feel calm at a check-up', { helpingPeople: 9, communication: 8 }, ['healthcare'], ['children', 'patient-care'], 'Baby'),
    op('movement', 'Helping someone practise moving again', { handsOnWork: 9, helpingPeople: 8 }, ['healthcare'], ['movement', 'practical-work'], 'Activity'),
    op('lab', 'Carefully comparing results in a lab', { researchInterest: 10, analyticalThinking: 8, handsOnWork: 4 }, ['healthcare', 'science'], ['lab-work', 'medical-research'], 'Microscope'),
    op('listen', 'Listening to someone who feels worried', { helpingPeople: 8, communication: 10 }, ['healthcare', 'social'], ['mental-health'], 'Brain'),
    op('different', 'Creating something instead of caring for patients', { creativity: 9, technologyInterest: 6 }, ['design', 'technology'], ['digital-creation'], 'Palette'),
  ] },
  { area: 'technology', prompt: 'You could help make a new digital tool. Which part sounds fun?', options: [
    op('create', 'Making a simple game or useful tool', { technologyInterest: 10, creativity: 6, analyticalThinking: 4 }, ['technology'], ['software', 'digital-creation'], 'Gamepad2'),
    op('protect', 'Keeping people and their information safe', { technologyInterest: 9, analyticalThinking: 8 }, ['technology'], ['cybersecurity'], 'ShieldCheck'),
    op('patterns', 'Finding patterns in information', { analyticalThinking: 10, researchInterest: 7 }, ['technology', 'science'], ['data', 'ai'], 'ChartNoAxesCombined'),
    op('look', 'Making it easy and enjoyable to use', { creativity: 10, helpingPeople: 5 }, ['technology', 'design'], ['user-design'], 'PanelsTopLeft'),
  ], verifyPrompt: 'Your digital tool is not helping people yet. What would you enjoy doing?', verify: [
    op('fix', 'Finding the step that does not work', { analyticalThinking: 10, technologyInterest: 8 }, ['technology'], ['software'], 'Search'),
    op('ask', 'Asking people what they need', { communication: 9, helpingPeople: 7 }, ['social', 'design'], ['user-design'], 'Users'),
    op('physical', 'Trying a real model instead of a screen', { handsOnWork: 10, analyticalThinking: 5 }, ['engineering'], ['practical-work'], 'Wrench'),
    op('explain', 'Explaining the idea with drawings', { creativity: 10, communication: 6 }, ['design'], ['visual-design'], 'Palette'),
  ] },
  { area: 'engineering', prompt: 'Your school needs a better playground. What would you enjoy?', options: [
    op('build', 'Building and testing a small model', { handsOnWork: 10, analyticalThinking: 7 }, ['engineering'], ['structures', 'practical-work'], 'Blocks'),
    op('power', 'Finding a way to use less electricity', { analyticalThinking: 9, researchInterest: 7 }, ['engineering', 'science'], ['energy'], 'Zap'),
    op('machine', 'Working out how moving parts fit together', { handsOnWork: 9, technologyInterest: 7 }, ['engineering'], ['machines', 'robotics'], 'Cog'),
    op('design', 'Drawing a place everyone can enjoy', { creativity: 10, helpingPeople: 5 }, ['design'], ['spaces'], 'PencilRuler'),
  ], verifyPrompt: 'Your model keeps falling over. Which next step interests you?', verify: [
    op('test', 'Test one part at a time', { analyticalThinking: 10, handsOnWork: 8 }, ['engineering'], ['structures'], 'Wrench'),
    op('research', 'Find out why materials behave differently', { researchInterest: 10, analyticalThinking: 7 }, ['science'], ['investigation'], 'Microscope'),
    op('sketch', 'Imagine a completely different shape', { creativity: 10, handsOnWork: 5 }, ['design'], ['spaces'], 'Palette'),
    op('team', 'Help the team plan a new attempt', { leadership: 9, communication: 7 }, ['business', 'social'], ['teamwork'], 'Users'),
  ] },
  { area: 'business', prompt: 'Your class wants to run a small school stall. What would you try?', options: [
    op('idea', 'Thinking of something people might want', { businessInterest: 10, creativity: 7 }, ['business'], ['venture'], 'Lightbulb'),
    op('money', 'Working out prices and costs', { businessInterest: 9, analyticalThinking: 9 }, ['business'], ['finance'], 'Calculator'),
    op('people', 'Talking to visitors about the idea', { communication: 10, businessInterest: 7 }, ['business'], ['marketing'], 'MessagesSquare'),
    op('team', 'Planning jobs so the team works well', { leadership: 10, communication: 6 }, ['business'], ['teamwork'], 'Users'),
  ], verifyPrompt: 'Very few people visit the stall. What would you enjoy trying?', verify: [
    op('ask', 'Ask visitors what they would like', { communication: 9, researchInterest: 7 }, ['business', 'social'], ['marketing'], 'Users'),
    op('numbers', 'Compare costs and try a different price', { analyticalThinking: 10, businessInterest: 8 }, ['business'], ['finance'], 'Calculator'),
    op('poster', 'Make a more interesting poster', { creativity: 10, communication: 5 }, ['design'], ['visual-design'], 'Palette'),
    op('tool', 'Make a simple digital ordering tool', { technologyInterest: 10, analyticalThinking: 5 }, ['technology'], ['software'], 'Laptop'),
  ] },
  { area: 'design', prompt: 'You can create something for your school. What sounds exciting?', options: [
    op('visual', 'Drawing a poster or character', { creativity: 12, communication: 4 }, ['design'], ['visual-design'], 'Palette'),
    op('story', 'Telling a story through pictures or video', { creativity: 10, communication: 8 }, ['design'], ['storytelling'], 'Clapperboard'),
    op('useful', 'Making an everyday object easier to use', { creativity: 9, helpingPeople: 6, handsOnWork: 4 }, ['design', 'engineering'], ['user-design'], 'PencilRuler'),
    op('digital', 'Designing the screens of a simple app', { creativity: 9, technologyInterest: 8 }, ['design', 'technology'], ['user-design'], 'PanelsTopLeft'),
  ], verifyPrompt: 'Someone finds your design confusing. What would you like to do?', verify: [
    op('listen', 'Watch how they use it and listen', { communication: 9, helpingPeople: 7 }, ['design', 'social'], ['user-design'], 'Users'),
    op('draw', 'Try new colours, pictures and layouts', { creativity: 12 }, ['design'], ['visual-design'], 'Palette'),
    op('build', 'Make and test a working model', { handsOnWork: 10, analyticalThinking: 6 }, ['engineering'], ['practical-work'], 'Wrench'),
    op('story', 'Explain it with a short story', { communication: 10, creativity: 7 }, ['design', 'social'], ['storytelling'], 'BookOpen'),
  ] },
  { area: 'science', prompt: 'You notice something surprising in nature. What would you enjoy?', options: [
    op('test', 'Trying a safe experiment with a teacher', { researchInterest: 10, handsOnWork: 6, analyticalThinking: 5 }, ['science'], ['investigation', 'lab-work'], 'FlaskConical'),
    op('living', 'Learning about plants, animals or the body', { researchInterest: 10, helpingPeople: 4 }, ['science', 'healthcare'], ['biology'], 'Leaf'),
    op('data', 'Comparing measurements to find a pattern', { analyticalThinking: 10, researchInterest: 8 }, ['science', 'technology'], ['data'], 'ChartNoAxesCombined'),
    op('explain', 'Explaining the discovery to other people', { communication: 10, researchInterest: 6 }, ['social', 'science'], ['teaching'], 'BookOpen'),
  ], verifyPrompt: 'Your experiment gives an unexpected result. What next?', verify: [
    op('again', 'Check the method and test again', { researchInterest: 10, analyticalThinking: 9 }, ['science'], ['investigation'], 'FlaskConical'),
    op('health', 'Explore how it might help people stay healthy', { helpingPeople: 9, researchInterest: 7 }, ['healthcare'], ['medical-research'], 'HeartPulse'),
    op('make', 'Use the result to build something useful', { handsOnWork: 10, technologyInterest: 6 }, ['engineering'], ['practical-work'], 'Wrench'),
    op('share', 'Create a clear story about what happened', { communication: 10, creativity: 6 }, ['social', 'design'], ['storytelling'], 'BookOpen'),
  ] },
  { area: 'social', prompt: 'A younger student is finding school difficult. What would you enjoy?', options: [
    op('teach', 'Explaining a topic in a simple way', { communication: 10, helpingPeople: 8 }, ['social'], ['teaching'], 'BookOpen'),
    op('listen', 'Listening to what worries them', { communication: 9, helpingPeople: 9 }, ['social', 'healthcare'], ['mental-health'], 'Brain'),
    op('understand', 'Finding out what makes learning easier', { researchInterest: 10, analyticalThinking: 6 }, ['social', 'science'], ['learning-research'], 'Search'),
    op('organise', 'Organising a friendly study group', { leadership: 10, helpingPeople: 7 }, ['social'], ['community'], 'Users'),
  ], verifyPrompt: 'Your study group needs a fresh approach. What would you try?', verify: [
    op('activity', 'Create a fun way to teach the topic', { creativity: 9, communication: 9 }, ['social', 'design'], ['teaching'], 'Palette'),
    op('research', 'Compare which learning methods help', { researchInterest: 10, analyticalThinking: 8 }, ['science', 'social'], ['learning-research'], 'Microscope'),
    op('tool', 'Make a simple digital learning tool', { technologyInterest: 10, helpingPeople: 5 }, ['technology'], ['software'], 'Laptop'),
    op('fair', 'Make sure everyone has a fair chance to join', { leadership: 9, communication: 7 }, ['public-service'], ['fairness'], 'Scale'),
  ] },
  { area: 'public-service', prompt: 'Students disagree about a new school rule. What interests you?', options: [
    op('listen', 'Listening to each side before deciding', { communication: 10, analyticalThinking: 7 }, ['public-service'], ['fairness'], 'Scale'),
    op('facts', 'Checking the facts and reasons', { analyticalThinking: 10, researchInterest: 8 }, ['public-service', 'science'], ['evidence'], 'Search'),
    op('speak', 'Speaking up for someone being treated unfairly', { communication: 10, leadership: 8 }, ['public-service'], ['advocacy'], 'Megaphone'),
    op('service', 'Organising a helpful community project', { leadership: 10, helpingPeople: 8 }, ['public-service', 'social'], ['community'], 'Users'),
  ], verifyPrompt: 'A decision seems fair, but not everyone agrees. What next?', verify: [
    op('reason', 'Explain the reasons and hear concerns', { communication: 10, analyticalThinking: 7 }, ['public-service'], ['advocacy'], 'MessagesSquare'),
    op('study', 'Study the effects before changing the rule', { researchInterest: 10, analyticalThinking: 8 }, ['science', 'public-service'], ['evidence'], 'Search'),
    op('care', 'Support the people affected personally', { helpingPeople: 10, communication: 7 }, ['social', 'healthcare'], ['mental-health'], 'HeartHandshake'),
    op('plan', 'Plan a better way to run the project', { leadership: 10, businessInterest: 7 }, ['business'], ['teamwork'], 'Briefcase'),
  ] },
];

export const careerTags: Record<string, string[]> = {
  doctor: ['patient-care', 'biology', 'emergency-work'], pediatrician: ['children', 'patient-care'],
  pharmacist: ['medicines'], psychologist: ['mental-health'], physiotherapist: ['movement', 'practical-work'],
  'med-lab-scientist': ['lab-work'], 'biomedical-researcher': ['medical-research', 'biology', 'lab-work'],
  biotechnologist: ['medical-research', 'biology'], 'software-engineer': ['software', 'digital-creation'],
  'cybersecurity-analyst': ['cybersecurity'], 'data-scientist': ['data', 'ai'], 'ai-engineer': ['ai', 'data'],
  'graphic-designer': ['visual-design'], 'ux-designer': ['user-design'], entrepreneur: ['venture'],
  'marketing-manager': ['marketing'], 'financial-analyst': ['finance'], teacher: ['teaching'],
  'mechanical-engineer': ['machines', 'practical-work'], 'civil-engineer': ['structures'], 'electrical-engineer': ['energy'],
  'robotics-engineer': ['robotics'], lawyer: ['fairness', 'advocacy'], 'research-analyst': ['investigation', 'evidence'],
};

export function nextDirections(area: AreaInterest | undefined, signals: ExplorationSignal[]) {
  if (!area) return ['Try a creative activity', 'Explore helping people', 'Discover how things work'];
  const tagLabels: Record<string, string> = { 'mental-health': 'Psychology & Mental Health', medicines: 'Medicines & Pharmacy',
    'medical-research': 'Medical Research', 'lab-work': 'Laboratory Discovery', movement: 'Physiotherapy', children: 'Child Healthcare',
    'patient-care': 'Patient Care', cybersecurity: 'Cybersecurity', data: 'Data & Patterns', 'user-design': 'Designing for People' };
  const discovered = signals.filter(s => s.areas.includes(area.id) && s.strength > 0).slice().reverse()
    .flatMap(s => s.tags.map(t => tagLabels[t]).filter(Boolean));
  return [...new Set([...discovered, ...area.next])].slice(0, 3);
}
