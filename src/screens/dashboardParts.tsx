import { Ico } from '../components/Icon';
import { ReactNode } from 'react';
import { useApp } from '../state';
import { videosForProfile } from '../data/videos';
import { C, Card, Bar, SectionTitle, Pill, LockedBox, Chip, Text, Label } from '../components/ui';
import { dimensionMeta } from '../data/content';
import { clusters, clusterFit } from '../data/careers';
import { recommendCareers } from '../data/recommendations';
import { nextDirections } from '../data/exploration';
import { activitiesForProfile } from '../data/activities';

export const Section = ({ title, action, onAction, children, i = 0 }: { title: string; action?: string; onAction?: () => void; children: ReactNode; i?: number }) => (
  <section className="stagger" style={{ ['--i' as string]: i }}>
    <SectionTitle action={action} onAction={onAction}>{title}</SectionTitle>
    {children}
  </section>
);

export function ReadyBanner() {
  const { profileReady, nav } = useApp();
  if (!profileReady) return null;
  return <RecommendationsPreview />;
}

function RecommendationsPreview() {
  const { nav, dims, videoFeedback, profile, explorationSignals } = useApp();
  const recs = recommendCareers(dims, videoFeedback, profile, explorationSignals);
  return (
    <Card accent={C.success} style={{ background: 'linear-gradient(135deg,rgba(0,230,118,0.12),rgba(0,210,255,0.08))', borderColor: 'rgba(0,230,118,0.4)' }}>
      <div className="flex items-center" style={{ gap: 12 }}>
        <Ico e="Sparkles" size={22} color={C.success} />
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 14, fontFamily: 'Poppins' }}>Your Career Recommendations</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: C.sub }}>Your profile is ready for career exploration</p>
        </div>
      </div>
      <div style={{ margin: '12px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {recs.map((r, i) => (
          <div key={r.career.id} className="flex items-center" style={{ gap: 10, fontSize: 13 }}>
            <span style={{ width: 20, height: 20, borderRadius: 10, background: i === 0 ? 'linear-gradient(135deg,#00D2FF,#6366F1)' : C.elevated, color: i === 0 ? '#fff' : C.text, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
            <span style={{ fontWeight: 600, flex: 1, minWidth: 0 }}>{r.career.name}</span>
            <span style={{ fontSize: 11, color: C.muted, whiteSpace: 'nowrap' }}>{r.clusterName.split(' ')[0]}</span>
          </div>
        ))}
      </div>
      <button className="pressable" onClick={() => nav('recommendations')} style={{ width: '100%', minHeight: 44, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#00D2FF,#6366F1)', color: '#fff', fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>See Recommendations</button>
    </Card>
  );
}

export function HeroCard({ eyebrow, title, text, cta }: { eyebrow: string; title: string; text: string; cta: string }) {
  const { nav } = useApp();
  return (
    <div className="stagger" style={{ ['--i' as string]: 0, borderRadius: 20, padding: 18, background: 'linear-gradient(135deg,#4F46E5,#7C3AED 60%,#0EA5E9)', boxShadow: '0 10px 30px rgba(99,102,241,0.35)' }}>
      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>{eyebrow}</p>
      <h3 style={{ margin: '6px 0 4px', fontSize: 19, fontWeight: 700 }}>{title}</h3>
      <p style={{ margin: '0 0 14px', fontSize: 13, color: 'rgba(255,255,255,0.88)', lineHeight: 1.5 }}>{text}</p>
      <button className="pressable" onClick={() => nav('assessment')} style={{ minHeight: 46, padding: '0 20px', borderRadius: 14, border: 'none', background: '#fff', color: '#4338CA', fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>{cta} →</button>
    </div>
  );
}

export function useSessionHero() {
  const { currentSession, sessionsCompleted, profileReady } = useApp();
  const extra = sessionsCompleted >= 3 && !profileReady;
  return extra ? 'Additional Exploration' : `Exploration Session ${currentSession}`;
}

export function InterestBars({ max, withPct }: { max: number; withPct?: boolean }) {
  const { topDims, questionsAnswered, nav } = useApp();
  if (questionsAnswered === 0) {
    return <Card onClick={() => nav('assessment')}><p style={{ margin: 0, fontSize: 13, color: C.sub, lineHeight: 1.5 }}>Your interests will show up here after your first few answers. Start exploring to see them.</p></Card>;
  }
  return (
    <Card onClick={() => nav('interest-profile')} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {topDims.slice(0, max).map((d, idx) => (
        <div key={d.key}>
          <div className="flex justify-between" style={{ marginBottom: 5 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{dimensionMeta[d.key].label}</span>
            {withPct && <span style={{ fontSize: 12, color: C.sub }}>{Math.round(d.value)}%</span>}
          </div>
          <Bar value={d.value} color={dimensionMeta[d.key].color} delay={idx * 120} />
        </div>
      ))}
    </Card>
  );
}

const generalIds = ['tech', 'health', 'design', 'business', 'engineering'];
export function ClusterPreview({ n = 3, withFit }: { n?: number; withFit?: boolean }) {
  const { dims, profileReady, nav } = useApp();
  const list = profileReady
    ? [...clusters].sort((a, b) => clusterFit(b, dims) - clusterFit(a, dims)).slice(0, n)
    : generalIds.map(id => clusters.find(c => c.id === id)).filter(Boolean).slice(0, n) as typeof clusters;
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {list.map((c, idx) => (
          <Card key={c.id} onClick={() => nav('clusters')} style={{ padding: 12 }}>
            <div className="flex items-center stagger" style={{ gap: 12, ['--i' as string]: idx }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${c.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}><Ico e={c.icon} size={20} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{c.name}</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: C.sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.blurb}</p>
              </div>
              {profileReady && withFit && <Pill text={`${Math.round(clusterFit(c, dims))}%`} color={c.color} />}
            </div>
          </Card>
        ))}
      </div>
      {!profileReady && <div style={{ marginTop: 10 }}><LockedBox onCta={() => nav('assessment')} /></div>}
    </>
  );
}

export function ActivitiesPreview() {
  const { nav, completedActivities, areaInterests, dims, explorationSignals } = useApp();
  const items = activitiesForProfile(areaInterests, dims, completedActivities, explorationSignals).slice(0, 3);
  return (
    <div className="mobile-scroll-x" style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
      {items.map(a => (
        <Card key={a.id} onClick={() => nav('activity-detail', { activityId: a.id })} style={{ width: 128, flexShrink: 0, padding: 12 }}>
          <div style={{ color: C.cyan }}><Ico e={a.icon} size={24} /></div>
          <p style={{ margin: '8px 0 0', fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{a.title}</p>
        </Card>
      ))}
      <Card onClick={() => nav('activities')} style={{ width: 110, flexShrink: 0, padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <p style={{ margin: 0, fontSize: 12, color: C.cyan, fontWeight: 600 }}>See all →</p>
        <p style={{ margin: '4px 0 0', fontSize: 11, color: C.sub }}>{completedActivities.length} done</p>
      </Card>
    </div>
  );
}

export function VideoCard(_: { title?: string; text?: string }) {
  const { nav, dims, areaInterests, videoFeedback, explorationSignals } = useApp();
  const pick = videosForProfile(dims, areaInterests, videoFeedback, explorationSignals).interests[0];
  if (!pick) return null;
  return (
    <Card onClick={() => nav('videos', { videoId: pick.id })}>
      <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: C.muted }}>PROFESSION TO EXPLORE</p>
      <div className="flex items-center" style={{ gap: 12 }}>
        <div style={{ width: 64, height: 48, borderRadius: 12, background: 'linear-gradient(135deg,#00D2FF,#6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: "#fff" }}><Ico e={pick.thumb} size={22} /></div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, lineHeight: 1.35 }}>{pick.title}</p>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: C.cyan, fontWeight: 600 }}><Ico e="Play" size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />Watch / Explore</p>
        </div>
      </div>
    </Card>
  );
}

export function CurrentExploration() {
  const { areaInterests, explorationSignals, dims, completedActivities, nav } = useApp();
  const primary = areaInterests[0]; const secondary = areaInterests[1];
  const next = nextDirections(primary, explorationSignals);
  const activity = activitiesForProfile(areaInterests, dims, completedActivities, explorationSignals)[0];
  return <div className="flex flex-col gap-3">
    <Card>
      <Label>Current Direction</Label>
      <div className="flex items-center gap-2 mb-2">
        <Ico e={primary?.icon ?? 'Compass'} color={C.cyan} />
        <Text className="font-semibold text-sm">{primary?.label ?? 'Broad discovery'}</Text>
      </div>
      <Text tone="muted" className="text-xs leading-relaxed">{primary ? `${primary.evidenceLabel} · A direction to explore, not a final recommendation.` : 'Try different activities to discover what you enjoy.'}</Text>
      {secondary && <div className="mt-3"><Label>Also Exploring</Label><Text tone="sub" className="text-sm">{secondary.label}</Text></div>}
      <div className="mt-4"><Label>Worth Exploring Next</Label><div className="flex flex-wrap gap-2">{next.map(n => <Pill key={n} text={n} />)}</div></div>
    </Card>
    {activity && <Card onClick={() => nav('activity-detail', { activityId: activity.id })}>
      <Label>Recommended Activity</Label>
      <div className="flex items-center gap-3"><Ico e={activity.icon} color={C.cyan} /><Text className="text-sm font-semibold">{activity.title}</Text><Ico e="ChevronRight" size={16} color={C.cyan} /></div>
    </Card>}
  </div>;
}

export function ProgressCard({ label = 'Profile confidence', note, showConfidence = true }: { label?: string; note?: string; showConfidence?: boolean }) {
  const { nav, sessionsCompleted, profileConfidence, questionsAnswered } = useApp();
  return (
    <Card onClick={() => nav('journey')}>
      <div className="flex justify-between" style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{sessionsCompleted} session{sessionsCompleted === 1 ? '' : 's'} completed</span>
        <span style={{ fontSize: 12, color: C.sub }}>{questionsAnswered} answers</span>
      </div>
      {showConfidence && <><p style={{ margin: '0 0 6px', fontSize: 12, color: C.sub }}>{label}: {Math.round(profileConfidence)}%</p>
      <Bar value={profileConfidence} /></>}
      {note && <p style={{ margin: '10px 0 0', fontSize: 12, color: C.sub, lineHeight: 1.5 }}>{note}</p>}
    </Card>
  );
}

export const ChipRow = ({ items, onClick, nested }: { items: string[]; onClick?: () => void; nested?: boolean }) => (
  <div className="flex flex-wrap" style={{ gap: 8 }}>{items.map(s => !nested ? <Chip key={s} label={s} onClick={onClick} /> : (
    <span key={s} style={{ minHeight: 40, display: 'inline-flex', alignItems: 'center', padding: '8px 14px', borderRadius: 12, fontFamily: 'Inter', fontSize: 13, fontWeight: 500, border: `1px solid ${C.border}`, background: C.card, color: C.sub }}>{s}</span>
  ))}</div>
);
