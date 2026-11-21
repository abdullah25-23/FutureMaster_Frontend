import type { CareerAreaId, DimensionKey, QuestionOption } from '../types';
import type { Question } from './questions';
import { areaBranches, areaById, discoveryOptions, signalOption } from './exploration';

// Local, reviewed photographs: no blood, injuries, surgery or frightening scenes.
// Photographer credits and original Unsplash sources are beside the image assets.
export const explorationPhotos = {
  unsure: { src: '/images/exploration/thinking.webp', alt: 'A student taking time to think about different ideas' },
  care: { src: '/images/exploration/patient-care.webp', alt: 'A doctor talking calmly with a patient at a desk' },
  emergency: { src: '/images/exploration/emergency-team.webp', alt: 'An emergency medical team working together beside an ambulance' },
  lab: { src: '/images/exploration/laboratory.webp', alt: 'A researcher adjusting a real laboratory microscope' },
  medicines: { src: '/images/exploration/medicines.webp', alt: 'A pharmacist choosing a medicine box from pharmacy shelves' },
  children: { src: '/images/exploration/child-care.webp', alt: 'A doctor gently checking a child with a stethoscope' },
  listening: { src: '/images/exploration/listening.webp', alt: 'Two people sitting together for a calm, supportive conversation' },
  technology: { src: '/images/exploration/digital-creation.webp', alt: 'A young student creating something on a laptop' },
  drawing: { src: '/images/exploration/drawing.webp', alt: 'A person drawing in a sketchbook with a pen' },
  fixing: { src: '/images/exploration/fixing.webp', alt: 'Hands carefully working on the parts inside a computer' },
  learning: { src: '/images/exploration/learning.webp', alt: 'A teacher explaining a lesson to young students' },
  discussion: { src: '/images/exploration/discussion.webp', alt: 'Students listening, sharing ideas and working together around a table' },
  business: { src: '/images/exploration/shop.webp', alt: 'A shopkeeper talking with a customer at a shop counter' },
  gardening: { src: '/images/exploration/gardening.webp', alt: 'A child and an adult exploring how to care for a growing plant' },
  movement: { src: '/images/exploration/movement.webp', alt: 'A physiotherapist helping someone practise moving their leg' },
  building: { src: '/images/exploration/building-model.webp', alt: 'Hands carefully building a small cardboard model' },
  patterns: { src: '/images/exploration/patterns.webp', alt: 'A person comparing charts and patterns on a computer' },
  filming: { src: '/images/exploration/filming.webp', alt: 'A small film crew creating a story with a camera' },
} satisfies Record<string, NonNullable<QuestionOption['photo']>>;
type PhotoKey = keyof typeof explorationPhotos;

const areaPhoto: Record<CareerAreaId, PhotoKey> = {
  healthcare: 'care', technology: 'technology', engineering: 'building', business: 'business',
  design: 'drawing', science: 'lab', social: 'learning', 'public-service': 'discussion',
};
const optionPhotos: Record<string, Record<string, PhotoKey>> = {
  'visual-discovery': { help: 'care', tech: 'technology', design: 'drawing', build: 'fixing', discover: 'lab' },
  'healthcare-explore': { talk: 'care', urgent: 'emergency', cause: 'lab', medicine: 'medicines', children: 'children', mind: 'listening', body: 'lab' },
  'healthcare-verify': { children: 'children', movement: 'movement', lab: 'lab', listen: 'listening', different: 'technology' },
  'technology-explore': { create: 'technology', protect: 'technology', patterns: 'patterns', look: 'drawing' },
  'technology-verify': { fix: 'technology', ask: 'discussion', physical: 'building', explain: 'drawing' },
  'engineering-explore': { build: 'building', power: 'fixing', machine: 'fixing', design: 'drawing' },
  'engineering-verify': { test: 'building', research: 'lab', sketch: 'drawing', team: 'discussion' },
  'business-explore': { idea: 'business', money: 'patterns', people: 'business', team: 'discussion' },
  'business-verify': { ask: 'business', numbers: 'patterns', poster: 'drawing', tool: 'technology' },
  'design-explore': { visual: 'drawing', story: 'filming', useful: 'building', digital: 'technology' },
  'design-verify': { listen: 'discussion', draw: 'drawing', build: 'building', story: 'filming' },
  'science-explore': { test: 'lab', living: 'gardening', data: 'patterns', explain: 'learning' },
  'science-verify': { again: 'lab', health: 'care', make: 'building', share: 'learning' },
  'social-explore': { teach: 'learning', listen: 'listening', understand: 'patterns', organise: 'discussion' },
  'social-verify': { activity: 'learning', research: 'patterns', tool: 'technology', fair: 'discussion' },
  'public-service-explore': { listen: 'discussion', facts: 'patterns', speak: 'discussion', service: 'discussion' },
  'public-service-verify': { reason: 'discussion', study: 'patterns', care: 'listening', plan: 'discussion' },
  'healthcare-depth-medicines': { science: 'lab', explain: 'medicines', detail: 'medicines', other: 'drawing' },
  'healthcare-depth-mental-health': { listen: 'listening', why: 'patterns', child: 'learning', creative: 'drawing' },
  'healthcare-depth-medical-research': { lab: 'lab', patterns: 'patterns', people: 'care', invent: 'fixing' },
  'healthcare-depth-patient-care': { care: 'care', pressure: 'emergency', child: 'children', lab: 'lab', patient: 'care' },
  'healthcare-depth-children': { listen: 'children', patient: 'learning', play: 'drawing', research: 'lab' },
  'healthcare-depth-emergency-work': { calm: 'emergency', quick: 'emergency', support: 'care', quiet: 'lab' },
  volunteer: { a: 'learning', b: 'discussion', c: 'building', d: 'patterns' },
  'fair-stall': { a: 'patterns', b: 'business', c: 'drawing', d: 'discussion' },
  mystery: { a: 'gardening', b: 'building', c: 'learning', d: 'gardening' },
  'poster-story': { a: 'drawing', b: 'drawing', c: 'technology', d: 'patterns' },
};

