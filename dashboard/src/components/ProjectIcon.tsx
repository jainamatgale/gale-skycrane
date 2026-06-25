import { useState } from 'react'
import type { Project } from '../types'

type Props = {
  project: Pick<Project, 'name' | 'iconUrl'>
  size?: 'md' | 'lg'
}

export const ProjectIcon = ({ project, size = 'md' }: Props) => {
  const [failed, setFailed] = useState(false)
  const className = `project-monogram ${size === 'lg' ? 'large' : ''}`

  if (project.iconUrl && !failed) {
    return (
      <span className={`${className} has-image`}>
        <img src={project.iconUrl} alt={`${project.name} icon`} onError={() => setFailed(true)} />
      </span>
    )
  }

  return <span className={className}>{project.name.charAt(0).toUpperCase() || 'S'}</span>
}
