interface Props {
  title: string
  size?: string
}

export function Title(props: Props) {
  return <div className={`title ${props.size ?? 'text-6xl'}`}>{props.title}</div>
}
