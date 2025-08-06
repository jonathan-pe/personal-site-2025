import type { JSX, SVGProps } from 'react'

export interface Icon {
  name: string
  href: string
  icon: (_props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => JSX.Element
}
