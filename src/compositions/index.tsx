import { Composition, staticFile } from 'remotion';
import { IntroSwarm } from './introSwarm';
import SESSIONS from '../scripts/sessions.json';
import { Session as SessionType } from '../types';

const sessions: SessionType[] = SESSIONS.data;

interface Props {
  session: SessionType;
}

export function Compositions() {
  const defaultAvatarUrl = staticFile('/images/ETHLogo.jpg');
  const processedSessions = sessions
    .filter((session) => session.speakers && session.speakers.length > 0)
    .map((session) => {
      if (session.speakers) {
        session.speakers.forEach((speaker) => {
          if (speaker.avatarUrl === null) {
            speaker.avatarUrl = defaultAvatarUrl;
            console.warn(`${session.id} has no avatar, changing it to default`);
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
          durationInFrames={500}
          fps={25}
          defaultProps={{ session }}
        />
      ))}
    </>
  );
}
