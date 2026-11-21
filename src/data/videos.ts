import { CareerAreaId, DimensionKey, InterestDimensions, StudentProfile } from '../types';
import { explorationPhotos } from './photoExploration';
import { AreaInterest, areaById, areaForCluster, careerAreas, careerTags, ExplorationSignal } from './exploration';

export type VideoCategory = 'Day in the Life' | 'Career Reality' | 'Degree to Career' | 'Compare Careers';
export interface Video {
  id: string; title: string; area: string; thumb: string; duration: string; description: string;
  dim: DimensionKey; clusterId?: string; careerIds?: string[]; degreeIds?: string[]; category?: VideoCategory;
  tags?: string[];
}
export type VideoSectionKey = 'interests' | 'related' | 'new';

export const videoSections: { key: VideoSectionKey; title: string }[] = [
  { key: 'interests', title: 'Based on Your Interests' },
  { key: 'related', title: 'Related Areas' },
  { key: 'new', title: 'Explore Something New' },
];
export const videoCategories: VideoCategory[] = ['Day in the Life', 'Career Reality', 'Degree to Career', 'Compare Careers'];

const v = (id: string, title: string, area: string, thumb: string, duration: string, dim: DimensionKey, description: string,
  extra: Partial<Video> = {}): Video => ({ id, title, area, thumb, duration, dim, description, ...extra });

