import { ReactNode, useState } from 'react';
import { Ico } from '../components/Icon';
import { useTheme, ThemeMode } from '../theme';
import { useApp } from '../state';
import { C, Card, Chip, BrandSymbol, Btn, SectionTitle } from '../components/ui';
import Screen from '../components/PrimaryScreen';

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between" style={{ minHeight: 40, gap: 12 }}>
    <span style={{ fontSize: 13, color: C.sub }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: 600, textAlign: 'right' }}>{value}</span>
  </div>
);
const Sec = ({ title, children }: { title: string; children: ReactNode }) => <section><SectionTitle>{title}</SectionTitle>{children}</section>;

export default function ProfileScreen() {
  const { profile, displayName, nav, logout } = useApp();
  const theme = useTheme();
  const [notif, setNotif] = useState(true);
  const initials = displayName.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || 'S';
  return (
    <Screen title="Profile" right={<BrandSymbol height={28} />}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Card style={{ background: C.cardGrad }}>
          <div className="flex items-center" style={{ gap: 14 }}>
            <div aria-hidden style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins', fontWeight: 700, fontSize: 22 }}>{initials}</div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ margin: 0, fontSize: 18 }}>{displayName}</h3>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: C.sub, overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.email}</p>
            </div>
          </div>
        </Card>

        <Card>
          <Row label="School" value={profile.schoolName || 'Not added'} />
          {profile.studyGroup && <Row label="Study Group" value={profile.studyGroup} />}
        </Card>

        <Btn variant="ghost" onClick={() => nav('setup', { setupStep: 2, editProfile: true })}>Update Studies & Academic Results</Btn>

        <Card onClick={() => nav('journey')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Ico e="TrendingUp" size={16} color={C.cyan} />My Journey</span></span><span style={{ color: C.cyan }}>→</span>
        </Card>

        <Sec title="Favourite Subjects">
          {profile.favouriteSubjects.length ? <div className="flex flex-wrap" style={{ gap: 8 }}>{profile.favouriteSubjects.map(s => <Chip key={s} label={s} />)}</div> : <p style={{ margin: 0, fontSize: 13, color: C.sub }}>None selected yet.</p>}
        </Sec>
        {profile.difficultSubjects.length > 0 && (
          <Sec title="Difficult Subjects"><div className="flex flex-wrap" style={{ gap: 8 }}>{profile.difficultSubjects.map(s => <Chip key={s} label={s} />)}</div></Sec>
        )}

        <Sec title="Settings">
          <Card>
            <div className="flex items-center justify-between" style={{ minHeight: 44 }}>
              <span style={{ fontSize: 13 }}>Notifications: {notif ? 'On' : 'Off'}</span>
              <button role="switch" aria-checked={notif} aria-label="Notifications" onClick={() => setNotif(v => !v)} style={{ width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer', background: notif ? C.indigo : C.elevated, position: 'relative', transition: 'background .2s' }}>
                <span style={{ position: 'absolute', top: 3, left: notif ? 23 : 3, width: 22, height: 22, borderRadius: '50%', background: '#fff', transition: 'left .2s' }} />
              </button>
            </div>
            <div style={{ padding: '10px 0' }}>
              <span style={{ fontSize: 13 }}>Theme</span>
              <div role="radiogroup" aria-label="Theme" style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                {([['system', 'System Default', 'Monitor'], ['light', 'Light', 'Sun'], ['dark', 'Dark', 'Moon']] as [ThemeMode, string, string][]).map(([m, l, ic]) => (
                  <button key={m} role="radio" aria-checked={theme.mode === m} onClick={() => theme.setMode(m)} className="pressable" style={{ flex: 1, minHeight: 44, borderRadius: 12, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, fontSize: 11, fontWeight: 600, border: `1px solid ${theme.mode === m ? C.cyan : C.border}`, background: theme.mode === m ? `${C.cyan}1F` : C.elevated, color: theme.mode === m ? C.cyan : C.sub }}>
                    <Ico e={ic} size={16} />{l}
                  </button>
                ))}
              </div>
            </div>
            <Row label="Language" value="English" />
          </Card>
        </Sec>

        <Btn variant="ghost" onClick={logout} style={{ color: C.error, borderColor: 'rgba(255,82,82,0.4)' }}>Logout</Btn>
      </div>
    </Screen>
  );
}
