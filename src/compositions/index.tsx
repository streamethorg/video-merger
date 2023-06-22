import { Composition, Still } from 'remotion';
import { IntroSwarm } from './introSwarm';
import SESSIONS from '../scripts/sessions.json';

export function Compositions() {
  const defaultAvatarUrl = '/images/ETHLogo.jpg';
  const processedSessions = SESSIONS.data.map(session => {
    if (session.speakers) {
      session.speakers.forEach(speaker => {
        if (speaker.avatarUrl === null) {
          speaker.avatarUrl = defaultAvatarUrl;
        }
      });
    }
    return session;
  });

  return (
    <>
      {processedSessions.map((session, index) => (
        <Composition
          key={index}
          id={`session-${session.id}`}
          component={IntroSwarm}
          width={1920}
          height={1080}
          durationInFrames={175}
          fps={25}
          defaultProps={{ session }}
        />
      ))}
    </>
  );
}
