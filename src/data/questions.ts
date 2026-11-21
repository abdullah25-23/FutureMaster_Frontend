import { CareerAreaId, DimensionKey, QuestionOption, StudentProfile } from '../types';
import { areaBranches, areaById, discoveryOptions, signalOption } from './exploration';
import { broadPhotoQuestion, domainPhotoQuestion, healthcareFollowUps, photoQuestionParts } from './photoExploration';

export interface Question {
  id: string;
  scenario: string;
  emoji: string;
  prompt: string;
  targets: DimensionKey[];
  options: QuestionOption[];
  requiresTag?: string;
  note?: string;
  once?: boolean;
  careerArea?: CareerAreaId;
  visual?: boolean;
}

const o = (id: string, label: string, effects: QuestionOption['effects'], tag?: string): QuestionOption => ({ id, label, effects, tag });

export const questionBank: Question[] = [
  { id: 'exhibition', scenario: 'School Exhibition', emoji: '🏫', prompt: 'Your class is preparing a science exhibition. Which role would you enjoy most?',
    targets: ['technologyInterest', 'creativity', 'communication', 'leadership', 'researchInterest'],
    options: [
      o('a', 'Programming a robot', { technologyInterest: 14, analyticalThinking: 6, handsOnWork: 4 }),
      o('b', 'Designing the poster', { creativity: 14, communication: 4 }),
      o('c', 'Presenting the project', { communication: 14, leadership: 5 }),
      o('d', 'Organizing the team', { leadership: 14, businessInterest: 5, communication: 3 }),
      o('e', 'Researching ideas', { researchInterest: 14, analyticalThinking: 6 }),
    ] },
  { id: 'broken-device', scenario: 'Broken Device', emoji: '🔧', prompt: 'A family device suddenly stops working. What interests you most?',
    targets: ['analyticalThinking', 'handsOnWork', 'technologyInterest', 'creativity'],
    options: [
      o('a', 'Finding the cause', { analyticalThinking: 14, researchInterest: 5 }),
      o('b', 'Trying to repair it', { handsOnWork: 14, technologyInterest: 6 }),
      o('c', 'Learning how it works', { researchInterest: 12, technologyInterest: 8 }),
      o('d', 'Improving its design', { creativity: 12, analyticalThinking: 5, handsOnWork: 4 }),
      o('e', 'Organizing a solution', { leadership: 10, businessInterest: 8 }),
    ] },
  { id: 'group-project', scenario: 'Group Project', emoji: '👥', prompt: 'Your group has a big project. Which role feels most natural?',
    targets: ['analyticalThinking', 'researchInterest', 'creativity', 'communication', 'leadership'],
    options: [
      o('a', 'Technical problem solving', { analyticalThinking: 12, technologyInterest: 8 }),
      o('b', 'Research', { researchInterest: 14, analyticalThinking: 4 }),
      o('c', 'Design', { creativity: 14 }),
      o('d', 'Explaining', { communication: 14, helpingPeople: 5 }),
      o('e', 'Team organization', { leadership: 14, businessInterest: 4 }),
    ] },
  { id: 'area-pick', scenario: 'Areas of Life', emoji: '🌍', prompt: 'Imagine spending a free week learning about one area. Which sounds best?',
    targets: ['helpingPeople', 'technologyInterest', 'businessInterest', 'creativity'],
    options: [
      o('a', 'How the human body and health work', { helpingPeople: 10, researchInterest: 8 }, 'healthcare'),
      o('b', 'How apps and AI are built', { technologyInterest: 14, analyticalThinking: 6 }),
      o('c', 'How businesses start and grow', { businessInterest: 14, leadership: 6 }),
      o('d', 'How stories, art and media are made', { creativity: 14, communication: 6 }),
      o('e', 'How buildings and machines are engineered', { handsOnWork: 10, analyticalThinking: 8 }),
    ] },
  { id: 'hc-1', scenario: 'Healthcare Path', emoji: '🩺', requiresTag: 'healthcare', once: true,
    note: 'You showed interest in healthcare, so we are exploring which parts of it feel like you.',
    prompt: 'Healthcare has many kinds of work. Which part feels most like you?',
    targets: ['helpingPeople', 'researchInterest'],
    options: [
      o('a', 'Treating patients directly', { helpingPeople: 12, handsOnWork: 8 }),
      o('b', 'Understanding how medicines and the body work', { researchInterest: 12, analyticalThinking: 6 }),
      o('c', 'Supporting people\'s minds and wellbeing', { helpingPeople: 12, communication: 8 }),
      o('d', 'I strongly prefer to avoid seeing blood', { helpingPeople: 4 }, 'avoid-blood'),
    ] },
  { id: 'hc-2', scenario: 'Healthcare, Your Way', emoji: '🧬', requiresTag: 'avoid-blood', once: true,
    note: 'Healthcare is still open to you. One answer never removes a whole field, so here are less hands-on areas.',
    prompt: 'Which of these health-related areas sounds interesting?',
    targets: ['helpingPeople', 'researchInterest', 'technologyInterest'],
    options: [
      o('a', 'Psychology', { helpingPeople: 12, communication: 8 }),
      o('b', 'Pharmacy', { researchInterest: 10, analyticalThinking: 8, helpingPeople: 4 }),
      o('c', 'Nutrition', { helpingPeople: 10, researchInterest: 6 }),
      o('d', 'Medical Research', { researchInterest: 14, analyticalThinking: 6 }),
      o('e', 'Public Health', { helpingPeople: 10, leadership: 6, communication: 4 }),
      o('f', 'Healthcare Technology', { technologyInterest: 12, helpingPeople: 6 }),
      o('g', 'Biomedical Sciences', { researchInterest: 12, technologyInterest: 6 }),
    ] },
  { id: 'weekend-build', scenario: 'Free Weekend', emoji: '🛠️', prompt: 'You have a free weekend and a small budget. What would you most like to make?',
    targets: ['creativity', 'handsOnWork', 'technologyInterest'],
    options: [
      o('a', 'A short animated video or comic', { creativity: 14, technologyInterest: 4 }),
      o('b', 'A working model or gadget', { handsOnWork: 14, technologyInterest: 6 }),
      o('c', 'A simple app or game', { technologyInterest: 14, creativity: 6, analyticalThinking: 4 }),
      o('d', 'A fundraiser for a cause', { helpingPeople: 12, leadership: 8 }),
    ] },
  { id: 'volunteer', scenario: 'Community Day', emoji: '🤲', prompt: 'Your school is running a community help day. What would you volunteer for?',
    targets: ['helpingPeople', 'communication', 'leadership'],
    options: [
      o('a', 'Teaching younger students', { helpingPeople: 12, communication: 10 }),
      o('b', 'Coordinating volunteers', { leadership: 14, businessInterest: 4 }),
      o('c', 'Setting up equipment and stalls', { handsOnWork: 12 }),
      o('d', 'Surveying what the community needs', { researchInterest: 10, analyticalThinking: 8 }),
    ] },
  { id: 'fair-stall', scenario: 'Fair Stall', emoji: '🛍️', prompt: 'Your class runs a stall at a school fair. What would you take charge of?',
    targets: ['businessInterest', 'leadership', 'communication'],
    options: [
      o('a', 'Deciding prices and tracking money', { businessInterest: 14, analyticalThinking: 6 }),
      o('b', 'Convincing visitors to stop by', { communication: 12, businessInterest: 8 }),
      o('c', 'Designing the stall look', { creativity: 12 }),
      o('d', 'Planning who does what', { leadership: 14 }),
    ] },
  { id: 'mystery', scenario: 'Science Mystery', emoji: '🔬', prompt: 'Plants in your school garden keep drying out. What would you do first?',
    targets: ['researchInterest', 'analyticalThinking', 'handsOnWork'],
    options: [
      o('a', 'Test soil, light and water to find a pattern', { researchInterest: 14, analyticalThinking: 8 }),
      o('b', 'Build a simple watering system', { handsOnWork: 12, technologyInterest: 8 }),
      o('c', 'Ask experts and read about it', { researchInterest: 10, communication: 6 }),
      o('d', 'Redesign the garden layout', { creativity: 12, handsOnWork: 4 }),
    ] },
  { id: 'debate', scenario: 'Class Debate', emoji: '🎤', prompt: 'Your class holds a debate on technology in schools. What would you enjoy?',
    targets: ['communication', 'analyticalThinking', 'leadership'],
    options: [
      o('a', 'Speaking for the team', { communication: 14, leadership: 5 }),
      o('b', 'Preparing the strongest facts', { researchInterest: 10, analyticalThinking: 10 }),
      o('c', 'Writing the opening speech', { communication: 10, creativity: 8 }),
      o('d', 'Leading the planning', { leadership: 14 }),
    ] },
  { id: 'puzzle', scenario: 'Puzzle Night', emoji: '🧩', prompt: 'A tricky logic puzzle appears. What do you do?',
    targets: ['analyticalThinking', 'technologyInterest'],
    options: [
      o('a', 'Break it into small steps', { analyticalThinking: 14, technologyInterest: 4 }),
      o('b', 'Look for a clever shortcut', { analyticalThinking: 10, creativity: 8 }),
      o('c', 'Work on it together with friends', { communication: 10, leadership: 4 }),
      o('d', 'Write a small program to solve it', { technologyInterest: 14, analyticalThinking: 8 }),
    ] },
  { id: 'poster-story', scenario: 'Creative Challenge', emoji: '🎨', prompt: 'You can create anything for the school magazine. What do you pick?',
    targets: ['creativity', 'communication'],
    options: [
      o('a', 'An illustration or design', { creativity: 14 }),
      o('b', 'A story or article', { creativity: 10, communication: 10 }),
      o('c', 'An interactive digital feature', { creativity: 8, technologyInterest: 10 }),
      o('d', 'A survey of student opinions', { researchInterest: 10, analyticalThinking: 6 }),
    ] },

  { id: 'i-projects', scenario: 'Optional Project', emoji: '📁', prompt: 'Your school offers one optional project. Which would you pick?',
    targets: ['technologyInterest', 'researchInterest', 'creativity', 'businessInterest', 'helpingPeople'],
    options: [
      o('a', 'Build a simple computer application', { technologyInterest: 14, analyticalThinking: 6 }),
      o('b', 'Investigate a biology problem', { researchInterest: 12, helpingPeople: 6 }, 'healthcare'),
      o('c', 'Design a creative campaign', { creativity: 14, communication: 6 }),
      o('d', 'Plan a small business idea', { businessInterest: 14, leadership: 6 }),
      o('e', 'Research a social issue', { helpingPeople: 12, researchInterest: 8, communication: 4 }),
    ] },
  { id: 'i-study-time', scenario: 'Extra Study Time', emoji: '⏱️', prompt: 'If you had extra study time this week, what would you spend it on?',
    targets: ['analyticalThinking', 'technologyInterest', 'communication', 'creativity', 'researchInterest'],
    options: [
      o('a', 'Mathematical problem solving', { analyticalThinking: 14, researchInterest: 4 }),
      o('b', 'A science experiment', { researchInterest: 14, handsOnWork: 6 }),
      o('c', 'Computer programming', { technologyInterest: 14, analyticalThinking: 6 }),
      o('d', 'Writing and communication', { communication: 14, creativity: 4 }),
      o('e', 'Creative design', { creativity: 14, handsOnWork: 4 }),
    ] },
  { id: 'i-direction', scenario: 'Study Direction', emoji: '🧭', prompt: 'When thinking about your future study direction, what matters most?',
    targets: ['analyticalThinking', 'researchInterest', 'businessInterest', 'handsOnWork', 'leadership'],
    options: [
      o('a', 'Subjects I enjoy', { researchInterest: 8, creativity: 6 }),
      o('b', 'Subjects I perform well in', { analyticalThinking: 10 }),
      o('c', 'Future career possibilities', { businessInterest: 10, leadership: 6 }),
      o('d', 'Practical activities', { handsOnWork: 12 }),
      o('e', 'Keeping several options open', { communication: 6, leadership: 4 }),
    ] },
  { id: 'i-subject-link', scenario: 'Subject Link', emoji: '📚', prompt: 'Which kind of class task do you look forward to most?',
    targets: ['analyticalThinking', 'handsOnWork', 'communication', 'helpingPeople'],
    options: [
      o('a', 'Solving a hard numerical problem', { analyticalThinking: 14 }),
      o('b', 'A lab practical', { handsOnWork: 12, researchInterest: 8 }),
      o('c', 'A presentation or essay', { communication: 14, creativity: 4 }),
      o('d', 'A group task helping others learn', { helpingPeople: 12, leadership: 6 }),
    ] },
  { id: 'a-compare', scenario: 'Comparing Degrees', emoji: '🎓', prompt: 'When comparing degree pathways, what matters most to you?',
    targets: ['researchInterest', 'handsOnWork', 'helpingPeople', 'businessInterest', 'analyticalThinking'],
    options: [
      o('a', 'Subjects I genuinely enjoy', { analyticalThinking: 8, creativity: 6 }),
      o('b', 'Career possibilities', { businessInterest: 12, leadership: 6 }),
      o('c', 'Practical work', { handsOnWork: 14 }),
      o('d', 'Research opportunities', { researchInterest: 14, analyticalThinking: 6 }),
      o('e', 'Helping people', { helpingPeople: 14, communication: 4 }),
    ] },
  { id: 'a-work', scenario: 'Future Work', emoji: '💼', prompt: 'Which kind of future work sounds most meaningful?',
    targets: ['researchInterest', 'technologyInterest', 'communication', 'creativity', 'leadership'],
    options: [
      o('a', 'Researching difficult problems', { researchInterest: 14, analyticalThinking: 8 }),
      o('b', 'Building technical systems', { technologyInterest: 14, analyticalThinking: 6 }),
      o('c', 'Working directly with people', { helpingPeople: 12, communication: 10 }),
      o('d', 'Designing creative solutions', { creativity: 14, technologyInterest: 4 }),
      o('e', 'Leading projects', { leadership: 14, businessInterest: 8 }),
    ] },
  { id: 'a-difficult', scenario: 'A Difficult Subject', emoji: '🧗', prompt: 'A degree matches your interests, but one required subject feels difficult. What would you do?',
    targets: ['analyticalThinking', 'researchInterest', 'leadership', 'handsOnWork'],
    options: [
      o('a', 'Create an improvement plan', { leadership: 8, analyticalThinking: 8 }),
      o('b', 'Seek guidance', { communication: 10, helpingPeople: 4 }),
      o('c', 'Explore related degrees as well', { researchInterest: 10, analyticalThinking: 4 }),
      o('d', 'Try practical exposure before deciding', { handsOnWork: 12 }),
      o('e', 'Research admission requirements', { researchInterest: 8, businessInterest: 6, analyticalThinking: 6 }),
    ] },
  { id: 'a-environment', scenario: 'Learning Environment', emoji: '🏛️', prompt: 'Which learning environment would you thrive in?',
    targets: ['researchInterest', 'technologyInterest', 'handsOnWork', 'helpingPeople', 'businessInterest', 'creativity'],
    options: [
      o('a', 'Laboratory / Research', { researchInterest: 14, analyticalThinking: 6 }),
      o('b', 'Technology Projects', { technologyInterest: 14, analyticalThinking: 6 }),
      o('c', 'Field Work', { handsOnWork: 12, researchInterest: 6 }),
      o('d', 'People-Facing Work', { helpingPeople: 12, communication: 10 }),
      o('e', 'Business / Leadership', { businessInterest: 12, leadership: 12 }),
      o('f', 'Creative Studio', { creativity: 14, communication: 4 }),
    ] },
  { id: 'a-pathway', scenario: 'Next-Step Decision', emoji: '🗺️', prompt: 'You are choosing between two good degree options. What helps you decide?',
    targets: ['analyticalThinking', 'communication', 'leadership', 'researchInterest'],
    options: [
      o('a', 'Comparing the subjects in each degree', { analyticalThinking: 12, researchInterest: 6 }),
      o('b', 'Talking to students already in the field', { communication: 12, helpingPeople: 4 }),
      o('c', 'Thinking about where each could lead', { leadership: 8, businessInterest: 8 }),
      o('d', 'Trying a short course or project in each', { handsOnWork: 10, technologyInterest: 6 }),
    ] },
];

