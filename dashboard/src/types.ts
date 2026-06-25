export type UserRole = 'admin' | 'edit' | 'read'

export type TeamAccess = {
  codebaseAccess: string
  repoLinks: string
  changeProcess: string
}

export type DesignAccess = {
  tools: string
  notes: string
}

export type AnalyticsAccess = {
  platforms: string[]
  notes: string
  accessProcess: string
}

export type Environment = {
  id: string
  name: string
  tier: 'PROD' | 'QA' | 'DEV' | 'CUSTOM'
  description: string
  launchUrl: string
  credentials: string
}

export type Project = {
  id: string
  name: string
  client: string
  iconUrl?: string
  summary: string
  purpose: string
  stack: string[]
  analytics: string[]
  implementationStatus: string
  teamAccess: TeamAccess
  designAccess: DesignAccess
  analyticsAccess: AnalyticsAccess
  environments: Environment[]
}

export type User = {
  id: string
  fullName: string
  email: string
  password: string
  role: UserRole
}
