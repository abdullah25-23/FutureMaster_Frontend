import { useApp } from '../state';
import { class8SubjectOptions, effectiveStatus, effectiveType, fallbackResultType, isInternalType, matricSubjectOptions, resultStatuses, resultTypeOptions, RT } from '../data/academic';
import { Btn, C, Chip, Disclosure, Input, Label, Screen, SelectionCard, Text } from '../components/ui';
import { studyGroups, futureFieldOptions } from '../data/content';
import { careerAreas } from '../data/exploration';
import { CareerAreaId } from '../types';

function Multi({ options, value, onChange }: { options: Array<string | { label: string; icon?: string }>; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="flex flex-wrap" style={{ gap: 8 }}>
      {options.map(o => {
        const label = typeof o === 'string' ? o : o.label; const icon = typeof o === 'string' ? undefined : o.icon;
        return <Chip key={label} label={label} icon={icon} selected={value.includes(label)} onClick={() => onChange(value.includes(label) ? value.filter(x => x !== label) : [...value, label])} />;
      })}
    </div>
  );
}
function Single({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return <div className="flex flex-wrap" style={{ gap: 8 }}>{options.map(o => <Chip key={o} label={o} selected={value === o} onClick={() => onChange(o)} />)}</div>;
}
const Select = ({ value, options, onChange, label }: { value: string; options: string[]; onChange: (v: string) => void; label: string }) => (
  <select aria-label={label} value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', minHeight: 48, borderRadius: 14, border: `1px solid ${C.border}`, background: C.card, color: C.text, padding: '0 12px', fontSize: 14, fontFamily: 'Inter' }}>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);
const Note = ({ children, tone = 'info' }: { children: React.ReactNode; tone?: 'info' | 'ok' }) => (
  <div style={{ margin: '10px 0', padding: '10px 12px', borderRadius: 12, fontSize: 12, lineHeight: 1.5, color: C.sub, background: tone === 'ok' ? `${C.success}14` : `${C.cyan}12`, border: `1px solid ${tone === 'ok' ? C.success : C.cyan}33` }}>{children}</div>
);
const Block = ({ children }: { children: React.ReactNode }) => <div style={{ marginBottom: 22 }}>{children}</div>;
const Hint = ({ children }: { children: React.ReactNode }) => <p style={{ margin: '-4px 0 8px', fontSize: 12, color: C.muted }}>{children}</p>;

export default function SetupScreen() {
  const { profile, updateProfile, nav, go, params, back } = useApp();
  const p = profile;
  const marks = (subs: string[]) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {subs.map(s => (
        <div key={s}>
          <p style={{ margin: '0 0 4px', fontSize: 12, color: C.sub }}>{s} (%)</p>
          <Input inputMode="numeric" maxLength={3} placeholder="e.g. 78" value={p.subjectMarks[s] ?? ''} onChange={e => updateProfile({ subjectMarks: { ...p.subjectMarks, [s]: e.target.value.replace(/\D/g, '') } })} />
        </div>
      ))}
    </div>
  );
  const step = params.setupStep === 2 ? 2 : 1;
  const valid = !!p.name.trim() && +p.age > 4;
  const toggleArea = (id: CareerAreaId | 'unsure') => {
    const current = p.generalInterests;
    if (current.includes(id)) return updateProfile({ generalInterests: current.filter(x => x !== id) });
    if (id === 'unsure') return updateProfile({ generalInterests: ['unsure'] });
    const known = current.filter((x): x is CareerAreaId => x !== 'unsure');
    if (known.length < 2) updateProfile({ generalInterests: [...known, id] });
  };

  if (step === 1) return (
    <Screen title="Tell us about yourself" subtitle="Step 1 of 2"
      footer={<Btn disabled={!valid} onClick={() => nav('setup', { setupStep: 2 })}>Continue</Btn>}>
      <Block>
        <Label>Full name</Label>
        <Input aria-label="Full name" autoComplete="name" placeholder="Your full name" value={p.name} onChange={e => updateProfile({ name: e.target.value })} />
      </Block>
      <Block>
        <Label>Age</Label>
        <Input aria-label="Age" inputMode="numeric" maxLength={2} placeholder="e.g. 13" value={p.age} onChange={e => updateProfile({ age: e.target.value.replace(/\D/g, '') })} />
      </Block>
      <Block>
        <Label>School / College name (optional)</Label>
        <Input aria-label="School / College name" placeholder="School / College name" value={p.schoolName} onChange={e => updateProfile({ schoolName: e.target.value })} />
      </Block>
    </Screen>
  );

  return (
    <Screen title="Your studies & interests" subtitle="Step 2 of 2" onBack={back}
      footer={<Btn onClick={() => params.editProfile ? go('profile') : nav('intro')}>{params.editProfile ? 'Save Changes' : 'Continue'}</Btn>}>
      <div className="mb-5">
        <Text as="h3" className="font-semibold text-base mb-2">Which fields are you curious about?</Text>
        <Text tone="sub" className="text-xs leading-relaxed mb-3">Choose your first preference and, if you want, a second one. You can also choose 'I'm not sure yet.'</Text>
        <div className="grid grid-cols-2 gap-2">
          {careerAreas.map(area => {
            const index = p.generalInterests.indexOf(area.id);
            return <SelectionCard key={area.id} visual icon={area.icon} label={area.label} selected={index >= 0}
              disabled={index < 0 && p.generalInterests.filter(x => x !== 'unsure').length >= 2}
              badge={index === 0 ? '1st Preference' : index === 1 ? '2nd Preference' : undefined} onClick={() => toggleArea(area.id)} />;
          })}
        </div>
        <div className="mt-2"><SelectionCard icon="Compass" label="I'm Not Sure Yet" selected={p.generalInterests.includes('unsure')} onClick={() => toggleArea('unsure')} /></div>
        <Text tone="muted" className="text-xs leading-relaxed mt-3">Optional · Choose up to two. Tap a selected card to remove it. This is only a starting point, not a career recommendation.</Text>
      </div>

      {p.generalInterests.includes('unsure') && <Disclosure title="Study group & other ideas (optional)">
        <Label>Study group (if applicable)</Label>
        <Single options={studyGroups} value={p.studyGroup} onChange={v => updateProfile({ studyGroup: v })} />
        <div className="mt-4"><Label>Other fields or degree ideas</Label></div>
        <Multi options={futureFieldOptions} value={p.futureFields} onChange={v => updateProfile({ futureFields: v, futureIdeas: v.length ? 'yes' : '' })} />
      </Disclosure>}

      {params.editProfile && (() => {
        const type = effectiveType(p);
        const status = effectiveStatus(p);
        const opts = resultTypeOptions;
        const noMarks = type === RT.declined;
        const internal = isInternalType(type);
        const showStatus = !noMarks && !internal;
        const declared = status === 'Declared';
        const subs = p.resultSubjects;
        const setType = (v: string) => updateProfile({ academicResultType: v, academicResultStatus: 'Declared', assessmentSource: isInternalType(v) ? 'internal' : 'official', subjectMarks: {}, resultSubjects: [], overallPercentage: '' });
        const fb = fallbackResultType(type);
        const toggleSub = (x: string) => {
          const on = p.resultSubjects.includes(x);
          const { [x]: _drop, ...rest } = p.subjectMarks;
          updateProfile({ resultSubjects: on ? p.resultSubjects.filter(y => y !== x) : [...p.resultSubjects, x], subjectMarks: on ? rest : p.subjectMarks });
        };
        return (
          <Disclosure title="Academic result (optional) · add or update">
            <Label>Latest Available Academic Result</Label>
            <Hint>Provide your most recent completed academic result. If your latest result is still awaiting, you can continue without it.</Hint>
            <p style={{ margin: '0 0 6px', fontSize: 12, color: C.sub }}>Which academic result are you providing?</p>
            <Select label="Academic result type" value={type} options={opts} onChange={setType} />
            {showStatus && (
              <div style={{ marginTop: 12 }}>
                <p style={{ margin: '0 0 6px', fontSize: 12, color: C.sub }}>Result Status</p>
                <Select label="Result status" value={status} options={resultStatuses} onChange={v => updateProfile({ academicResultStatus: v })} />
              </div>
            )}
            {showStatus && status === 'Awaiting' && (
              <Note tone="ok">
                That's okay. You can continue without it and update this when it is announced.
                {fb && <button className="pressable" onClick={() => setType(fb)} style={{ display: 'block', marginTop: 8, background: 'none', border: 'none', padding: 0, minHeight: 32, color: C.cyan, fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>Use {fb.replace(' Result', '')} Result Instead</button>}
              </Note>
            )}
            {showStatus && status === 'Not Available' && <Note tone="ok">That's okay. A result that is not available is never treated as zero or low marks.</Note>}
            {type === RT.declined && <Note>No problem. You can continue normally. Readiness will be preliminary until you add a result.</Note>}
            {internal && <Note>Current / Internal Assessment. This is not an official result and is used with lower confidence.</Note>}
            {!noMarks && showStatus && declared && (
              <div style={{ marginTop: 12 }}>
                <p style={{ margin: '0 0 6px', fontSize: 12, color: C.sub }}>Which subjects were part of this result?</p>
                <div className="flex flex-wrap" style={{ gap: 8 }}>{(type === RT.prev8 ? class8SubjectOptions : matricSubjectOptions).map(x => <Chip key={x} label={x} selected={p.resultSubjects.includes(x)} onClick={() => toggleSub(x)} />)}</div>
              </div>
            )}
            {!noMarks && !showStatus && (
              <div style={{ marginTop: 12 }}>
                <p style={{ margin: '0 0 6px', fontSize: 12, color: C.sub }}>Which subjects were part of this assessment?</p>
                <div className="flex flex-wrap" style={{ gap: 8 }}>{matricSubjectOptions.map(x => <Chip key={x} label={x} selected={p.resultSubjects.includes(x)} onClick={() => toggleSub(x)} />)}</div>
              </div>
            )}
            {!noMarks && (!showStatus || declared) && (
              <div style={{ marginTop: 12 }}>
                <p style={{ margin: '0 0 4px', fontSize: 12, color: C.sub }}>Overall Percentage</p>
                <Input inputMode="numeric" maxLength={3} placeholder="e.g. 76" value={p.overallPercentage} onChange={e => updateProfile({ overallPercentage: e.target.value.replace(/\D/g, '') })} />
                {subs.length > 0 && <>
                  <p style={{ margin: '14px 0 8px', fontSize: 12, fontWeight: 600, color: C.sub }}>Subject Results</p>
                  {marks(subs)}
                </>}
                <div style={{ marginTop: 10 }}>
                  <p style={{ margin: '0 0 4px', fontSize: 12, color: C.sub }}>Academic year (optional)</p>
                  <Input inputMode="numeric" maxLength={9} placeholder="e.g. 2025" value={p.academicYear} onChange={e => updateProfile({ academicYear: e.target.value.replace(/[^\d/-]/g, '') })} />
                </div>
              </div>
            )}
          </Disclosure>
        );
      })()}

    </Screen>
  );
}