export interface QuestionState {
  askedIds: string[];
  tags: string[];
  evidence: Record<DimensionKey, number>;
  dims: Record<DimensionKey, number>;
  lastNote?: string;
  directions?: CareerAreaId[];
  pendingVideo?: VideoFollowUp | null;
  generalInterests?: StudentProfile['generalInterests'];
}

export interface VideoFollowUp { id: string; title: string; area?: CareerAreaId; rating: number; tags: string[] }

export function videoFollowUp(v: VideoFollowUp): Question {
  const branch = areaBranches.find(b => b.area === v.area);
  const focused = v.rating >= 4 ? adaptiveBank().find(q => q.requiresTag && v.tags.includes(q.requiresTag)) : undefined;
  const lowHealthcare = v.area === 'healthcare' && v.rating <= 2;
  const options = lowHealthcare ? [
    signalOption('people', 'Too much direct patient interaction', { researchInterest: 6, analyticalThinking: 4 }, ['healthcare', 'science'], ['less-patient-contact', 'medical-research'], 'Microscope'),
    signalOption('pressure', 'Emergencies and pressure', { helpingPeople: 6, communication: 4 }, ['healthcare'], ['calm-setting'], 'HeartHandshake'),
    signalOption('research', 'I would prefer research', { researchInterest: 10, analyticalThinking: 7 }, ['healthcare', 'science'], ['medical-research', 'lab-work'], 'FlaskConical'),
    signalOption('mind', 'I am more interested in mental wellbeing', { helpingPeople: 8, communication: 10 }, ['healthcare', 'social'], ['mental-health'], 'Brain'),
    signalOption('medicines', 'I am more interested in medicines', { researchInterest: 10, analyticalThinking: 7 }, ['healthcare'], ['medicines'], 'Pill'),
    signalOption('other', 'It simply did not feel interesting', { creativity: 5, technologyInterest: 5 }, [], ['try-another-area'], 'Compass'),
  ] : v.rating <= 2 ? [
    ...(branch?.verify.slice(1) ?? discoveryOptions.slice(0, 3)),
    signalOption('different', 'I would like to try a different kind of work', {}, [], ['try-another-area'], 'Compass'),
  ] : (focused?.options ?? branch?.verify ?? discoveryOptions);
  return {
    id: `feedback-${v.id}-${v.rating}`, scenario: 'Your video, your next step',
    emoji: 'PlayCircle', prompt: v.rating <= 2 ? "What didn't appeal to you?" : v.rating >= 4 ? 'What would you like to explore more deeply?' : 'Which part would you like to try before deciding?',
    targets: [...new Set(options.flatMap(o => Object.keys(o.effects)))] as DimensionKey[], options,
    note: `After “${v.title}”: ${v.rating <= 2 ? 'one rating never rules out a whole field. Let’s find what felt different.' : 'let’s check which parts of the work interest you, not just the career title.'}`,
  };
}