export const videos: Video[] = [
  ...([
    ['health-pharmacy', 'What Does a Pharmacist Do?', 'Pill', 'researchInterest', 'health', 'pharmacist', 'medicines', 'See how pharmacists learn about medicines, check details and explain safe use.'],
    ['health-mind', 'Psychology & Mental Health', 'Brain', 'communication', 'health', 'psychologist', 'mental-health', 'Discover how careful listening and understanding feelings can support wellbeing.'],
    ['health-research', 'Medical Research: Asking New Questions', 'Microscope', 'researchInterest', 'health', 'biomedical-researcher', 'medical-research', 'Meet people who study health questions through careful experiments and evidence.'],
    ['health-movement', 'How Physiotherapy Helps People', 'Activity', 'handsOnWork', 'health', 'physiotherapist', 'movement', 'See how movement, practice and encouragement can support recovery.'],
    ['health-children', 'Exploring Child Healthcare', 'Baby', 'helpingPeople', 'health', 'pediatrician', 'children', 'Discover how children’s doctors communicate with children and families.'],
    ['tech-software', 'What Does a Software Engineer Do?', 'Laptop', 'technologyInterest', 'tech', 'software-engineer', 'software', 'See how a team creates useful digital tools, solves problems and tests ideas.'],
    ['tech-security', 'Keeping People Safe Online', 'ShieldCheck', 'technologyInterest', 'tech', 'cybersecurity-analyst', 'cybersecurity', 'Explore the careful problem-solving behind protecting information.'],
    ['tech-ai', 'Exploring AI & Machine Learning', 'Brain', 'analyticalThinking', 'tech', 'ai-engineer', 'ai', 'A simple look at how people use examples and patterns to create helpful tools.'],
    ['tech-design', 'Making Apps Easy to Use: UI/UX', 'PanelsTopLeft', 'creativity', 'tech', 'ux-designer', 'user-design', 'Discover how listening, sketching and testing make digital tools easier to use.'],
    ['tech-data', 'What Does a Data Analyst Do?', 'ChartNoAxesCombined', 'analyticalThinking', 'tech', 'data-scientist', 'data', 'Follow a question from information to patterns to a clear explanation.'],
    ['public-law', 'Fairness, Law & Public Service', 'Scale', 'communication', 'law', 'lawyer', 'fairness', 'See how people listen to different viewpoints, check evidence and support fair decisions.'],
  ] as const).map(([id, title, thumb, dim, clusterId, careerId, tag, description]) =>
    v(id, title, clusterId === 'health' ? 'Healthcare & Medicine' : clusterId === 'law' ? 'Law & Public Service' : 'Computing & Technology',
      thumb, '3:00', dim, description, { clusterId, careerIds: [careerId], tags: [tag], category: 'Career Reality' })),
  // Broad awareness, short and friendly
  v('b-robotics', 'What Does a Robotics Engineer Do?', 'Engineering & Robotics', '🤖', '2:40', 'technologyInterest', 'A friendly look at how people design, build and test robots.', { clusterId: 'engineering', careerIds: ['mechanical-engineer', 'electrical-engineer'] }),
  v('b-doctor', 'A Day in the Life of a Doctor', 'Medical & Health Sciences', '🩺', '3:00', 'helpingPeople', 'Follow a doctor through a typical day and see how they help people.', { clusterId: 'health', careerIds: ['doctor'] }),
  v('b-architect', 'How Architects Design Buildings', 'Design & Architecture', '🏛️', '2:50', 'creativity', 'See how an idea on paper becomes a building people can use.', { clusterId: 'design' }),
  v('b-game', 'What Does a Game Developer Do?', 'Technology & Computing', '🎮', '2:45', 'technologyInterest', 'Discover how games are imagined, built and tested by a team.', { clusterId: 'tech', careerIds: ['software-engineer'] }),
  v('b-scientist', 'Scientists and How They Solve Problems', 'Research & Science', '🔬', '3:10', 'researchInterest', 'How scientists ask questions, test ideas and learn from results.', { clusterId: 'research' }),
  v('b-teacher', 'A Day in the Life of a Teacher', 'Education', '📚', '2:30', 'communication', 'What teachers do before, during and after class.', { clusterId: 'education' }),
  v('b-business', 'How a Small Shop Becomes a Business', 'Business & Management', '🛍️', '2:55', 'businessInterest', 'A simple story of planning, selling and growing an idea.', { clusterId: 'business', careerIds: ['entrepreneur'] }),
  v('b-pilot', 'Behind the Scenes at an Airport', 'Aviation & Hospitality', '✈️', '3:05', 'handsOnWork', 'The many roles that keep planes and passengers moving.', { clusterId: 'aviation' }),

  // Fields, subjects and study directions
  v('i-cs', 'Careers in Computer Science', 'Technology & Computing', '💻', '4:00', 'technologyInterest', 'Fields in computing and the subjects, like Mathematics and Computer Science, that connect to them.', { clusterId: 'tech', careerIds: ['software-engineer', 'data-scientist'] }),
  v('i-eng', 'Engineering Fields Explained', 'Engineering & Robotics', '⚙️', '4:10', 'analyticalThinking', 'Civil, electrical and mechanical engineering, and the subjects each builds on.', { clusterId: 'engineering', careerIds: ['civil-engineer', 'mechanical-engineer', 'electrical-engineer'] }),
  v('i-health', 'Healthcare Careers Beyond Becoming a Doctor', 'Medical & Health Sciences', '🧬', '4:20', 'helpingPeople', 'Pharmacy, lab science, psychology and other healthcare paths worth exploring.', { clusterId: 'health', careerIds: ['pharmacist', 'psychologist', 'med-lab-scientist'] }),
  v('i-ics', 'What Can You Do After ICS?', 'Study Pathways', '🧭', '4:05', 'technologyInterest', 'Possible directions after ICS, from computing degrees to business and data.', { clusterId: 'tech', degreeIds: ['cs', 'se'] }),
  v('i-premed', 'What Can You Do After FSc Pre-Medical?', 'Study Pathways', '🧪', '4:15', 'researchInterest', 'Medical and many related health and science routes after Pre-Medical.', { clusterId: 'health', degreeIds: ['mbbs', 'pharmd', 'mlt'] }),
  v('i-creative', 'Creative Careers and Design Fields', 'Arts & Design', '🎨', '3:40', 'creativity', 'Design fields, the subjects that help, and where creative study can lead.', { clusterId: 'design', degreeIds: ['design'] }),
  v('i-business', 'Business and Commerce Career Paths', 'Business & Management', '📈', '3:50', 'businessInterest', 'Commerce subjects and the business, finance and management paths connected to them.', { clusterId: 'business', degreeIds: ['bba', 'finance'] }),
  v('i-social', 'Careers That Work With People and Society', 'Social Sciences', '🤝', '3:45', 'communication', 'Psychology, law, education and social work, and how subjects connect to them.', { clusterId: 'social' }),

  // Day in the Life
  v('a-d-swe', 'Day in the Life of a Software Engineer', 'Technology & Computing', '💻', '6:10', 'technologyInterest', 'Stand-ups, code reviews, debugging and shipping: a realistic software team day.', { category: 'Day in the Life', clusterId: 'tech', careerIds: ['software-engineer'] }),
  v('a-d-doctor', 'Day in the Life of a Doctor', 'Medical & Health Sciences', '🩺', '6:30', 'helpingPeople', 'Rounds, patients, long hours and teamwork in a typical clinical day.', { category: 'Day in the Life', clusterId: 'health', careerIds: ['doctor'] }),
  v('a-d-pharm', 'Day in the Life of a Pharmacist', 'Medical & Health Sciences', '💊', '5:40', 'researchInterest', 'Dispensing, checking prescriptions and advising patients.', { category: 'Day in the Life', clusterId: 'health', careerIds: ['pharmacist'] }),
  v('a-d-psych', 'Day in the Life of a Psychologist', 'Medical & Health Sciences', '🧠', '5:50', 'communication', 'Sessions, notes, research and the emotional side of the work.', { category: 'Day in the Life', clusterId: 'health', careerIds: ['psychologist'] }),
  v('a-d-civil', 'Day in the Life of a Civil Engineer', 'Engineering & Robotics', '🏗️', '6:00', 'handsOnWork', 'Site visits, drawings, safety checks and coordination.', { category: 'Day in the Life', clusterId: 'engineering', careerIds: ['civil-engineer'] }),
  v('a-d-ds', 'Day in the Life of a Data Scientist', 'Research & Data', '📊', '5:55', 'analyticalThinking', 'Cleaning data, building models and explaining results to others.', { category: 'Day in the Life', clusterId: 'tech', careerIds: ['data-scientist'] }),
  v('a-d-cyber', 'A Day in Cybersecurity', 'Technology & Computing', '🛡️', '5:45', 'technologyInterest', 'Monitoring systems, investigating alerts and hardening defences.', { category: 'Day in the Life', clusterId: 'tech', careerIds: ['cybersecurity-analyst'] }),
  // Career Reality
  v('a-r-swe', 'What Does a Software Engineer Actually Do?', 'Technology & Computing', '⌨️', '7:00', 'technologyInterest', 'Software Engineering: what the work is really like, beyond just writing code.', { category: 'Career Reality', clusterId: 'tech', careerIds: ['software-engineer'], degreeIds: ['se', 'cs'] }),
  v('a-r-mbbs', 'What Is Studying MBBS Really Like?', 'Medical & Health Sciences', '🏥', '7:20', 'helpingPeople', 'The years of study, workload and clinical training, explained honestly.', { category: 'Career Reality', clusterId: 'health', careerIds: ['doctor'], degreeIds: ['mbbs'] }),
  v('a-r-psych', 'What Does a Psychologist Actually Do?', 'Social Sciences', '🧠', '6:40', 'communication', 'Clinical, counselling, research and organizational roles compared with the popular image.', { category: 'Career Reality', clusterId: 'health', careerIds: ['psychologist'], degreeIds: ['psych'] }),
  v('a-r-civil', 'What Does a Civil Engineer Work On?', 'Engineering & Robotics', '🌉', '6:35', 'handsOnWork', 'Roads, buildings, water systems and the planning behind them.', { category: 'Career Reality', clusterId: 'engineering', careerIds: ['civil-engineer'], degreeIds: ['eng-civil'] }),
  v('a-r-ds', 'What Does a Data Scientist Do?', 'Research & Data', '📈', '6:50', 'researchInterest', 'Questions, data, modelling and communication: the real mix of tasks.', { category: 'Career Reality', clusterId: 'research', careerIds: ['data-scientist'], degreeIds: ['ds'] }),
  v('a-r-cyber', 'Cybersecurity Careers Explained', 'Technology & Computing', '🔐', '6:25', 'technologyInterest', 'Different security roles, what they need and how people enter the field.', { category: 'Career Reality', clusterId: 'tech', careerIds: ['cybersecurity-analyst'] }),
  v('a-r-forensics', 'Digital Forensics Explained', 'Technology & Computing', '🔎', '5:30', 'analyticalThinking', 'How investigators recover and examine digital evidence.', { category: 'Career Reality', clusterId: 'tech', careerIds: ['cybersecurity-analyst'] }),
  // Degree to Career
  v('a-g-cs', 'Careers After BS Computer Science', 'Computing', '🎓', '6:15', 'technologyInterest', 'BSCS: subjects, careers and what to expect.', { category: 'Degree to Career', clusterId: 'tech', degreeIds: ['cs'] }),
  v('a-g-se', 'Careers After BS Software Engineering', 'Computing', '🧩', '6:05', 'technologyInterest', 'How a software engineering degree connects to industry roles.', { category: 'Degree to Career', clusterId: 'tech', degreeIds: ['se'] }),
  v('a-g-bba', 'Careers After BBA', 'Business', '💼', '5:50', 'businessInterest', 'Management, marketing, finance and entrepreneurship routes after BBA.', { category: 'Degree to Career', clusterId: 'business', degreeIds: ['bba'] }),
  v('a-g-psych', 'Careers After Psychology', 'Social Sciences', '🧠', '5:45', 'communication', 'Clinical, educational, organizational and research routes after a psychology degree.', { category: 'Degree to Career', clusterId: 'health', degreeIds: ['psych'] }),
  v('a-g-eng', 'Careers After Engineering Degrees', 'Engineering', '🛠️', '6:20', 'analyticalThinking', 'Civil, electrical and mechanical engineering and the careers that follow.', { category: 'Degree to Career', clusterId: 'engineering', degreeIds: ['eng-civil', 'eng-elec', 'eng-mech'] }),
  v('a-g-health', 'Healthcare Degrees and Their Career Paths', 'Health Sciences', '⚕️', '6:30', 'helpingPeople', 'MBBS, Pharm-D, lab science and related degrees compared by path.', { category: 'Degree to Career', clusterId: 'health', degreeIds: ['mbbs', 'pharmd', 'mlt'] }),
  // Compare Careers
  v('a-c-swe-ds', 'Software Engineering vs Data Science', 'Technology & Computing', '⚖️', '7:10', 'analyticalThinking', 'Daily work, skills and study routes side by side.', { category: 'Compare Careers', clusterId: 'tech', careerIds: ['software-engineer', 'data-scientist'], degreeIds: ['se', 'ds'] }),
  v('a-c-cs-se', 'Computer Science vs Software Engineering', 'Computing', '⚖️', '6:45', 'technologyInterest', 'How the two degrees differ in focus and outcomes.', { category: 'Compare Careers', clusterId: 'tech', degreeIds: ['cs', 'se'] }),
  v('a-c-med-pharm', 'Medicine vs Pharmacy', 'Medical & Health Sciences', '⚖️', '7:00', 'helpingPeople', 'Training length, daily work and patient contact compared.', { category: 'Compare Careers', clusterId: 'health', careerIds: ['doctor', 'pharmacist'], degreeIds: ['mbbs', 'pharmd'] }),
  v('a-c-psy', 'Psychology vs Psychiatry', 'Medical & Health Sciences', '⚖️', '6:30', 'communication', 'Two different training routes and ways of supporting wellbeing.', { category: 'Compare Careers', clusterId: 'health', careerIds: ['psychologist'], degreeIds: ['psych', 'mbbs'] }),
  v('a-c-civ-arch', 'Civil Engineering vs Architecture', 'Engineering & Design', '⚖️', '6:50', 'creativity', 'Technical structure versus design vision, and where they overlap.', { category: 'Compare Careers', clusterId: 'engineering', careerIds: ['civil-engineer'], degreeIds: ['eng-civil', 'design'] }),
  v('a-c-cs-ee', 'Computer Science vs Electrical Engineering', 'Computing & Engineering', '⚖️', '6:55', 'technologyInterest', 'Software-first versus hardware-and-systems-first study.', { category: 'Compare Careers', clusterId: 'engineering', careerIds: ['electrical-engineer'], degreeIds: ['cs', 'eng-elec'] }),
  v('a-c-secengineer', 'Security Engineer vs Cybersecurity Analyst', 'Technology & Computing', '⚖️', '6:10', 'technologyInterest', 'Building secure systems versus monitoring and responding to threats.', { category: 'Compare Careers', clusterId: 'tech', careerIds: ['cybersecurity-analyst'] }),
  v('a-n-media', 'Telling Stories: Careers in Media', 'Media & Communication', '🎬', '5:35', 'creativity', 'Journalism, production and digital media: the work and the study routes.', { category: 'Career Reality', clusterId: 'media' }),
];

