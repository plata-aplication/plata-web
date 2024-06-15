import { LinkProps, Link as RouteLink } from 'atomic-router-react'
import { RouteParams } from 'atomic-router'
import { cn } from '@/shared/lib/cn'

type Props<T extends RouteParams> = LinkProps<T> & {
  className?: string
}

export function Link<T extends RouteParams>({ className, ...props }: Props<T>) {
  return <RouteLink {...props} className={cn('text-sky-500', className)} />
}
