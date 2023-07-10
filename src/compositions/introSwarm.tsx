import { useCurrentFrame } from 'remotion';
import {
  AbsoluteFill,
  Img,
  Sequence,
  useVideoConfig,
  interpolate,
} from 'remotion';
import { Session as SessionType } from '../types';
import SpringIn from '../components/ZoomIn';
import MoveObject from '../components/MoveObject';
import { SwarmLogo } from '../components/SwarmLogo';
import { loadFont } from '@remotion/google-fonts/Inter';

const { fontFamily } = loadFont('normal', {
  weights: ['200', '400'],
});

interface Props {
  session: SessionType;
}

function splitTextIntoLines(text: string, maxLen: number) {
  const words = text.split(' ');
  const lines: string[] = [''];
  let lineIndex = 0;

  words.forEach((word) => {
    if ((lines[lineIndex] + word).length > maxLen) {
      lines.push(word);
      lineIndex++;
    } else {
      lines[lineIndex] += ` ${word}`;
    }
  });

  return lines;
}

export function IntroSwarm(props: Props) {
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (
    <AbsoluteFill style={{ opacity }}>
      <Sequence name="Background">
        <AbsoluteFill className="bg-gradient-to-r from-purple-700 to-orange-500" />
      </Sequence>

      <Sequence durationInFrames={70}>
        <AbsoluteFill>
          <div className="flex items-center justify-center h-screen">
            <SpringIn />
          </div>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={70}>
        <AbsoluteFill>
          <div className="flex items-center justify-center h-screen">
            <MoveObject x={600} y={0} durationInSeconds={0.5}>
              <SwarmLogo />
            </MoveObject>
          </div>
        </AbsoluteFill>
      </Sequence>

      <Sequence name="Speaker info" from={70}>
        <AbsoluteFill>
          <div style={{
            transform: "translateY(200px) translateX(-1000px)"
          }}>
          {props.session.speakers.map((speaker, index) => (
            <div
              key={index}
              style={{
                transform: `translateY(${300 + index * -75}px)`,
                fontSize: 60,
                fontFamily: 'Arial',
              }}
            >
              <Sequence key={index} name={`Speaker: ${speaker.name}`} durationInFrames={durationInFrames}>
                <MoveObject x={1150} y={0} durationInSeconds={0.8}>
                  <div>
                    {speaker.name}
                  </div>
                </MoveObject>
              </Sequence>
            </div>
          ))}
          <Sequence name="Session name" durationInFrames={durationInFrames}>
            <MoveObject x={1150} y={0} durationInSeconds={0.6}>
              <div
                style={{
                  transform: 'translateY(400px)',
                  fontFamily,
                  fontWeight: '200',
                  fontSize: 40,
                }}
              >
                {splitTextIntoLines(props.session.name, 30).map(
                  (line, index) => (
                    <div key={index}>{line}</div>
                  ),
                )}
              </div>
            </MoveObject>
          </Sequence>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
}
