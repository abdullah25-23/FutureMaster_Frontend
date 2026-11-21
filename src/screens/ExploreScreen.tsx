import PrimaryScreen from '../components/PrimaryScreen';
import { Btn, Card, SectionTitle, Text } from '../components/ui';
import { SESSION_LENGTH, useApp } from '../state';
import { ActivitiesPreview } from './dashboardParts';

export default function ExploreScreen() {
  const { nav, sessionAnswered } = useApp();
  return <PrimaryScreen title="Explore" subtitle="Try something and see what you enjoy">
    <Card>
      <Text as="h3" className="text-base font-semibold mb-2">Your exploration session</Text>
      <Text tone="sub" className="text-sm leading-relaxed mb-4">
        Answer {SESSION_LENGTH} short questions. There are no right or wrong answers. It is okay to say “I'm not sure yet.”
      </Text>
      <Btn onClick={() => nav('assessment')}>{sessionAnswered ? 'Continue Exploration' : 'Start Exploring'}</Btn>
    </Card>
    <div className="mt-5">
      <SectionTitle>Activities to try</SectionTitle>
      <Text tone="sub" className="text-sm leading-relaxed mb-3">Try a small challenge. Notice which parts you enjoy.</Text>
      <ActivitiesPreview />
      <div className="mt-3"><Btn variant="ghost" onClick={() => nav('activities')}>See All Activities</Btn></div>
    </div>
  </PrimaryScreen>;
}
