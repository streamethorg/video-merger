import { AbsoluteFill, Audio, Img, staticFile } from 'remotion'
import { Logo } from '../components/Logo'
import { Prague } from '../components/Prague'
import { Speaker } from '../components/Speaker'
import { Title } from '../components/Title'
import { Session as SessionType, Speaker as SpeakerType } from '../types'

interface Props {
  session: SessionType
  small?: boolean
}

export function Session(props: Props) {
  const bgImage = staticFile('images/background.png')

  return (
    <AbsoluteFill>
      <Audio src={staticFile('audio/static.wav')} />

      <AbsoluteFill className="bg-black">
        <Img src={bgImage} />
      </AbsoluteFill>

      <AbsoluteFill className={`content-start ${props.small ? 'p-10' : 'p-20'}`}>
        <div>
          <Logo size={props.small ? '180' : ''} />
        </div>

        <div className={`flex flex-col items-center justify-center ${props.small ? 'my-5' : 'my-10'}`}>
          <div className={props.small ? 'my-5' : 'my-10'}>
            <Title title={props.session.name} size={props.small ? 'text-3xl' : 'text-6xl'} />
          </div>

          <div className={`flex gap-20 ${props.small ? 'mt-5' : 'mt-10'}`}>
            {props.session.speakers.map((i: SpeakerType) => {
              return <Speaker small={props.small} name={i.name} avatar={i.avatar} twitter={i.twitter} />
            })}
          </div>
        </div>

        <div>
          <Prague size={props.small ? '320' : ''} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