export const ratingLabels: Record<number, string> = { 1: 'Not interested', 2: 'Slightly interested', 3: 'Somewhat interested', 4: 'Interested', 5: 'Very interested' };

export const videoById = (id?: string) => videos.find(x => x.id === id);

export function videosForProfile(dims: Record<DimensionKey, number>, areas: AreaInterest[] = [], feedback: Record<string, number> = {}, signals: ExplorationSignal[] = []): Record<VideoSectionKey, Video[]> {
  const pool = videos;
  const tags = signals.filter(s => s.strength > 0).flatMap(s => s.tags);
  const score = (v: Video) => {
    const area = areas.findIndex(a => a.id === areaForCluster(v.clusterId));
    const match = videoTags(v).filter(t => tags.includes(t)).length;
    const doctorIntro = areas[0]?.id === 'healthcare' && v.careerIds?.includes('doctor') && !Object.keys(feedback).some(id => videoById(id)?.clusterId === 'health') ? 12 : 0;
    const discovery = !areas.length && ['b-scientist', 'b-architect', 'b-teacher', 'i-cs', 'i-creative', 'i-business', 'a-d-swe', 'a-d-civil', 'a-n-media'].includes(v.id) ? 10 : 0;
    return dims[v.dim] / 10 + (area === 0 ? 30 : area === 1 ? 12 : 0) + match * 14 + doctorIntro + discovery - (feedback[v.id] ? 60 : 0);
  };
  const ranked = pool.slice().sort((a, b) => score(b) - score(a));
  const total = ranked.length;
  const big = total > 12;
  const nI = big ? 4 : 3; const nN = big ? 3 : 3; const nR = big ? 3 : 3;
  const fresh = ranked.slice(nI + nR).reverse().slice(0, nN);
  const interests = ranked.slice(0, nI);
  const related = ranked.slice(nI, nI + nR);
  return { interests, related, new: fresh };
}