const shortLabels: Record<string, Record<string, string>> = {
  exhibition: { a: 'Making a robot work', b: 'Drawing a poster', c: 'Explaining our idea', d: 'Helping the team', e: 'Finding new ideas' },
  'group-project': { a: 'Solving a problem', b: 'Finding information', c: 'Drawing the idea', d: 'Explaining it', e: 'Organising the team' },
  'area-pick': { b: 'How computer tools are made', e: 'How buildings and machines work' },
  'hc-2': { a: 'Helping with feelings', b: 'Learning about medicines', c: 'Food and health', d: 'Finding answers about health', e: 'Keeping communities healthy', f: 'Making useful health tools', g: 'Learning how the body works' },
  volunteer: { b: 'Organising helpers', d: 'Finding out who needs help' },
  puzzle: { d: 'Using a computer to help' },
  'poster-story': { a: 'A drawing or design', c: 'Something people can use on a computer', d: 'Asking students what they think' },
  'i-projects': { a: 'Making a useful computer tool', b: 'Exploring how living things work', c: 'Designing a poster or story', e: 'Finding ways to help our community' },
  'i-study-time': { a: 'A maths puzzle', b: 'A science experiment', c: 'Making something on a computer', d: 'Writing and sharing ideas', e: 'Drawing a design' },
  'i-direction': { c: 'Where my interests could lead', e: 'Trying different things' },
  'i-subject-link': { a: 'Solving a maths puzzle', b: 'Trying a safe experiment' },
  'a-compare': { a: 'Enjoying the subject', b: 'Seeing how I could use it', c: 'Trying it out', d: 'Finding new answers', e: 'Helping people' },
  'a-work': { a: 'Finding answers to questions', b: 'Making useful tools', c: 'Helping people', d: 'Creating something new', e: 'Helping a team' },
  'a-difficult': { a: 'Making a practice plan', b: 'Asking for help', c: 'Trying a related topic', d: 'Trying a small activity', e: 'Finding out what I need to learn' },
  'a-environment': { a: 'A place for science experiments', b: 'A computer project', c: 'Learning outdoors', d: 'Working with people', e: 'Organising a team', f: 'A place to draw and create' },
  'a-pathway': { a: 'Finding out what I would learn', b: 'Talking to someone who has tried it', c: 'Seeing where it could lead', d: 'Trying a small project in each' },
  'healthcare-depth-medicines': { science: 'Finding out how medicines work', explain: 'Explaining safe medicine use', detail: 'Checking labels carefully', other: 'Designing a useful tool' },
  'healthcare-depth-mental-health': { listen: 'Listening patiently', why: 'Understanding feelings', child: 'Helping a child share feelings', creative: 'Drawing a story about feelings' },
  'healthcare-depth-medical-research': { lab: 'Trying careful lab tests', patterns: 'Finding patterns in results', people: 'Asking about their experiences', invent: 'Building a helpful tool' },
  'healthcare-depth-patient-care': { care: 'Talking and helping', pressure: 'Learning to stay calm', child: 'Helping families feel at ease', lab: 'Working in a quiet lab' },
  'healthcare-verify': { children: 'Helping a child feel calm', movement: 'Helping people move again', lab: 'Comparing lab results', listen: 'Listening to worries', different: 'Making something new instead' },
};

