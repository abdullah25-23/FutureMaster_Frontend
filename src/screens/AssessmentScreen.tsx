import { Ico } from '../components/Icon';
import { useEffect, useRef, useState } from 'react';
import { useApp, SESSION_LENGTH, MIN_SESSIONS } from '../state';
import { C, Card, Screen, SelectionCard } from '../components/ui';
import { QuestionOption } from '../types';

export default function AssessmentScreen() {
  const { currentQuestion, currentSession, sessionAnswered, answerQuestion, finishSession, loadNav, back } = useApp();
  const [picked, setPicked] = useState<string | null>(null);
  const choosing = useRef(false);
  const answerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (answerTimer.current) clearTimeout(answerTimer.current); }, []);
  const { question: q, note } = currentQuestion;
  const additional = currentSession > MIN_SESSIONS;

  function choose(opt: QuestionOption) {
    if (choosing.current) return;
    choosing.current = true;
    setPicked(opt.id);
    answerTimer.current = setTimeout(() => {
      const real = opt.id === 'unsure' ? null : opt;
      answerQuestion(q, real);
      if (sessionAnswered + 1 >= SESSION_LENGTH) {
        finishSession();
        loadNav('Updating your interest profile...', 'session-result');
        return;
      }
      choosing.current = false;
      setPicked(null);
    }, 380);
  }

  return (
    <Screen title={additional ? 'Additional Exploration' : `Exploration Session ${currentSession}`}
      subtitle={`Question ${sessionAnswered + 1} of ${SESSION_LENGTH}`} onBack={back}>
      <div className="flex" style={{ gap: 6, marginBottom: 18 }} aria-label={`Question ${sessionAnswered + 1} of this session`}>
        {Array.from({ length: SESSION_LENGTH }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i <= sessionAnswered ? 'linear-gradient(90deg,#6366F1,#00D2FF)' : C.border, transition: 'background .4s' }} />
        ))}
      </div>
      <div key={q.id} className="pop-in">
        {note && (
          <div style={{ marginBottom: 14, padding: '10px 12px', borderRadius: 12, background: 'rgba(0,210,255,0.08)', border: '1px solid rgba(0,210,255,0.25)', fontSize: 12, lineHeight: 1.5, color: C.sub }}>
            <span style={{ color: C.cyan, fontWeight: 700 }}><Ico e="Sparkles" size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />Adapting to you · </span>{note}
          </div>
        )}
        <Card style={{ padding: 20, marginBottom: 16, background: C.cardGrad }}>
          <div className="flex items-center" style={{ gap: 8, marginBottom: 10 }}>
            <Ico e={q.emoji} size={22} color={C.cyan} />
            <span style={{ fontSize: 11, fontWeight: 700, color: C.cyan, textTransform: 'uppercase', letterSpacing: 0.8 }}>{q.scenario}</span>
          </div>
          <h2 style={{ margin: 0, fontSize: 19, lineHeight: 1.4 }}>{q.prompt}</h2>
        </Card>
        <div className={q.visual ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-2'}>
          {q.options.map(o => {
            const on = picked === o.id;
            return (
              <SelectionCard key={o.id} label={o.label} photo={o.photo} visual={q.visual} questionChoice selected={on} disabled={!!picked} onClick={() => choose(o)} />
            );
          })}
        </div>
      </div>
    </Screen>
  );
}
