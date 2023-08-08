import { staticFile, useCurrentFrame } from 'remotion';
import {
    AbsoluteFill,
    Sequence,
    useVideoConfig,
    interpolate,
    Img,
} from 'remotion';
import { CameraMotionBlur } from '@remotion/motion-blur';
import { Speaker as SpeakerType, Session as SessionType } from '../types';
import SpringIn from '../components/ZoomIn';
import MoveObject from '../components/MoveObject';

// CONSTANTS - Please change these to change the theme of the animation
import { loadFont } from '@remotion/google-fonts/Vollkorn';
const LEFT_COLOUR = '#00F839';
const RIGHT_COLOUR = '#0DFBFF';
const LOGO_PICTURE = '/images/FtC.svg';
const SCALE_IMAGE = 2;

const { fontFamily } = loadFont('normal', {
    weights: ['400', '600'],
});

interface Props {
    session: SessionType;
}

function splitTextIntoLines(text: string, maxLen: number): string[] {
    const lines = [];
    let currentLine = '';
    for (const word of text.split(' ')) {
        if (currentLine.length + word.length > maxLen) {
            lines.push(currentLine.trim());
            currentLine = word;
        } else {
            currentLine += ` ${word}`;
        }
    }
    lines.push(currentLine.trim());
    return lines;
}

export function Intro(props: Props) {
    const { durationInFrames } = useVideoConfig();
    const frame = useCurrentFrame();
    const opacity = interpolate(
        frame,
        [durationInFrames - 15, durationInFrames],
        [1, 0],
        {
            extrapolateRight: 'clamp',
        },
    );

    return (
        <CameraMotionBlur samples={5}>
            <AbsoluteFill style={{ opacity }}>
                <Sequence name="Background">
                    <AbsoluteFill
                        style={{
                            background: `linear-gradient(to right, ${LEFT_COLOUR}, ${RIGHT_COLOUR})`,
                        }}
                    />
                </Sequence>

                <Sequence durationInFrames={70}>
                    <AbsoluteFill>
                        <div
                            style={{ transform: `scale(${SCALE_IMAGE})` }}
                            className="flex items-center justify-center h-screen">
                            <SpringIn image={LOGO_PICTURE} />
                        </div>
                    </AbsoluteFill>
                </Sequence>

                <Sequence from={69}>
                    <AbsoluteFill>
                        <div
                            style={{ transform: `scale(${SCALE_IMAGE})` }}
                            className="flex items-center justify-center h-screen">
                            <MoveObject
                                x={600 / SCALE_IMAGE}
                                y={0}
                                durationInSeconds={0.5}>
                                <Img src={staticFile(LOGO_PICTURE)} />
                            </MoveObject>
                        </div>
                    </AbsoluteFill>
                </Sequence>

                <Sequence name="Speaker info" from={70}>
                    <AbsoluteFill>
                        <div
                            style={{
                                transform:
                                    'translateY(200px) translateX(-1000px)',
                            }}>
                            {props.session.speakers &&
                                props.session.speakers.map((speaker, index) => (
                                    <SpeakerInfo
                                        speaker={speaker}
                                        index={index}
                                        durationInFrames={durationInFrames}
                                    />
                                ))}
                            <SessionName
                                name={props.session.name}
                                durationInFrames={durationInFrames}
                            />
                        </div>
                    </AbsoluteFill>
                </Sequence>
            </AbsoluteFill>
        </CameraMotionBlur>
    );
}

const SpeakerInfo: React.FC<{
    speaker: SpeakerType;
    index: number;
    durationInFrames: number;
}> = ({ speaker, index, durationInFrames }) => (
    <div
        key={index}
        style={{
            color: '#000000',
            transform: `translateY(${300 + index * -75}px)`,
            fontSize: 60,
            fontFamily,
            fontWeight: 600,
        }}>
        <Sequence
            name={`Speaker: ${speaker.name}`}
            durationInFrames={durationInFrames}>
            <MoveObject x={1150} y={0} durationInSeconds={0.8}>
                <div>{speaker.name}</div>
            </MoveObject>
        </Sequence>
    </div>
);

const SessionName: React.FC<{ name: string; durationInFrames: number }> = ({
    name,
    durationInFrames,
}) => (
    <Sequence name="Session name" durationInFrames={durationInFrames}>
        <MoveObject x={1150} y={0} durationInSeconds={0.6}>
            <div
                style={{
                    color: '#000000',
                    transform: 'translateY(400px)',
                    fontFamily,
                    fontWeight: '200',
                    fontSize: 40,
                }}>
                {splitTextIntoLines(name, 30).map((line, key) => (
                    <div key={key}>{line}</div>
                ))}
            </div>
        </MoveObject>
    </Sequence>
);