function adaptiveBank(): Question[] {
  const branches: Question[] = areaBranches.flatMap(b => [false, true].map(verify => ({
    id: `explore-${b.area}-${verify ? 'verify' : 'explore'}`,
    scenario: `${areaById(b.area)!.label} · Try & discover`,
    emoji: areaById(b.area)!.icon, prompt: verify ? b.verifyPrompt : b.prompt,
    targets: [...new Set((verify ? b.verify : b.options).flatMap(o => Object.keys(o.effects)))] as DimensionKey[],
    options: verify ? b.verify : b.options, careerArea: b.area,
  })));
  const depth: Array<[string, string, QuestionOption[]]> = [
    ['medicines', 'Learning about medicines involves different tasks. Which sounds interesting?', [
      signalOption('science', 'Finding out how a medicine works', { researchInterest: 10, analyticalThinking: 8 }, ['healthcare', 'science'], ['medicines', 'medical-research'], 'FlaskConical'),
      signalOption('explain', 'Explaining safe use clearly to someone', { communication: 10, helpingPeople: 8 }, ['healthcare'], ['medicines', 'communication'], 'MessagesSquare'),
      signalOption('detail', 'Carefully checking labels and amounts', { analyticalThinking: 10, handsOnWork: 5 }, ['healthcare'], ['medicines', 'lab-work'], 'ClipboardCheck'),
      signalOption('other', 'I would rather design a useful tool', { creativity: 9, technologyInterest: 8 }, ['technology', 'design'], ['digital-creation'], 'Laptop'),
    ]],
    ['mental-health', 'When someone feels worried, which part would you like to learn about?', [
      signalOption('listen', 'Listening patiently without rushing them', { communication: 10, helpingPeople: 9 }, ['healthcare', 'social'], ['mental-health'], 'MessagesSquare'),
      signalOption('why', 'Understanding why people think and feel differently', { researchInterest: 10, analyticalThinking: 7 }, ['healthcare', 'science'], ['mental-health', 'medical-research'], 'Brain'),
      signalOption('child', 'Helping a younger child explain their feelings', { communication: 10, helpingPeople: 8 }, ['healthcare', 'social'], ['mental-health', 'children'], 'Baby'),
      signalOption('creative', 'Making a story or picture about feelings', { creativity: 10, communication: 7 }, ['design'], ['storytelling'], 'Palette'),
    ]],
    ['medical-research', 'A health question has no clear answer yet. Which task interests you?', [
      signalOption('lab', 'Learning to do careful, safe lab tests', { handsOnWork: 9, researchInterest: 10 }, ['healthcare', 'science'], ['lab-work', 'medical-research'], 'Microscope'),
      signalOption('patterns', 'Comparing results to look for patterns', { analyticalThinking: 10, researchInterest: 8 }, ['science', 'healthcare'], ['data', 'medical-research'], 'ChartNoAxesCombined'),
      signalOption('people', 'Talking to people about their experiences', { communication: 10, helpingPeople: 7 }, ['social', 'healthcare'], ['patient-care'], 'Users'),
      signalOption('invent', 'Building a tool that might help', { technologyInterest: 10, handsOnWork: 7 }, ['technology', 'engineering'], ['digital-creation'], 'Wrench'),
    ]],
    ['patient-care', 'In an imaginary clinic, what kind of work would you like to explore?', [
      signalOption('care', 'Talking with people and understanding symptoms', { helpingPeople: 10, communication: 8 }, ['healthcare'], ['patient-care'], 'Stethoscope'),
      signalOption('pressure', 'Learning how a team responds calmly in an emergency', { handsOnWork: 8, leadership: 8, helpingPeople: 6 }, ['healthcare'], ['emergency-work'], 'HeartPulse'),
      signalOption('child', 'Helping children and families feel comfortable', { helpingPeople: 10, communication: 8 }, ['healthcare'], ['children'], 'Baby'),
      signalOption('lab', 'Working quietly with samples rather than patients', { researchInterest: 10, analyticalThinking: 7, handsOnWork: 4 }, ['healthcare', 'science'], ['lab-work', 'less-patient-contact'], 'Microscope'),
    ]],
  ];
  branches.push(...depth.map(([tag, prompt, options]) => ({
    id: `explore-healthcare-depth-${tag}`, scenario: 'Healthcare · look a little deeper', emoji: 'HeartPulse',
    prompt, options, targets: [...new Set(options.flatMap(o => Object.keys(o.effects)))] as DimensionKey[], careerArea: 'healthcare' as const, requiresTag: tag, once: true,
  })));
  return branches.map(q => q.id.endsWith('-explore') ? domainPhotoQuestion(q.careerArea!) : q);
}

