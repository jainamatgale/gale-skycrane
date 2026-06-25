import type { Environment, Project } from '../types'

const tierPriority: Record<Environment['tier'], number> = {
  PROD: 0,
  QA: 1,
  DEV: 2,
  CUSTOM: 3,
}

export const getPrimaryEnvironment = (project: Project): Environment | undefined => {
  if (project.environments.length === 0) return undefined
  return [...project.environments].sort(
    (a, b) => tierPriority[a.tier] - tierPriority[b.tier],
  )[0]
}