export const videoTags = (v: Video) => v.tags ?? [...new Set(v.careerIds?.flatMap(id => careerTags[id] ?? []) ?? [])];

export function relatedVideosForCareer(careerId: string, clusterId: string): Video[] {
  const direct = videos.filter(x => x.careerIds?.includes(careerId));
  const list = direct.length ? direct : videos.filter(x => x.clusterId === clusterId);
  return list.slice(0, 3);
}

export const relatedVideoForDegree = (degreeId: string) => videos.find(x => x.degreeIds?.includes(degreeId));

export function videoPhoto(video: Video) {
  const tags = videoTags(video);
  if (tags.includes('medicines')) return explorationPhotos.medicines;
  if (tags.includes('children')) return explorationPhotos.children;
  if (tags.includes('mental-health')) return explorationPhotos.listening;
  if (tags.includes('movement')) return explorationPhotos.movement;
  if (tags.includes('medical-research') || tags.includes('lab-work')) return explorationPhotos.lab;
  const byArea: Record<CareerAreaId, keyof typeof explorationPhotos> = {
    healthcare: 'care', technology: 'technology', engineering: 'fixing', business: 'business',
    design: 'drawing', science: 'lab', social: 'learning', 'public-service': 'discussion',
  };
  return explorationPhotos[byArea[areaForCluster(video.clusterId) ?? 'science']];
}

