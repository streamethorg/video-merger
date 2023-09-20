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
import { ISession as SessionType, ISpeaker as SpeakerType } from '../types';
import SESSIONS from '../../public/json/sessions.json';
import {
    G_AUDIO_PATH,
    G_VIDEO_PATH,
    G_FPS,
    G_DEFAULT_AVATAR_URL,
    G_ANIMATION_PATH,
} from '../utils/themeConfig';
import Text from '../components/Text';
import { splitTextIntoString } from '../utils/textUtils';
import { Rect } from '@remotion/shapes';

const sessions: SessionType[] = SESSIONS.map((session) => {
    return {
        ...session,
        start: new Date(session.start),
        end: new Date(session.end),
    };
});

const DURATION_ANIMATION = 170;

interface Props {
    readonly session: SessionType;
}

function clampInterpolation(f: number, start: number[], end: number[]): number {
    return interpolate(f, start, end, {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });
}

function IntroWithVideo(props: Props) {
    const { session } = props;
    const { durationInFrames } = useVideoConfig();
    const frame = useCurrentFrame();
    const startFadeFrame = durationInFrames - 30;

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
        return interpolate(f, [160, 170], [1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        });
    };

    const showText = (f: any) => {
        return interpolate(f, [15, 30], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        });
    };

    const videoOpacity = computeOpacity(frame);

    return (
        <>
            <Sequence name="Video" from={DURATION_ANIMATION - 40}>
                <Video
                    src={staticFile(G_VIDEO_PATH + session.id + '.mp4')}
                    volume={() => videoVolume}
                />
            </Sequence>
            <Sequence durationInFrames={DURATION_ANIMATION}>
                <Video
                    muted
                    style={{ opacity: videoOpacity }}
                    src={staticFile(G_ANIMATION_PATH)}
                />
            </Sequence>
            {session.speakers!.map((speaker, index) => (
                <Sequence name="Name(s)" durationInFrames={DURATION_ANIMATION}>
                    <div style={{ opacity: videoOpacity }}>
                        <Text
                            text={speaker.name}
                            x={775}
                            y={335 - index * 80}
                            opacity={showText(frame)}
                            fontWeight={800}
                            fontSize={65}
                        />
                    </div>
                </Sequence>
            ))}
            <Sequence name="Title" durationInFrames={DURATION_ANIMATION}>
                <div
                    className="leading-tight"
                    style={{ opacity: videoOpacity }}>
                    <Text
                        text={splitTextIntoString(session.name, 30)}
                        x={775}
                        y={493}
                        opacity={showText(frame)}
                        fontWeight={600}
                    />
                </div>
            </Sequence>
            <Sequence durationInFrames={DURATION_ANIMATION}>
                <div style={{ opacity: videoOpacity }}>
                    <Rect
                        width={770}
                        height={3}
                        fill="black"
                        style={{
                            opacity: showText(frame),
                            transform: 'translateX(760px) translateY(450px)',
                        }}
                    />
                </div>
            </Sequence>
            <Audio
                src={staticFile(G_AUDIO_PATH)}
                endAt={DURATION_ANIMATION}
                volume={(f) =>
                    f < 130
                        ? interpolate(f, [0, 10], [0, 1], {
                              extrapolateLeft: 'clamp',
                              extrapolateRight: 'clamp',
                          })
                        : interpolate(f, [130, 170], [1, 0], {
                              extrapolateLeft: 'clamp',
                              extrapolateRight: 'clamp',
                          })
                }
            />
            <AbsoluteFill style={{ backgroundColor: 'black', opacity }} />
        </>
    );
}

export function Compositions() {
    const processedSessions = sessions
        .filter(
            (session: SessionType) =>
                session.speakers &&
                session.speakers.length > 0 &&
                session.source?.start &&
                session.source?.end,
        )
        .map((session: SessionType) => {
            if (session.speakers) {
                session.speakers.forEach((speaker: SpeakerType) => {
                    if (speaker.photo === null) {
                        speaker.photo = G_DEFAULT_AVATAR_URL;
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
            {processedSessions.map((session: SessionType, index: number) => (
                <Composition
                    key={index}
                    id={session.id.replace(/_/g, '-')}
                    component={IntroWithVideo as any}
                    width={1920}
                    height={1080}
                    durationInFrames={
                        session.source!.end * G_FPS -
                        session.source!.start * G_FPS
                    }
                    fps={G_FPS}
                    defaultProps={{ session }}
                />
            ))}
        </>
    );
}
