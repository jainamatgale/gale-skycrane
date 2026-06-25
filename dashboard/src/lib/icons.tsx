import type { ReactNode } from 'react'
import { Boxes } from 'lucide-react'
import { FaGoogle, FaLinkedin, FaReact, FaShopify, FaWordpress } from 'react-icons/fa'
import { SiGoogleanalytics, SiMeta, SiNextdotjs, SiTypescript } from 'react-icons/si'

type IconEntry = {
  node: ReactNode
  color: string
}

const iconMap: Record<string, IconEntry> = {
  'Next.js': { node: <SiNextdotjs />, color: '#111827' },
  React: { node: <FaReact />, color: '#0aa3c2' },
  TypeScript: { node: <SiTypescript />, color: '#3178c6' },
  WordPress: { node: <FaWordpress />, color: '#21759b' },
  Shopify: { node: <FaShopify />, color: '#5e8e3e' },
  GA4: { node: <SiGoogleanalytics />, color: '#e8710a' },
  GTM: { node: <FaGoogle />, color: '#246fdb' },
  'Meta Pixel': { node: <SiMeta />, color: '#0866ff' },
  'Meta Ads': { node: <SiMeta />, color: '#0866ff' },
  'LinkedIn Insight': { node: <FaLinkedin />, color: '#0a66c2' },
  'LinkedIn Campaign Manager': { node: <FaLinkedin />, color: '#0a66c2' },
}

export const getToolIcon = (label: string): ReactNode => iconMap[label]?.node ?? <Boxes />

export const getToolColor = (label: string): string => iconMap[label]?.color ?? '#6366f1'

export const hasToolIcon = (label: string): boolean => Boolean(iconMap[label])