export function pickQuestion(s: QuestionState): { question: Question; note?: string } {
  const selected = (question: Question, note?: string) => ({ question, note: note ?? question.note });
  if (s.pendingVideo) {
    const next = photoQuestionParts(videoFollowUp(s.pendingVideo)).find(q => !s.askedIds.includes(q.id));
    if (next) return selected(next);
  }
  const primary = areaById(s.generalInterests?.[0])?.id;
  const broad = photoQuestionParts(broadPhotoQuestion());
  if (!s.askedIds.length) return selected(primary ? photoQuestionParts(domainPhotoQuestion(primary))[0] : broad[0]);
  const directions = s.directions?.length ? s.directions : primary ? [primary] : [];
  if (!directions.length) {
    const next = broad.find(q => !s.askedIds.includes(q.id));
    if (next) return selected(next);
    const labels = ['Helping people feel cared for', 'Creating a simple digital game', 'Making a model that works', 'Running a small school stall', 'Drawing or telling a story', 'Trying a safe science experiment', 'Helping younger students learn', 'Helping a group make a fair decision'];
    const options = areaBranches.map((b, i) => ({ ...b.options[0], id: b.area, label: labels[i] }));
    const more = photoQuestionParts({ id: 'explore-everyday-discovery', scenario: 'Explore different kinds of work', emoji: 'Compass',
      prompt: 'You can try one school club. Which activity sounds interesting?', options, targets: Object.keys(s.dims) as DimensionKey[] })
      .find(q => !s.askedIds.includes(q.id));
    if (more) return selected(more, 'Not knowing yet is okay. Try a few different activities before choosing a direction.');
  }
  const branches = [...healthcareFollowUps, ...adaptiveBank()].flatMap(photoQuestionParts);
  const available = branches.filter(q => !s.askedIds.includes(q.id) && (!q.requiresTag || s.tags.includes(q.requiresTag)));
  const afterFeedback = s.askedIds.slice(-1)[0]?.startsWith('feedback-');
  const broaden = (!afterFeedback && s.askedIds.length > 2 && s.askedIds.length % 4 === 3) || s.tags.slice(-1)[0] === 'try-another-area';
  if (!broaden && directions.length) {
    const direction = s.askedIds.length > 2 && s.askedIds.length % 3 === 2 && directions[1] ? directions[1] : directions[0];
    const next = available.find(q => q.id === `explore-${direction}-explore`)
      ?? available.find(q => q.careerArea === direction && q.requiresTag && s.tags.slice(-6).includes(q.requiresTag))
      ?? available.find(q => q.careerArea === direction);
    if (next) return selected(next, `Let's explore ${areaById(direction)!.short}. Your interests can change.`);
  }
  const general = questionBank.filter(q => !q.requiresTag).flatMap(photoQuestionParts);
  const unasked = [...available, ...general].filter(q => !s.askedIds.includes(q.id));
  const pool = unasked.length ? unasked : [...branches, ...general].filter(q => !q.once && !q.requiresTag);
  let best = pool[0]; let bestScore = -Infinity;
  for (const q of pool) {
    const coverage = q.targets.reduce((n, d) => n + 1 / (1 + s.evidence[d]), 0) / q.targets.length;
    const alternative = broaden && q.careerArea && !directions.slice(0, 2).includes(q.careerArea) ? 0.2 : 0;
    const affinity = q.options.some(o => o.tags?.some(t => s.tags.slice(-6).includes(t))) ? 0.05 : 0;
    const recent = s.askedIds.slice(-8).includes(q.id) ? 1 : 0;
    const score = coverage + alternative + affinity - recent;
    if (score > bestScore) { best = q; bestScore = score; }
  }
  return selected(best);
}

const labels: Record<DimensionKey, string> = {
  analyticalThinking: 'analytical thinking', technologyInterest: 'technology interest', creativity: 'creativity',
  helpingPeople: 'helping people', leadership: 'leadership', communication: 'communication',
  handsOnWork: 'hands-on work', researchInterest: 'research interest', businessInterest: 'business interest',
};
function dimLabel(d: DimensionKey) { return labels[d]; }
