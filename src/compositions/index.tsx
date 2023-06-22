import { Composition, Still } from 'remotion';
import { Session } from './session';

const TEST_SESSION = {
  id: 'session-1',
  name: 'Privacy Infrastructure & Tooling',
  speakers: [
    {
      name: 'Alex Kampa',
      avatar: 'https://prague.web3privacy.info/people/alex-kampa.jpg',
    },
  ],
};

export function Compositions() {
  return (
    <>
      <Composition
        id="session"
        component={Session}
        width={1920}
        height={1080}
        durationInFrames={175}
        fps={25}
        defaultProps={{ session: TEST_SESSION, small: false }}
      />
    </>
  );
}
