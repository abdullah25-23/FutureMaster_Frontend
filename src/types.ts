export type Screen =
  | 'splash' | 'login' | 'signup' | 'setup' | 'intro'
  | 'assessment' | 'session-result' | 'interest-profile' | 'dashboard' | 'explore'
  | 'activities' | 'activity-detail' | 'journey'
  | 'clusters' | 'career-list' | 'why-career' | 'career-details' | 'readiness'
  | 'subject-guidance' | 'degree-explorer' | 'roadmap'
  | 'videos' | 'video-feedback' | 'profile' | 'notifications' | 'recommendations';

export interface NavParams {
  clusterId?: string;
  careerId?: string;
  activityId?: string;
  videoId?: string;
  setupStep?: 2;
  editProfile?: boolean;
  returnTo?: 'session-result';
}

export type CareerAreaId = 'healthcare' | 'technology' | 'engineering' | 'business' | 'design' | 'science' | 'social' | 'public-service';

export interface StudentProfile {
  name: string;
  email: string;
  age: string;
  schoolName: string;
  studyGroup: string;
  favouriteSubjects: string[];
  difficultSubjects: string[];
  subjectMarks: Record<string, string>;
  overallPercentage: string;
  academicResultType: string;
  academicResultStatus: string;
  academicYear: string;
  resultSubjects: string[];
  assessmentSource: '' | 'official' | 'internal';
  priorAcademic: { resultType: string; academicYear: string; overall: number | null; subjectMarks: Record<string, string> } | null;
  futureIdeas: '' | 'yes' | 'unsure' | 'not-yet';
  futureFields: string[];
  activities: string[];
  careerGoal: string;
  generalInterests: Array<CareerAreaId | 'unsure'>;
}

export type DimensionKey =
  | 'analyticalThinking' | 'technologyInterest' | 'creativity' | 'helpingPeople'
  | 'leadership' | 'communication' | 'handsOnWork' | 'researchInterest' | 'businessInterest';

export type InterestDimensions = Record<DimensionKey, number>;

export interface Cluster {
  id: string;
  name: string;
  icon: string;
  color: string;
  blurb: string;
  careerIds: string[];
  weights: Partial<Record<DimensionKey, number>>;
}

export type Fit = 'Strong' | 'Good' | 'Emerging';
export type Readiness = 'On Track' | 'Building' | 'Needs Improvement' | 'Result unavailable' | 'Preliminary Readiness';

export interface QuestionOption {
  id: string;
  label: string;
  effects: Partial<Record<DimensionKey, number>>;
  tag?: string;
  tags?: string[];
  areas?: CareerAreaId[];
  icon?: string;
  photo?: { src: string; alt: string };
}
