import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { SwarmLogo } from './SwarmLogo';

const SpringIn = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    fps,
    frame: frame - 15,
    config: {
      mass: 0.8,
    },
  });

  return (
    <div style={{ transform: `scale(${scale})` }}>
      <SwarmLogo />
    </div>
  );
};

export default SpringIn;
