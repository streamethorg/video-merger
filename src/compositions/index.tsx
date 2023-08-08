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
import { BaseOneIntro } from './base1_intro';
import SESSIONS from '../../public/json/sessions.json';
import { Session as SessionType } from '../types';
import {
    G_AUDIO_PATH,
    G_VIDEO_PATH,
    G_FPS,
    G_DEFAULT_AVATAR_URL,
} from '../utils/themeConfig';

const sessions: SessionType[] = SESSIONS.data;

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

function IntroWithVideo(props: Props) {
    const { session } = props;
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
                    src={staticFile(G_VIDEO_PATH)}
                    startFrom={startCutInSeconds * fps}
                    endAt={endCutInSeconds * fps}
                    volume={() => videoVolume}
                />
            </Sequence>
            <Sequence durationInFrames={175}>
                <BaseOneIntro session={session} />
            </Sequence>
            <Audio
                src={staticFile(G_AUDIO_PATH)}
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
}

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
                        speaker.avatarUrl = G_DEFAULT_AVATAR_URL;
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
            {processedSessions.map((session, index) => (
                <Composition
                    key={index}
                    id={`session-${session.id}`}
                    component={IntroWithVideo as any}
                    width={1920}
                    height={1080}
                    durationInFrames={
                        convertToSeconds(session.endCut) * G_FPS -
                        convertToSeconds(session.startCut) * G_FPS
                    }
                    fps={G_FPS}
                    defaultProps={{ session }}
                />
            ))}
        </>
    );
}
