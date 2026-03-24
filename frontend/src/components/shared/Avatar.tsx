interface Props {
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'size-7 text-xs',
  md: 'size-9 text-sm',
  lg: 'size-12 text-base',
}

export const Avatar = ({ name, size = 'sm' }: Props) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className={`
        ${sizeMap[size]}
        rounded-full bg-primary/10 flex items-center
        justify-center shrink-0 font-medium text-primary
      `}
    >
      {initials}
    </div>
  )
}