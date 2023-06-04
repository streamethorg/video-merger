import { Composition, Still } from 'remotion'
import { Break } from './break'
import { Session } from './session'

const TEST_SESSION = {
  id: 'session-1',
  name: 'Privacy Infrastructure & Tooling',
  speakers: [
    {
      name: 'Alex Kampa',
      avatar: 'https://prague.web3privacy.info/people/alex-kampa.jpg',
      twitter: 'nicksvyaznoy',
    },
    {
      name: 'Tibor Csóka',
      avatar: 'https://prague.web3privacy.info/people/tibor-csoka.jpg',
    },
    {
      name: 'Costanza Gallo',
      avatar: 'https://prague.web3privacy.info/people/costanza-gallo.jpeg',
      twitter: 'costgallo',
    },
  ],
}

export function Compositions() {
  return (
    <>
      <Composition
        id="session"
        component={Session}
        width={1920}
        height={1080}
        durationInFrames={120}
        fps={30}
        defaultProps={{ session: TEST_SESSION, small: false }}
      />

      <Still id="still-break" component={Break} width={1920} height={1080} />
      <Still id="still-hd" component={Session} width={1920} height={1080} defaultProps={{ session: TEST_SESSION, smal: false }} />
      <Still id="still-social" component={Session} width={1200} height={630} defaultProps={{ session: TEST_SESSION, small: true }} />
    </>
  )
}
