import {
    Sequence,
    Audio,
    staticFile,
    Video,
    useVideoConfig,
    useCurrentFrame,
    interpolate,
} from 'remotion';
import { ISession as SessionType } from '../types';
import {
    G_ANIMATION_PATH,
    G_AUDIO_PATH,
    G_VIDEO_PATH,
} from '../utils/themeConfig';
import Text from '../components/Text';
import { splitTextIntoString } from '../utils/textUtils';

const L_DURATION = 250;

function clampInterpolation(f: number, start: number[], end: number[]): number {
    return interpolate(f, start, end, {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });
}

export default function Session_Ethchicago({
    session,
}: {
    readonly session: SessionType;
}) {
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
        return interpolate(f, [L_DURATION - 30, L_DURATION], [1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        });
    };

    const showText = (f: any) => {
        return interpolate(f, [110, 140], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        });
    };

    const videoOpacity = computeOpacity(frame);
    const allSpeakerNames = session
        .speakers!.map((speaker) => speaker.name)
        .join('\n');

    return (
        <>
            <Sequence name="Video" from={L_DURATION - 40}>
                <Video
                    src={staticFile(G_VIDEO_PATH + session.id + '.mp4')}
                    volume={() => videoVolume}
                />
            </Sequence>
            <Sequence durationInFrames={L_DURATION}>
                <Video
                    style={{ opacity: videoOpacity }}
                    src={staticFile(G_ANIMATION_PATH)}
                />
            </Sequence>
            <Sequence name="Name(s)" durationInFrames={L_DURATION}>
                <div
                    style={{
                        width: '100%',
                        opacity: videoOpacity,
                    }}>
                    <Text
                        text={allSpeakerNames.toUpperCase()}
                        x={0}
                        y={
                            session.name.length < 50
                                ? 600
                                : 670 || session.name.length > 120
                                ? 710
                                : 670
                        }
                        color="white"
                        fontSize={session.speakers!.length > 5 ? 25 : 50}
                        opacity={showText(frame)}
                        fontWeight={700}
                    />
                </div>
            </Sequence>
            <Sequence name="Title" durationInFrames={L_DURATION}>
                <div
                    style={{
                        width: '100%',
                        opacity: videoOpacity,
                    }}>
                    <Text
                        text={splitTextIntoString(session.name, 50)}
                        x={0}
                        y={520}
                        color="white"
                        opacity={showText(frame)}
                        fontSize={50}
                    />
                </div>
            </Sequence>
            <Audio
                src={staticFile(G_AUDIO_PATH)}
                endAt={L_DURATION}
                volume={(f) =>
                    f < L_DURATION - 20
                        ? interpolate(f, [0, 10], [0, 0.8], {
                              extrapolateLeft: 'clamp',
                              extrapolateRight: 'clamp',
                          })
                        : interpolate(
                              f,
                              [L_DURATION - 20, L_DURATION],
                              [0.8, 0],
                              {
                                  extrapolateLeft: 'clamp',
                                  extrapolateRight: 'clamp',
                              },
                          )
                }
            />
        </>
    );
}
