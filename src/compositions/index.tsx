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
import SESSIONS from '../../public/json/sessions.json';
import { Session as SessionType } from '../types';
import {
    G_VIDEO_PATH,
    G_FPS,
    G_DEFAULT_AVATAR_URL,
    G_ANIMATION_PATH,
} from '../utils/themeConfig';
import Text from '../components/Text';
import { splitTextIntoString } from '../utils/textUtils';
import { Circle } from '@remotion/shapes';

const sessions: SessionType[] = SESSIONS.data;
const DURATION_ANIMATION = 210;

interface Props {
    readonly session: SessionType;
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

    const computeOpacity = (f: any) => {
        return interpolate(
            f,
            [DURATION_ANIMATION - 30, DURATION_ANIMATION],
            [1, 0],
            {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
            },
        );
    };

    const showText = (f: any) => {
        return interpolate(f, [100, 130], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        });
    };

    const videoOpacity = computeOpacity(frame);
    const startCutInSeconds = convertToSeconds(session.startCut);
    const endCutInSeconds = convertToSeconds(session.endCut);
    const allSpeakerNames = session
        .speakers!.map((speaker) => speaker.name)
        .join('\n');

    return (
        <>
            <Sequence name="Video" from={DURATION_ANIMATION - 30}>
                <Video
                    src={staticFile(G_VIDEO_PATH)}
                    startFrom={startCutInSeconds * fps}
                    endAt={endCutInSeconds * fps}
                    volume={() => videoVolume}
                />
            </Sequence>
            <Sequence durationInFrames={DURATION_ANIMATION}>
                <Video
                    style={{ opacity: videoOpacity }}
                    src={staticFile(G_ANIMATION_PATH)}
                />
            </Sequence>
            <Sequence name="Name(s)" durationInFrames={DURATION_ANIMATION}>
                <div
                    style={{
                        width: '100%',
                        opacity: videoOpacity,
                    }}>
                    <Text
                        text={allSpeakerNames}
                        x={0}
                        y={session.name.length < 50 ? 650 : 770}
                        color="white"
                        fontSize={50}
                        opacity={showText(frame)}
                    />
                </div>
            </Sequence>
            <Sequence name="Title" durationInFrames={DURATION_ANIMATION}>
                <div
                    style={{
                        width: '100%',
                        opacity: videoOpacity,
                    }}>
                    <Text
                        text={splitTextIntoString(
                            session.name.toUpperCase(),
                            50,
                        )}
                        x={0}
                        y={580}
                        color="white"
                        opacity={showText(frame)}
                        fontSize={50}
                        fontFamily="Latin Modern Caps"
                        fontWeight={600}
                    />
                </div>
            </Sequence>
            <AbsoluteFill style={{ backgroundColor: 'black', opacity }} />
        </>
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
