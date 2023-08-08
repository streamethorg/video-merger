import {
    Composition,
    Sequence,
    AbsoluteFill,
    staticFile,
    Video,
    Audio,
    useVideoConfig,
    useCurrentFrame,
    interpolate,
} from 'remotion';
import { Intro } from './intro';
import SESSIONS from '../../public/json/sessions.json';
import { Session as SessionType } from '../types';

const sessions: SessionType[] = SESSIONS.data;

const FPS = 25;
const VIDEO_PATH = '/videos/stream.mp4';
const AUDIO_PATH = '/audio/507_short1_innovation-design_0019.wav';
const DEFAULT_AVATAR_URL = staticFile('/images/ETHLogo.jpg');

interface Props {
    session: SessionType;
}

function convertToSeconds(time: string | undefined): number {
    return time
        ? time
              .split(':')
              .map(Number)
              .reduce((acc, val, index) => acc + val * 60 ** (2 - index), 0)
        : 0;
}

function clampInterpolation(f: number, start: number[], end: number[]): number {
    return interpolate(f, start, end, {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });
}

const IntroWithVideo: React.FC<Props> = ({ session }) => {
    const { durationInFrames, fps } = useVideoConfig();
    const frame = useCurrentFrame();
    const startFadeFrame = durationInFrames - 50;

    const opacity = clampInterpolation(
        frame,
        [startFadeFrame, durationInFrames],
        [0, 1],
    );

    const videoVolume = clampInterpolation(
        frame,
        [startFadeFrame, durationInFrames],
        [1, 0],
    );

    const startCutInSeconds = convertToSeconds(session.startCut);
    const endCutInSeconds = convertToSeconds(session.endCut);

    return (
        <div>
            <Sequence name="Video" from={150}>
                <Video
                    src={staticFile(VIDEO_PATH)}
                    startFrom={startCutInSeconds * fps}
                    endAt={endCutInSeconds * fps}
                    volume={() => videoVolume}
                />
            </Sequence>
            <Sequence durationInFrames={175}>
                <Intro session={session} />
            </Sequence>
            <Audio
                src={staticFile(AUDIO_PATH)}
                endAt={175}
                volume={(f) =>
                    f < 135
                        ? interpolate(f, [0, 10], [0, 1], {
                              extrapolateLeft: 'clamp',
                              extrapolateRight: 'clamp',
                          })
                        : interpolate(f, [135, 175], [1, 0], {
                              extrapolateLeft: 'clamp',
                              extrapolateRight: 'clamp',
                          })
                }
            />
            <AbsoluteFill style={{ backgroundColor: 'black', opacity }} />
        </div>
    );
};

export function Compositions() {
    const processedSessions = sessions
        .filter(
            (session) =>
                session.speakers &&
                session.speakers.length > 0 &&
                session.startCut &&
                session.endCut &&
                convertToSeconds(session.endCut) >= 3 &&
                convertToSeconds(session.endCut) -
                    convertToSeconds(session.startCut) >
                    0,
        )
        .map((session) => {
            if (session.speakers) {
                session.speakers.forEach((speaker) => {
                    if (speaker.avatarUrl === null) {
                        speaker.avatarUrl = DEFAULT_AVATAR_URL;
                        console.warn(
                            `${session.id} has no avatar, changing it to default`,
                        );
                    }
                });
            }
            return session;
        });

    return (
        <>
            {processedSessions.map((session) => (
                <Composition
                    key={session.id}
                    id={`session-${session.id}`}
                    component={IntroWithVideo as any}
                    width={1920}
                    height={1080}
                    durationInFrames={
                        convertToSeconds(session.endCut) * FPS -
                        convertToSeconds(session.startCut) * FPS
                    }
                    fps={FPS}
                    defaultProps={{ session }}
                />
            ))}
        </>
    );
}
