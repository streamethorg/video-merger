import { useVideoConfig } from 'remotion';
import { useCurrentFrame } from 'remotion';
import { interpolate } from 'remotion';
import {
  Composition,
  Sequence,
  AbsoluteFill,
  staticFile,
  Video,
  Audio,
} from 'remotion';
import { IntroSwarm } from './introSwarm';
import SESSIONS from '../../public/json/sessions.json';
import { Session as SessionType } from '../types';

const sessions: SessionType[] = SESSIONS.data;
const FPS = 25;

interface Props {
  session: SessionType;
}


function convertToSeconds(time: string | undefined): number {
  if (time) {
    const parts = time.split(':').map(Number);
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  return 0;
}

const IntroSwarmWithVideo: React.FC<Props> = ({ session }) => {
  const { durationInFrames, fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const startFadeFrame = durationInFrames - 50;

  const opacity = interpolate(
    frame,
    [startFadeFrame, durationInFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  const videoVolume = interpolate(
    frame,
    [startFadeFrame, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  const startCutInSeconds = convertToSeconds(session.startCut);
  const endCutInSeconds = convertToSeconds(session.endCut);

  return (
    <div>
      <Sequence name="Video" from={150}>
        <Video
          src={staticFile('/videos/stream.mp4')}
          startFrom={startCutInSeconds * fps}
          endAt={endCutInSeconds * fps}
          volume={() => videoVolume}
        />
      </Sequence>
      <Sequence durationInFrames={175}>
        <IntroSwarm session={session} />
      </Sequence>
      <Audio 
        src={staticFile("/audio/507_short1_innovation-design_0019_preview.mp3")} 
        endAt={175} 
        volume={(f) =>
          f < 135
            ? interpolate(f, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            : interpolate(f, [135, 175], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        }
      />
      <AbsoluteFill style={{ backgroundColor: 'black', opacity }} />
    </div>
  );
};

export function Compositions() {
  const defaultAvatarUrl = staticFile('/images/ETHLogo.jpg');
  const processedSessions = sessions
    .filter(
      (session) =>
        session.speakers &&
        session.speakers.length > 0 &&
        session.startCut &&
        session.endCut &&
        convertToSeconds(session.endCut) >= 3 &&
        convertToSeconds(session.endCut) - convertToSeconds(session.startCut) > 0,
    )
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
          component={IntroSwarmWithVideo}
          width={1920}
          height={1080}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          durationInFrames={convertToSeconds(session.endCut) * FPS - convertToSeconds(session.startCut) * FPS}
          fps={FPS}
          defaultProps={{ session }}
        />
      ))}
    </>
  );
}
