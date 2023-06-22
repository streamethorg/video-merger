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
import React from 'react';
import MoveObject from '../components/MoveObject';
import { SwarmLogo } from '../components/SwarmLogo';
import { loadFont } from '@remotion/google-fonts/Inter';

const { fontFamily } = loadFont('normal', {
  weights: ['200', '400'],
});

interface Props {
  session: SessionType;
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

  if (!props.session.speakers[0]) {
    return;
  }

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
          <div
            style={{
              transform: 'translateX(-1000px) translateY(300px)',
              fontSize: 70,
              fontFamily: 'Arial',
            }}
          >
            <Sequence name="Image" durationInFrames={durationInFrames}>
              <MoveObject x={1150} y={0} durationInSeconds={1}>
                <div
                  style={{
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    transform: 'translateY(-20px)',
                  }}
                >
                  <Img
                    src={props.session.speakers[0].avatarUrl}
                    alt="description"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
              </MoveObject>
            </Sequence>
            <Sequence name="Speaker name" durationInFrames={durationInFrames}>
              <MoveObject x={1150} y={0} durationInSeconds={0.8}>
                <div style={{ transform: 'translateY(300px)' }}>
                  {props.session.speakers[0].name}
                </div>
              </MoveObject>
            </Sequence>
            <Sequence name="Session name" durationInFrames={durationInFrames}>
              <MoveObject x={1150} y={0} durationInSeconds={0.6}>
                <div
                  style={{
                    transform: 'translateY(400px)',
                    fontFamily,
                    fontWeight: '200',
                  }}
                >
                  {props.session.name}
                </div>
              </MoveObject>
            </Sequence>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
}