const simplePrompts: Record<string, string> = {
  exhibition: 'Your class is making a science display. What would you enjoy?',
  'group-project': 'Your friends are working on a project. How would you help?',
  'i-direction': 'What helps you choose something new to learn?',
  'a-compare': 'What would make you want to keep learning about a topic?',
  'a-work': 'What kind of work would you like to try one day?',
  'a-difficult': 'You like a topic, but part of it is hard. What would you try?',
  'a-environment': 'Where would you enjoy learning something new?',
  'a-pathway': 'Two things interest you. What would help you choose what to try?',
};

export function domainPhotoQuestion(area: CareerAreaId): Question {
  const definition = areaById(area)!;
  const branch = areaBranches.find(b => b.area === area)!;
  const byId = (id: string) => branch.options.find(o => o.id === id)!;
  const options = area === 'healthcare' ? [
    { ...byId('talk'), label: 'Talking to and helping patients', tags: ['patient-care', 'communication', 'patience', 'direct-care'] },
    { ...byId('cause'), label: 'Discovering what causes illness', tags: ['medical-research', 'lab-work', 'biology', 'less-patient-contact'] },
    { ...byId('medicine'), label: 'Learning about medicines', tags: ['medicines', 'chemistry'] },
    { ...byId('urgent'), label: 'Helping during an emergency', tags: ['emergency-work', 'pressure-handling', 'fast-decisions'] },
    signalOption('children', 'Helping children feel better', { helpingPeople: 9, communication: 8 }, ['healthcare'], ['children', 'patience', 'communication'], 'Baby'),
    { ...byId('mind'), label: 'Listening and helping with feelings', tags: ['mental-health', 'listening', 'empathy'] },
  ] : branch.options;
  return {
    id: `explore-${area}-explore`, careerArea: area,
    scenario: `${definition.label} · Try & discover`, emoji: definition.icon, visual: true,
    prompt: `Which of these ${definition.short} activities looks most interesting to you?`,
    targets: [...new Set(options.flatMap(o => Object.keys(o.effects)))] as DimensionKey[], options,
  };
}

export function broadPhotoQuestion(): Question {
  return {
    id: 'visual-discovery', scenario: 'Try something new', emoji: 'Compass', visual: true,
    prompt: 'Which of these activities looks most interesting to you?',
    targets: ['helpingPeople', 'technologyInterest', 'creativity', 'handsOnWork', 'researchInterest'],
    // The caring photo depicts a medical consultation. Start there; later answers
    // can still reveal teaching, counselling or another helping direction.
    options: discoveryOptions.map(option => option.id === 'help' ? { ...option, areas: ['healthcare'] } : option),
  };
}

// Focused questions verify which parts of healthcare the student wants to try.
export const healthcareFollowUps: Question[] = [
  {
    id: 'explore-healthcare-depth-children', careerArea: 'healthcare', requiresTag: 'children',
    scenario: 'Helping children · Look a little deeper', emoji: 'HeartPulse',
    prompt: 'A child feels worried at a check-up. What would you enjoy helping with?',
    targets: ['helpingPeople', 'communication', 'creativity', 'researchInterest', 'analyticalThinking'],
    options: [
      signalOption('listen', 'Listening and explaining gently', { communication: 10, helpingPeople: 8 }, ['healthcare'], ['children', 'patient-care', 'communication']),
      signalOption('patient', 'Helping them practise patiently', { helpingPeople: 10, communication: 7 }, ['healthcare', 'social'], ['children', 'patience']),
      signalOption('play', 'Making a picture or game to help', { creativity: 10, helpingPeople: 6 }, ['design', 'healthcare'], ['children', 'visual-design']),
      signalOption('research', 'Finding out how children stay healthy', { researchInterest: 10, analyticalThinking: 7 }, ['healthcare', 'science'], ['children', 'medical-research']),
    ],
  },
  {
    id: 'explore-healthcare-depth-emergency-work', careerArea: 'healthcare', requiresTag: 'emergency-work',
    scenario: 'Helping in a hurry · Look a little deeper', emoji: 'HeartPulse',
    prompt: 'In a pretend emergency, which part would you like to learn about?',
    targets: ['handsOnWork', 'leadership', 'helpingPeople', 'analyticalThinking', 'researchInterest', 'communication'],
    options: [
      signalOption('calm', 'Staying calm and following safe steps', { handsOnWork: 9, analyticalThinking: 7 }, ['healthcare'], ['emergency-work', 'pressure-handling']),
      signalOption('quick', 'Helping a team decide what to do first', { leadership: 9, analyticalThinking: 8 }, ['healthcare'], ['emergency-work', 'fast-decisions']),
      signalOption('support', 'Helping someone feel safe and heard', { helpingPeople: 10, communication: 8 }, ['healthcare'], ['patient-care', 'communication']),
      signalOption('quiet', 'Working in a quieter place instead', { researchInterest: 9, analyticalThinking: 7 }, ['healthcare', 'science'], ['calm-setting', 'lab-work', 'less-patient-contact']),
    ],
  },
];

