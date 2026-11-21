import { useEffect, useState } from 'react';
import { useApp } from '../state';
import { dimensionMeta, futureStudyItems, journeySections } from '../data/content';
import { videoById } from '../data/videos';
import { Btn, C, Card, Disclosure, Pill, SectionTitle, Text } from '../components/ui';
import Screen from '../components/PrimaryScreen';
import { careerById } from '../data/careers';
import { FactCard } from '../components/DashboardShell';

function Timeline({ count, done, current }: { count: number; done: number; current: number }) {
  const [fill, setFill] = useState(0);
  useEffect(() => { const t = setTimeout(() => setFill(done), 120); return () => clearTimeout(t); }, [done]);
  return (
    <div>
      {Array.from({ length: count }, (_, k) => k + 1).map(i => {
        const isDone = i <= done; const isCur = i === done + 1;
        const title = i > 3 ? `Additional Exploration — Session ${i}` : `Exploration Session ${i}`;
        const status = isDone ? 'Completed' : isCur ? 'In Progress' : 'Up next';
        const col = isDone ? C.success : isCur ? C.cyan : C.muted;
        const lineFilled = i <= fill; const lastItem = i === count;
        return (
          <div key={i} className="flex stagger" style={{ gap: 14, '--i': i } as React.CSSProperties}>
            <div className="flex flex-col items-center" style={{ width: 32, flexShrink: 0 }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700,
                background: isDone ? C.success : C.card, color: isDone ? C.onAccent : col, border: `2px solid ${col}`, boxShadow: isCur ? `0 0 14px ${C.cyan}66` : 'none' }}>{isDone ? '✓' : i}</div>
              {!lastItem && (
                <div style={{ width: 3, flex: 1, minHeight: 36, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: lineFilled ? '100%' : '0%', background: C.success, transition: `height .8s ease ${i * 0.15}s` }} />
                </div>
              )}
            </div>
            <div style={{ flex: 1, paddingBottom: lastItem ? 0 : 18 }}>
              <p style={{ margin: 0, fontFamily: 'Poppins', fontWeight: 600, fontSize: 14 }}>{title}</p>
              <div style={{ marginTop: 4 }}><Pill text={status} color={col} /></div>
              {isCur && <p style={{ margin: '6px 0 0', fontSize: 12, color: C.sub }}>{current} answered this session</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function JourneyScreen() {
  const { sessionsCompleted, sessionAnswered, profileReady, profileConfidence, questionsAnswered, completedActivities, exploredClusters, videoFeedback, topDims, savedCareers, nav } = useApp();
  const saved = savedCareers.map(careerById).filter((career): career is NonNullable<typeof career> => !!career);
  const count = Math.max(3, sessionsCompleted + 1);
  const stats = [
    ['Profile Confidence', `${profileConfidence}%`], ['Questions Answered', questionsAnswered],
    ['Activities Completed', completedActivities.length], ['Career Areas Explored', exploredClusters.length],
  ];
  const rated = Object.keys(videoFeedback).map(videoById).filter((x): x is NonNullable<typeof x> => !!x);
  const topKeys = topDims.slice(0, 3).map(d => d.key);
  const newAreas = new Set(rated.filter(x => !topKeys.includes(x.dim)).map(x => x.area)).size;
  const videoStats = [['Career Videos Explored', rated.length], ['Very Interested', Object.values(videoFeedback).filter(r => r === 5).length], ['New Areas Explored', newAreas]];

  return (
    <Screen title="My Journey" subtitle="Your interests, career ideas and next steps">
      <div className="flex flex-col gap-4 mb-5">
        {journeySections.map(section => <Card key={section.title}>
          <SectionTitle>{section.title}</SectionTitle>
          <Text tone="sub" className="text-sm leading-relaxed mb-3">{section.description}</Text>
          <div className="flex flex-col gap-2">
            {section.items.map(item => <Btn key={item.screen} variant="ghost" onClick={() => nav(item.screen)}>{item.label}</Btn>)}
          </div>
        </Card>)}
        <Disclosure title="More about future study">
          <Text tone="sub" className="text-sm leading-relaxed mb-3">These are options for later. You do not need to choose a degree or enter marks now.</Text>
          <div className="flex flex-col gap-2">
            {futureStudyItems.map(item => <Btn key={item.screen} variant="ghost" onClick={() => nav(item.screen)}>{item.label}</Btn>)}
          </div>
          <div className="mt-4"><FactCard /></div>
        </Disclosure>
        <Disclosure title="Saved career ideas">
          {saved.length ? <div className="flex flex-col gap-2">
            {saved.map(career => <Btn key={career.id} variant="ghost" onClick={() => nav('career-details', { careerId: career.id })}>{career.name}</Btn>)}
          </div> : <Text tone="sub" className="text-sm leading-relaxed">Save a career while exploring it. You can come back to it here.</Text>}
        </Disclosure>
      </div>
      <SectionTitle>Exploration Progress</SectionTitle>
      <Card style={{ marginBottom: 16 }}>
        <Timeline count={count} done={sessionsCompleted} current={sessionAnswered} />
      </Card>

      {sessionsCompleted >= 3 && (
        <Card style={{ marginBottom: 16, borderColor: profileReady ? C.success : C.border }}>
          <p style={{ margin: 0, fontFamily: 'Poppins', fontWeight: 600, fontSize: 14 }}>Readiness check</p>
          <p style={{ margin: '6px 0 12px', fontSize: 13, color: C.sub, lineHeight: 1.5 }}>
            {profileReady ? 'Your profile is clear enough to begin exploring personalized career recommendations.' : 'We\'ve learned a lot, but a few areas are still unclear.'}
          </p>
          {profileReady ? <Btn small variant="cyan" onClick={() => nav('clusters')}>Explore Career Areas</Btn> : <Btn small variant="ghost" onClick={() => nav('assessment')}>Explore a little more</Btn>}
        </Card>
      )}

      <Disclosure title="More about my progress">
      <SectionTitle>Your Stats</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {stats.map(([label, v], i) => (
          <Card key={label} style={{ padding: 14, gridColumn: i === 4 ? 'span 2' : undefined }}>
            <p style={{ margin: 0, fontFamily: 'Poppins', fontWeight: 700, fontSize: 22 }}>{v}</p>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: C.sub }}>{label}</p>
          </Card>
        ))}
      </div>

      <SectionTitle>Career Videos</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
        {videoStats.map(([label, v]) => (
          <Card key={label} style={{ padding: 12 }}>
            <p style={{ margin: 0, fontFamily: 'Poppins', fontWeight: 700, fontSize: 20 }}>{v}</p>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: C.sub, lineHeight: 1.3 }}>{label}</p>
          </Card>
        ))}
      </div>

      <SectionTitle>Strongest Current Interests</SectionTitle>
      <div className="flex flex-wrap" style={{ gap: 8, marginBottom: 20 }}>
        {topDims.slice(0, 3).map(d => <Pill key={d.key} text={dimensionMeta[d.key].label} color={dimensionMeta[d.key].color} />)}
      </div>
      </Disclosure>

      <Btn onClick={() => nav('assessment')}>Continue Exploration</Btn>
    </Screen>
  );
}
