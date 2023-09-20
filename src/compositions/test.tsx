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
import { ISession as SessionType } from '../types';
import {
    G_AUDIO_PATH,
    G_VIDEO_PATH,
    G_FPS,
    G_ANIMATION_PATH,
} from '../utils/themeConfig';
import Text from '../components/Text';
import { splitTextIntoString } from '../utils/textUtils';
import { Rect } from '@remotion/shapes';

const DURATION_ANIMATION = 170;

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
        return interpolate(f, [135, 175], [1, 0], {
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
    const startCutInSeconds = convertToSeconds(session.startCut);
    const endCutInSeconds = convertToSeconds(session.endCut);
    console.log('startCutInSeconds', startCutInSeconds, fps);
    console.log('endCutInSeconds', endCutInSeconds, fps);
    return (
        <>
            <Sequence name="Video" from={DURATION_ANIMATION - 30}>
                <Video
                    src={staticFile(G_VIDEO_PATH)}
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
                endAt={150}
                volume={(f) =>
                    f < 115
                        ? interpolate(f, [0, 10], [0, 1], {
                              extrapolateLeft: 'clamp',
                              extrapolateRight: 'clamp',
                          })
                        : interpolate(f, [115, 150], [1, 0], {
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
    const session = {
        id: 'opening_keynote',
        name: 'Opening keynote',
        description: '',
        start: 1694244600000,
        end: 1694245200000,
        stageId: 'mainstage',
        speakers: [
            {
                id: 'david_casey',
                name: 'David Casey',
                bio: 'Protocol Labs/Funding the Commons',
                eventId: 'funding_the_commons_berlin_2023',
            },
        ],
        source: {
            streamUrl:
                'https://lp-playback.com/hls/a2ae5cylmxs38npg/index.m3u8',
            start: 1075,
            end: 1477,
        },
        playbackId: '',
        eventId: 'funding_the_commons_berlin_2023',
        coverImage:
            '/sessions/funding_the_commons_berlin_2023/opening_keynote.jpg',
        startCut: '00:17:54',
        endCut: '00:24:37',
    };

    return (
        <Composition
            id="opening-keynote"
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
    );
}
