import { useApp } from '../state';
import DashboardShell from '../components/DashboardShell';
import { Btn } from '../components/ui';
import { Section, ReadyBanner, HeroCard, useSessionHero, InterestBars, ProgressCard, CurrentExploration } from './dashboardParts';

export default function DashboardScreen() {
  const { nav, profileReady, questionsAnswered } = useApp();
  const eyebrow = useSessionHero();
  return (
    <DashboardShell greetingSub={profileReady ? 'Your profile is ready to explore' : "Let's discover what you enjoy"}>
      <ReadyBanner />
      <HeroCard eyebrow={eyebrow} title="Today's Exploration" text={questionsAnswered > 0 ? 'Answer a few more fun questions to learn more about your interests.' : 'Answer a few fun questions to start finding what you enjoy.'} cta="Continue Exploration" />
      <CurrentExploration />
      <Section i={1} title="Strongest Interests" action="See all" onAction={() => nav('interest-profile')}><InterestBars max={3} /></Section>
      <Btn variant="ghost" onClick={() => nav('explore')}>Try More Activities</Btn>
      <Section i={2} title="My Progress" action="My Journey" onAction={() => nav('journey')}><ProgressCard showConfidence={false} /></Section>
    </DashboardShell>
  );
}
