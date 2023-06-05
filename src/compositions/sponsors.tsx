import { AbsoluteFill, Img, staticFile } from 'remotion'
import { Logo } from '../components/Logo'
import { Prague } from '../components/Prague'

export function Sponsors() {
  const bgImage = staticFile('images/background.png')

  return (
    <AbsoluteFill>
      <AbsoluteFill className="bg-black">
        <Img src={bgImage} />
      </AbsoluteFill>

      <AbsoluteFill className="content-start p-20">
        <div>
          <Logo />
        </div>

        <div className="flex flex-col my-20 items-center justify-center ">
          <div className="flex flex-col h-full w-auto bg-white p-10 mt-20 items-center justify-center ">
            <div className="flex gap-28">
              <Img src={staticFile('images/logo/panther.png')} width="200" />
              <Img src={staticFile('images/logo/ens.png')} width="200" />
              <Img src={staticFile('images/logo/pse.png')} width="200" />
            </div>
            <div className="flex gap-28">
              <Img src={staticFile('images/logo/navcoin.png')} width="200" />
              <Img src={staticFile('images/logo/firo.png')} width="200" />
              <Img src={staticFile('images/logo/firn.png')} width="200" />
            </div>
            <div className="flex gap-28">
              <Img src={staticFile('images/logo/aragon.png')} width="200" />
              <Img src={staticFile('images/logo/hopr.png')} width="200" />
              <Img src={staticFile('images/logo/zcash.png')} width="200" />
            </div>
          </div>
        </div>

        <div>
          <Prague />
        </div>

        {/* <div className="flex flex-col items-center justify-center align-center h-full">
          <Prague />
        </div> */}
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
