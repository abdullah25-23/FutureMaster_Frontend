import { DimensionKey, Screen } from '../types';

export const dimensionMeta: Record<DimensionKey, { label: string; color: string }> = {
  analyticalThinking: { label: 'Analytical Thinking', color: '#6366F1' },
  technologyInterest: { label: 'Technology Interest', color: '#00D2FF' },
  creativity: { label: 'Creativity', color: '#EC4899' },
  helpingPeople: { label: 'Helping People', color: '#00E676' },
  leadership: { label: 'Leadership', color: '#FFC107' },
  communication: { label: 'Communication', color: '#38BDF8' },
  handsOnWork: { label: 'Hands-on Work', color: '#FB923C' },
  researchInterest: { label: 'Research Interest', color: '#7C3AED' },
  businessInterest: { label: 'Business / Enterprising', color: '#F59E0B' },
};

export const subjectOptions = ['Mathematics', 'General Science', 'Computer Science', 'English', 'Urdu', 'Social Studies', 'Art', 'Physics', 'Chemistry', 'Biology', 'Other'];
export const studyGroups = ['Science with Biology', 'Science with Computer Science', 'Arts / Humanities', 'FSc Pre-Medical', 'FSc Pre-Engineering', 'ICS', 'I.Com / Commerce', 'FA / Arts / Humanities', 'Other'];

export const futureFieldOptions = ['Computing', 'Engineering', 'Medicine / Healthcare', 'Business', 'Arts / Design', 'Psychology', 'Law', 'Science', 'Other'];

export const careerFacts: string[] = [
    'Robotics engineers can create machines used in hospitals, factories and space exploration.',
    'Architects combine creativity, mathematics and problem solving.',
    'Game designers use storytelling, art and logic together.',

    'Many technology careers combine mathematics, logical thinking and creativity.',
    'Healthcare includes many careers beyond becoming a doctor.',
    'Data scientists often work with ideas from statistics, computing and the subject they study.',

    'Computer Science can lead to software development, cybersecurity, AI and data careers.',
    'Psychology can lead to careers in mental health, research, education and organizations.',
    'Many engineering fields overlap with computing, design and management.',
];

export interface NotificationItem { id: string; icon: string; title: string; body: string; time: string; screen: Screen; unread?: boolean }
export const notificationItems: NotificationItem[] = [
  { id: 'n1', icon: '✨', title: 'Interest Profile Updated', body: 'Your latest answers refined your interest patterns.', time: '2m ago', screen: 'interest-profile', unread: true },
  { id: 'n2', icon: '🧭', title: 'New Career Area Worth Exploring', body: 'Research & Data matches patterns from your exploration.', time: '1h ago', screen: 'clusters', unread: true },
  { id: 'n3', icon: '🎬', title: 'New Career Video Selected', body: 'A short video based on your interests is ready to watch.', time: '3h ago', screen: 'videos', unread: true },
  { id: 'n4', icon: '✅', title: 'Exploration Activity Completed', body: 'Nice work finishing your last activity.', time: 'Yesterday', screen: 'activities' },
  { id: 'n5', icon: '🗺️', title: 'Roadmap Updated', body: 'Your education roadmap now reflects your latest profile.', time: 'Yesterday', screen: 'roadmap' },
  { id: 'n6', icon: '🔄', title: 'Additional Exploration Ready', body: 'A new exploration session is ready whenever you are.', time: '2 days ago', screen: 'assessment' },
  { id: 'n7', icon: '📈', title: 'Profile Becoming Clearer', body: 'Each session helps FutureMaster AI understand you better.', time: '3 days ago', screen: 'journey' },
];

export const drawerItems: Array<{ label: string; icon: string; screen: Screen }> = [
  { label: 'Home', icon: 'Home', screen: 'dashboard' },
  { label: 'Explore', icon: 'Compass', screen: 'explore' },
  { label: 'My Journey', icon: 'TrendingUp', screen: 'journey' },
  { label: 'Profile', icon: 'User', screen: 'profile' },
];

export const journeySections: Array<{ title: string; description: string; items: Array<{ label: string; screen: Screen }> }> = [
  { title: 'What I enjoy', description: 'See what we have learned from your choices.', items: [
    { label: 'My Interest Profile', screen: 'interest-profile' },
  ] },
  { title: 'Career ideas', description: 'Discover different kinds of work. You do not need to choose a career now.', items: [
    { label: 'Career Recommendations', screen: 'recommendations' },
    { label: 'Explore Career Ideas', screen: 'clusters' },
  ] },
  { title: 'My next steps', description: 'Learn which subjects and study paths could help you.', items: [
    { label: 'Subject Guidance', screen: 'subject-guidance' },
    { label: 'Career Roadmap', screen: 'roadmap' },
  ] },
];

export const futureStudyItems: Array<{ label: string; screen: Screen }> = [
  { label: 'Study Options After School', screen: 'degree-explorer' },
  { label: 'Subject Preparation', screen: 'readiness' },
];

export function primaryDestinationFor(screen: Screen): Screen {
  if (['explore', 'assessment', 'session-result', 'activities', 'activity-detail'].includes(screen)) return 'explore';
  if (['profile', 'setup'].includes(screen)) return 'profile';
  if (['journey', 'interest-profile', 'recommendations', 'clusters', 'career-list', 'why-career', 'career-details', 'subject-guidance', 'degree-explorer', 'roadmap', 'readiness', 'videos', 'video-feedback'].includes(screen)) return 'journey';
  return 'dashboard';
}
