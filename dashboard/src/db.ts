import Dexie, { type Table } from 'dexie'
import type { Project, User } from './types'

export class SkycraneDB extends Dexie {
  users!: Table<User, string>
  projects!: Table<Project, string>

  constructor() {
    super('gale_skycrane_db')
    this.version(1).stores({
      users: 'id, email, role',
      projects: 'id, name, client',
    })
  }
}

export const db = new SkycraneDB()

const defaultAdmin: User = {
  id: 'user-admin-1',
  fullName: 'GALE Platform Admin',
  email: 'admin@gale.dev',
  password: 'Admin@123',
  role: 'admin',
}

const defaultEditor: User = {
  id: 'user-editor-1',
  fullName: 'GALE Product Editor',
  email: 'editor@gale.dev',
  password: 'Editor@123',
  role: 'edit',
}

const defaultReader: User = {
  id: 'user-reader-1',
  fullName: 'GALE Read User',
  email: 'reader@gale.dev',
  password: 'Reader@123',
  role: 'read',
}

const fakeProject: Project = {
  id: 'project-skycrane-next',
  name: 'Skycrane Commerce Experience',
  client: 'Starbucks Innovation Sandbox',
  iconUrl: '',
  summary:
    'A future-ready sandbox to test launch flows, analytics tracking, and multi-team collaboration for web and app delivery.',
  purpose:
    'Use this space to prototype client experiences before production delivery while validating measurement, media, and data outcomes.',
  stack: ['Next.js', 'React', 'TypeScript', 'GA4', 'GTM', 'Meta Pixel', 'LinkedIn Insight'],
  analytics: ['GA4', 'GTM', 'Meta Pixel', 'LinkedIn Insight', 'A/B Testing', 'Offline Conversions'],
  implementationStatus:
    'Project launcher, role-based permissions, editable environments, and team access playbooks are implemented in this sandbox dashboard.',
  teamAccess: {
    codebaseAccess: 'Request repository access via internal GALE Partners engineering support channel.',
    repoLinks: 'https://github.com/gale-partners/skycrane-commerce-sandbox',
    changeProcess: 'Create branch -> open PR -> request review from sandbox maintainers and analytics owner.',
  },
  designAccess: {
    tools: 'Figma, Storybook, Design Tokens',
    notes:
      'Design team should request Figma edit rights and confirm reusable component mapping before implementation.',
  },
  analyticsAccess: {
    platforms: ['GA4', 'Meta Ads', 'LinkedIn Campaign Manager', 'Tealium', 'Optimizely'],
    notes:
      'Includes enhanced ecommerce events, campaign parameters, pLTV placeholder model, and offline conversion upload testing.',
    accessProcess:
      'Request platform access using GALE analytics operations form with project name and user role justification.',
  },
  environments: [
    {
      id: 'env-prod',
      name: 'PROD',
      tier: 'PROD',
      description: 'Production-like environment for final demos and validation.',
      launchUrl: 'https://prod.skycrane.gale.dev',
      credentials: 'Use SSO via Okta group: SKYCRANE_PROD_ACCESS',
    },
    {
      id: 'env-qa',
      name: 'QA',
      tier: 'QA',
      description: 'Quality assurance environment for release acceptance and analytics QA.',
      launchUrl: 'https://qa.skycrane.gale.dev',
      credentials: 'qa_user / QA!2026',
    },
    {
      id: 'env-dev',
      name: 'DEV',
      tier: 'DEV',
      description: 'Developer environment for feature experimentation.',
      launchUrl: 'https://dev.skycrane.gale.dev',
      credentials: 'dev_user / Dev!2026',
    },
  ],
}

export const ensureSeedData = async () => {
  const userCount = await db.users.count()
  if (userCount === 0) {
    await db.users.bulkPut([defaultAdmin, defaultEditor, defaultReader])
  }

  const projectCount = await db.projects.count()
  if (projectCount === 0) {
    await db.projects.put(fakeProject)
  }
}
