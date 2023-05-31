import { Img } from 'remotion'

interface Props {
  name: string
  avatar: string
  twitter?: string
  small?: boolean
}

export function Speaker(props: Props) {
  return (
    <div className="flex flex-col items-center">
      <div className={`grayscale invert aspect-square object-cover ${props.small ? 'w-40' : 'w-80'}`}>
        <Img src={props.avatar} alt={props.name} className="rounded-full" />
      </div>
      <div className="text-center">
        <div className={`title ${props.small ? 'text-xl' : 'text-3xl'}`}>{props.name}</div>
        {props.twitter && <div className={`text-gray-400 ${props.small ? 'text-md' : 'text-2xl mt-4'}`}>@{props.twitter}</div>}
      </div>
    </div>
  )
}