/** One current-interest video and one meaningful different-area video. Neither affects session completion. */
export function sessionVideoRecommendations(
  dims: InterestDimensions, areas: AreaInterest[], profile: StudentProfile,
  feedback: Record<string, number>, signals: ExplorationSignal[], session: number,
): [Video, Video] {
  const recent = signals.filter(s => s.source === 'question' && s.session === session);
  const recentAreaScore = (id: CareerAreaId) => {
    const weights = areaById(id)!.weights;
    const total = Object.values(weights).reduce((n, weight) => n + weight!, 0);
    return recent.reduce((n, s) => n + (s.areas.includes(id) ? s.strength : 0)
      + (!s.areas.length ? Object.entries(weights).reduce((sum, [key, weight]) => sum + (s.effects?.[key as DimensionKey] ?? 0) * weight!, 0) / total / 4 : 0), 0);
  };
  const sessionDimensions = (dim: DimensionKey) => recent.reduce((n, s) => n + (s.effects?.[dim] ?? 0), 0);
  const observed = careerAreas.slice().sort((a, b) => recentAreaScore(b.id) - recentAreaScore(a.id));
  const fallback = areas[0]?.id ?? areaById(profile.generalInterests[0])?.id
    ?? careerAreas.slice().sort((a, b) => {
      const affinity = (area: typeof a) => Object.entries(area.weights).reduce((n, [key, weight]) => n + dims[key as DimensionKey] * weight!, 0)
        / Object.values(area.weights).reduce((n, weight) => n + weight!, 0);
      return affinity(b) - affinity(a);
    })[0].id;
  const primary = recent.length && recentAreaScore(observed[0].id) > 0 ? observed[0].id : fallback;
  const recentTags = recent.flatMap(s => s.tags);
  const allTags = signals.filter(s => s.strength > 0).flatMap(s => s.tags);
  const related: Record<CareerAreaId, CareerAreaId[]> = {
    healthcare: ['science', 'social'], technology: ['design', 'engineering', 'science'], engineering: ['technology', 'science', 'design'],
    business: ['design', 'social', 'technology'], design: ['technology', 'business', 'social'], science: ['healthcare', 'technology', 'engineering'],
    social: ['healthcare', 'public-service', 'design'], 'public-service': ['social', 'science', 'business'],
  };
  const baseScore = (v: Video) => sessionDimensions(v.dim) + dims[v.dim] / 10
    + videoTags(v).filter(t => recentTags.includes(t)).length * 8
    + videoTags(v).filter(t => allTags.includes(t)).length
    + (v.duration.startsWith('2:') || v.duration.startsWith('3:') ? 4 : 0)
    - (feedback[v.id] ? 12 : 0);
  const first = videos.filter(v => areaForCluster(v.clusterId) === primary).sort((a, b) => baseScore(b) - baseScore(a))[0];
  const alternativeScore = (v: Video) => {
    const area = areaForCluster(v.clusterId)!;
    return baseScore(v) + recentAreaScore(area) * 3
      + (profile.generalInterests[1] === area ? 12 : 0)
      + (areas.slice(1, 3).some(a => a.id === area) ? 6 : 0)
      + (related[primary].includes(area) ? 4 : 0);
  };
  const second = videos.filter(v => areaForCluster(v.clusterId) && areaForCluster(v.clusterId) !== primary && areaForCluster(v.clusterId) !== areas[0]?.id)
    .sort((a, b) => alternativeScore(b) - alternativeScore(a))[0];
  return [first, second];
}
