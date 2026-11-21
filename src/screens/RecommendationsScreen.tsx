import { academicEvidence } from '../data/academic';
import { Ico } from '../components/Icon';
import { useApp } from '../state';
import { Btn, C, Card, LockedBox, Pill, Screen } from '../components/ui';
import { degrees } from '../data/careers';
import { Fit, Readiness } from '../types';
import { recommendCareers, Recommendation } from '../data/recommendations';

export default function RecommendationsScreen() {
  const { profileReady, dims, videoFeedback, profile, nav, go, explorationSignals } = useApp();
  if (!profileReady) {
    return (
      <Screen title="Careers Worth Exploring" subtitle="Based on Your Current Profile">
        <p style={{ margin: '0 0 14px', fontSize: 13, color: C.sub, lineHeight: 1.5 }}>A few areas are still unclear. Another short exploration will help.</p>
        <LockedBox onCta={() => nav('assessment')} />
      </Screen>
    );
  }

  const recs = recommendCareers(dims, videoFeedback, profile, explorationSignals);

  return (
    <Screen title="Careers Worth Exploring" subtitle="Based on Your Current Profile" footer={
      <div className="flex flex-col" style={{ gap: 8 }}>
        <Btn variant="ghost" onClick={() => nav('clusters')}>Explore More Career Areas</Btn>
        <button onClick={() => go('dashboard')} style={{ background: 'none', border: 'none', color: C.cyan, fontSize: 13, fontWeight: 600, minHeight: 36, cursor: 'pointer' }}>Go to Dashboard</button>
      </div>}>
      <p className="fade-down" style={{ margin: '0 0 6px', fontSize: 13, color: C.sub, lineHeight: 1.55 }}>
        These careers currently align most closely with the interests and exploration evidence we have learned about you.
      </p>
      <p className="fade-down" style={{ margin: '0 0 16px', fontSize: 12, color: C.muted, lineHeight: 1.5 }}>These are ideas worth exploring, not fixed decisions. Subject preparation and academic information are kept separate from your interest match.</p>

      {recs.map((r, i) => <RecCard key={r.career.id} r={r} rank={i + 1} />)}

      <Card style={{ background: C.cardGrad2, borderStyle: 'dashed', marginTop: 4 }}>
        <div className="flex items-start" style={{ gap: 10 }}>
          <Ico e="Info" size={18} color={C.sub} />
          <p style={{ margin: 0, fontSize: 12, color: C.sub, lineHeight: 1.5 }}>
            These suggestions use your exploration answers, activities and earlier sessions, with video feedback as a small supporting signal. They will keep updating as you explore.
          </p>
        </div>
      </Card>
    </Screen>
  );
}

function RecCard({ r, rank }: { r: Recommendation; rank: number }) {
  const { nav, profile } = useApp();
  const top = rank === 1;
  const { career: c } = r;
  const open = (s: 'why-career' | 'career-details') => nav(s, { careerId: c.id, clusterId: c.clusterId });
  const degreeNames = c.degrees.map(id => degrees.find(d => d.id === id)?.name).filter(Boolean).slice(0, 2) as string[];

  return (
    <div className="stagger" style={{ '--i': rank, marginBottom: 14 } as React.CSSProperties}>
      <Card accent={C.cyan} style={top ? {
        borderColor: C.cyan, background: C.cardGrad,
        boxShadow: `0 0 0 1px ${C.cyan}55, 0 0 26px ${C.cyan}2E`,
      } : undefined}>
        <div className="flex items-start" style={{ gap: 12 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: top ? 52 : 46, height: top ? 52 : 46, borderRadius: 15, background: `${r.clusterColor}22`, color: r.clusterColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ico e={c.icon} size={top ? 26 : 22} />
            </div>
            <span aria-label={`Rank ${rank}`} style={{ position: 'absolute', top: -6, left: -6, width: 22, height: 22, borderRadius: 11, background: top ? 'linear-gradient(135deg,#00D2FF,#6366F1)' : C.elevated, color: top ? '#fff' : C.text, border: `1px solid ${top ? 'transparent' : C.border}`, fontSize: 11, fontWeight: 700, fontFamily: 'Poppins', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{rank}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {top && <div style={{ marginBottom: 4 }}><Pill text="Top Recommendation" color={C.cyan} /></div>}
            <p style={{ margin: 0, fontWeight: 700, fontSize: top ? 17 : 15, fontFamily: 'Poppins' }}>{c.name}</p>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: C.sub }}>{r.clusterName}</p>
          </div>
        </div>

        <div className="flex" style={{ gap: 8, marginTop: 14 }}>
          <Metric label="Interest Match" value={r.interestMatch} color={fitTone(r.interestMatch)} />
          {academicEvidence(profile).overall !== null && <Metric label="Academic Readiness" value={r.readinessLabel} color={readinessTone(r.readiness)} />}
        </div>

        <div style={{ marginTop: 12, paddingLeft: 10, borderLeft: `2px solid ${r.clusterColor}` }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.6 }}>Why this appeared</p>
          <p style={{ margin: '3px 0 0', fontSize: 13, lineHeight: 1.5 }}>{r.why}</p>
        </div>

        {(
          <p style={{ margin: '10px 0 0', fontSize: 12, color: C.sub, lineHeight: 1.5 }}>
            <span style={{ fontWeight: 600, color: C.text }}>Study pathway: </span>{c.subjects.slice(0, 3).join(', ')}
          </p>
        )}
        {(
          <div style={{ marginTop: 10 }}>
            {degreeNames.length > 0 && <p style={{ margin: 0, fontSize: 12, color: C.sub, lineHeight: 1.5 }}><span style={{ fontWeight: 600, color: C.text }}>Degree routes: </span>{degreeNames.join(', ')}</p>}
            <p style={{ margin: '4px 0 0', fontSize: 12, color: C.sub, lineHeight: 1.5 }}>{profile.studyGroup ? `${profile.studyGroup}: ` : ''}{r.readinessSummary}</p>
          </div>
        )}

        <div className="flex" style={{ gap: 8, marginTop: 14 }}>
          <Btn small variant="ghost" style={{ flex: 1 }} onClick={() => open('why-career')}>Why This Career</Btn>
          <Btn small variant={top ? 'cyan' : 'primary'} style={{ flex: 1 }} onClick={() => open('career-details')}>Explore Career</Btn>
        </div>
      </Card>
    </div>
  );
}

const Metric = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div style={{ flex: 1, minWidth: 0, padding: '10px 12px', borderRadius: 12, background: C.elevated, border: `1px solid ${C.border}` }}>
    <p style={{ margin: 0, fontSize: 11, color: C.muted, fontWeight: 600 }}>{label}</p>
    <p style={{ margin: '3px 0 0', fontSize: 13, fontWeight: 700, color, lineHeight: 1.3 }}>{value}</p>
  </div>
);

const fitTone = (f: Fit) => (f === 'Strong' ? C.success : f === 'Good' ? C.cyan : C.violet);
const readinessTone = (r: Readiness) => (r === 'On Track' ? C.success : r === 'Building' ? C.cyan : r === 'Needs Improvement' ? C.warning : C.sub);
