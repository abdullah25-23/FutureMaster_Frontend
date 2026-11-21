import { useApp } from '../state';
import { Btn, BrandSymbol, C, Screen } from '../components/ui';
import { areaById } from '../data/exploration';

export default function IntroScreen() {
  const { profile, loadNav } = useApp();
  const primary = areaById(profile.generalInterests[0]);
  return (
    <Screen noBack title="" footer={<Btn onClick={() => loadNav('Preparing your next exploration...', 'assessment')}>Start Exploring</Btn>}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 70 }}>
        <div className="pop-in" style={{ width: 110, height: 110, borderRadius: 32, background: 'radial-gradient(circle,rgba(99,102,241,0.25),rgba(0,210,255,0.05))', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
          <BrandSymbol height={64} />
        </div>
        <h1 className="stagger" style={{ margin: 0, fontSize: 26, fontWeight: 700, lineHeight: 1.25, '--i': 0 } as React.CSSProperties}>{primary ? `Let's explore what you enjoy about ${primary.short}` : "Let's discover what interests you"}</h1>
        <p className="stagger" style={{ margin: '14px 6px 0', fontSize: 15, color: C.sub, lineHeight: 1.6, '--i': 1 } as React.CSSProperties}>
          {primary ? "We'll show you different situations and activities to understand which kinds of work may suit you." : 'Explore different activities and situations to find areas worth exploring.'}
        </p>
        <div className="stagger" style={{ marginTop: 22, padding: 16, borderRadius: 16, background: C.card, border: `1px solid ${C.border}`, textAlign: 'left', '--i': 2 } as React.CSSProperties}>
          <p style={{ margin: 0, fontSize: 13, color: C.sub, lineHeight: 1.6 }}>
            You'll complete at least 3 short exploration sessions. If more information is needed, your exploration will continue until your profile becomes clear enough.
          </p>
        </div>
      </div>
    </Screen>
  );
}