function photoContext(q: Question) {
  const key = q.id.replace(/^explore-/, '');
  if (!q.id.startsWith('feedback-')) return key;
  if (q.options.some(o => o.id === 'science' && o.tags?.includes('medicines'))) return 'healthcare-depth-medicines';
  if (q.options.some(o => o.id === 'why' && o.tags?.includes('mental-health'))) return 'healthcare-depth-mental-health';
  if (q.options.some(o => o.id === 'invent' && o.areas?.includes('engineering'))) return 'healthcare-depth-medical-research';
  if (q.options.some(o => o.id === 'care' && o.tags?.includes('patient-care'))) return 'healthcare-depth-patient-care';
  return key;
}

function photoForOption(q: Question, option: QuestionOption): QuestionOption['photo'] {
  const key = photoContext(q);
  const explicit = optionPhotos[key]?.[option.id];
  if (explicit) return explorationPhotos[explicit];
  if (key === 'everyday-discovery') return explorationPhotos[areaPhoto[option.id as CareerAreaId]];
  const tags = option.tags ?? [];
  if (tags.includes('try-another-area')) return undefined;
  const tagPhotos: Array<[string, PhotoKey]> = [
    ['children', 'children'], ['emergency-work', 'emergency'], ['medicines', 'medicines'], ['mental-health', 'listening'],
    ['movement', 'movement'], ['lab-work', 'lab'], ['medical-research', 'lab'], ['less-patient-contact', 'lab'],
    ['calm-setting', 'listening'], ['patient-care', 'care'], ['visual-design', 'drawing'], ['user-design', 'drawing'],
    ['storytelling', 'filming'], ['digital-creation', 'technology'], ['software', 'technology'], ['cybersecurity', 'technology'],
    ['data', 'patterns'], ['ai', 'patterns'], ['investigation', 'lab'], ['evidence', 'patterns'],
    ['structures', 'building'], ['spaces', 'drawing'], ['practical-work', 'fixing'], ['machines', 'fixing'], ['energy', 'fixing'],
    ['teaching', 'learning'], ['learning-research', 'patterns'], ['biology', 'gardening'], ['venture', 'business'], ['marketing', 'business'],
    ['finance', 'patterns'], ['teamwork', 'discussion'], ['community', 'discussion'], ['fairness', 'discussion'], ['advocacy', 'discussion'],
  ];
  const match = tagPhotos.find(([tag]) => tags.includes(tag));
  return match ? explorationPhotos[match[1]] : q.careerArea ? explorationPhotos[areaPhoto[q.careerArea]] : undefined;
}

export function withExplorationPhotos(q: Question): Question {
  const labels = shortLabels[photoContext(q)] ?? {};
  const options = q.id === 'explore-healthcare-depth-patient-care'
    ? [...q.options, signalOption('patient', 'Helping patiently, step by step', { helpingPeople: 10, communication: 7 }, ['healthcare'], ['patient-care', 'patience', 'communication'])]
    : q.options;
  const choices = options.map(option => ({
    ...option, label: labels[option.id] ?? option.label, photo: photoForOption(q, option),
  }));
  return { ...q, prompt: simplePrompts[q.id] ?? q.prompt, visual: choices.some(o => !!o.photo), options: choices };
}

/** Three real answers and one equally prominent unsure choice on every question. */
export function photoQuestionParts(question: Question): Question[] {
  const q = withExplorationPhotos(question);
  const answers = q.options.filter(option => option.id !== 'unsure');
  if (answers.length < 3) throw new Error(`Question ${q.id} needs at least three different answers`);
  const parts: Question[] = [];
  for (let start = 0; start < answers.length; start += 3) {
    const options = answers.slice(start, start + 3);
    // Overlap earlier answers in a final short group rather than inventing evidence or dropping activities.
    for (const option of answers) {
      if (options.length === 3) break;
      if (!options.some(o => o.id === option.id)) options.push(option);
    }
    const visual = options.some(option => !!option.photo);
    const unsure: QuestionOption = { id: 'unsure', label: "I'm not sure yet", effects: {}, ...(visual ? { photo: explorationPhotos.unsure } : {}) };
    parts.push({ ...q, id: start ? `${q.id}-more-${start / 3}` : q.id,
      options: [...options.map(option => visual && !option.photo ? { ...option, photo: explorationPhotos.unsure } : option), unsure], visual,
      note: start ? 'Here are a few more activities you can explore.' : q.note });
  }
  return parts;
}
