import { useApp, MIN_SESSIONS } from '../state';
import { Btn, C, Card, CheckAnim, Photo, Screen, SectionTitle, Text } from '../components/ui';
import { sessionVideoRecommendations, videoPhoto } from '../data/videos';

export default function SessionResultScreen() {
  const { sessionsCompleted: n, profileReady, nav, go, dims, areaInterests, profile, videoFeedback, explorationSignals } = useApp();
  const checkpoint = n >= MIN_SESSIONS;
  const title = n > MIN_SESSIONS ? `Additional Exploration ${n} complete` : `Exploration Session ${n} complete`;
  const suggestedVideos = sessionVideoRecommendations(dims, areaInterests, profile, videoFeedback, explorationSignals, n);

  return (
    <Screen noBack title="" footer={
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Btn onClick={() => go('dashboard')}>Go to Dashboard</Btn>
          <Btn variant="ghost" onClick={() => nav('interest-profile')}>View My Interest Profile</Btn>
          {profileReady && <Btn small variant="ghost" onClick={() => nav('recommendations')}>See My Career Recommendations</Btn>}
      </div>}>
      <div style={{ paddingTop: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <CheckAnim size={76} />
        <h1 style={{ margin: '18px 0 6px', fontSize: 22 }}>{title}</h1>
        <p style={{ margin: 0, fontSize: 14, color: C.sub, lineHeight: 1.5 }}>
          Your choices helped us learn what you enjoy. You can explore more whenever you like.
        </p>
      </div>

      {checkpoint ? (
        <Card style={{ marginTop: 24, borderColor: profileReady ? C.success : C.warning }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: profileReady ? C.success : C.warning, textTransform: 'uppercase', letterSpacing: 0.8 }}>{profileReady ? 'Career ideas are ready' : 'Keep discovering'}</p>
          <p style={{ margin: '8px 0 0', fontSize: 14, lineHeight: 1.55 }}>
            {profileReady ? 'We have some career ideas for you to look at. These can change as you explore.' : 'A few more questions will help us learn what you enjoy.'}
          </p>
        </Card>
      ) : (
        <p style={{ margin: '20px 4px 0', fontSize: 12, color: C.muted, textAlign: 'center' }}>You'll complete at least 3 short exploration sessions.</p>
      )}

      <div className="mt-5">
        <SectionTitle>Recommended Videos for You</SectionTitle>
        <Text tone="muted" className="text-xs mb-3">Optional · watch a video or go straight to your dashboard.</Text>
        <div className="flex flex-col gap-3">
          {suggestedVideos.map((video, index) => <Card key={video.id}>
            <Text tone="cyan" className="text-xs font-semibold mb-3">{index === 0 ? 'Based on Your Interest' : 'Explore Another Field'}</Text>
            <div className="flex items-start gap-3">
              <Photo {...videoPhoto(video)} className="w-24 h-20 rounded-xl shrink-0" />
              <div className="min-w-0">
                <Text className="text-sm font-semibold leading-snug">{video.title}</Text>
                <Text tone="sub" className="text-xs leading-relaxed mt-1 line-clamp-2">{video.description}</Text>
              </div>
            </div>
            <div className="mt-3"><Btn small variant="ghost" onClick={() => nav('videos', { videoId: video.id, returnTo: 'session-result' })}>Watch video</Btn></div>
          </Card>)}
        </div>
      </div>
    </Screen>
  );
}
