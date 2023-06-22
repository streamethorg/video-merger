import { AbsoluteFill, Img, staticFile } from 'remotion';
import { Logo } from '../components/Logo';
import { swarmLogo } from '../components/SwarmLogo';

export function Break() {
  const bgImage = staticFile('images/background.png');

  return (
    <AbsoluteFill>
      <AbsoluteFill className="bg-black">
        <Img src={bgImage} />
      </AbsoluteFill>

      <AbsoluteFill className="content-start p-20">
        <div>
          <Logo />
        </div>

        <div className="flex flex-col items-center justify-center align-center h-full">
          <swarmLogo />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
