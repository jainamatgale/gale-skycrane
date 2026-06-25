import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, ExternalLink, Layers, Plus, X } from 'lucide-react'
import { db } from '../db'
import { useAuth } from '../auth/AuthContext'
import { getToolColor, getToolIcon } from '../lib/icons'
import { ProjectIcon } from '../components/ProjectIcon'
import type { Environment, Project } from '../types'

const tierDotClass: Record<Environment['tier'], string> = {
  PROD: 'tier-prod',
  QA: 'tier-qa',
  DEV: 'tier-dev',
  CUSTOM: 'tier-custom',
}

const getDefaultNewProject = (): Project => ({
  id: `project-${crypto.randomUUID()}`,
  name: '',
  client: '',
  iconUrl: '',
  summary: '',
  purpose: '',
  stack: ['React'],
  analytics: ['GA4'],
  implementationStatus: '',
  teamAccess: { codebaseAccess: '', repoLinks: '', changeProcess: '' },
  designAccess: { tools: '', notes: '' },
  analyticsAccess: { platforms: ['GA4'], notes: '', accessProcess: '' },
  environments: [],
})

export const DashboardPage = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [newProject, setNewProject] = useState<Project>(getDefaultNewProject())
  const [showCreate, setShowCreate] = useState(false)

  const canEdit = currentUser?.role === 'admin' || currentUser?.role === 'edit'

  const loadProjects = async () => {
    setProjects(await db.projects.toArray())
  }

  useEffect(() => {
    void loadProjects()
  }, [])

  const createProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!newProject.name.trim()) return
    await db.projects.put(newProject)
    const created = newProject
    setShowCreate(false)
    setNewProject(getDefaultNewProject())
    await loadProjects()
    navigate(`/projects/${created.id}`)
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">The playground for curiosity</p>
          <h1>Sandbox Projects</h1>
          <p className="page-lead">
            Discover, launch, and govern GALE sandbox platforms across engineering, design, and
            analytics teams.
          </p>
        </div>
        {canEdit ? (
          <button type="button" className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={16} />
            New project
          </button>
        ) : null}
      </header>

      <div className="project-grid">
        {projects.map((project) => {
          const tools = [...project.stack, ...project.analytics]
          return (
            <article
              key={project.id}
              className="project-card"
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/projects/${project.id}`)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') navigate(`/projects/${project.id}`)
              }}
            >
              <div className="project-card-top">
                <ProjectIcon project={project} />
                <span className="env-count">{project.environments.length} envs</span>
              </div>
              <h3>{project.name}</h3>
              <p className="project-client">{project.client || 'Unassigned client'}</p>
              <p className="project-summary">{project.summary || 'No summary added yet.'}</p>

              <div className="tool-chips">
                {tools.slice(0, 6).map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="tool-chip"
                    title={item}
                    style={{ color: getToolColor(item) }}
                  >
                    {getToolIcon(item)}
                  </span>
                ))}
                {tools.length > 6 ? <span className="tool-chip more">+{tools.length - 6}</span> : null}
              </div>

              <div className="project-card-launch">
                <span className="launch-mini-label">Quick launch</span>
                {project.environments.length > 0 ? (
                  <div className="launch-mini-chips">
                    {project.environments.map((environment) => (
                      <a
                        key={environment.id}
                        className="launch-mini-chip"
                        href={environment.launchUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        title={`Launch ${environment.name}`}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <span className={`tier-dot ${tierDotClass[environment.tier]}`} />
                        {environment.name}
                        <ExternalLink size={12} />
                      </a>
                    ))}
                  </div>
                ) : (
                  <span className="muted-note">No environments yet</span>
                )}
              </div>

              <span className="project-open card-foot">
                View details
                <ArrowUpRight size={15} />
              </span>
            </article>
          )
        })}

        {projects.length === 0 ? (
          <div className="empty-state glass">
            <Layers size={26} />
            <h3>No sandboxes yet</h3>
            <p>Create your first sandbox project to start building the library.</p>
          </div>
        ) : null}
      </div>

      {showCreate ? (
        <div className="modal-scrim" onClick={() => setShowCreate(false)}>
          <form className="modal glass" onClick={(event) => event.stopPropagation()} onSubmit={createProject}>
            <div className="modal-head">
              <h2>Create new sandbox</h2>
              <button type="button" className="icon-btn" onClick={() => setShowCreate(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="field-grid two">
              <label className="field">
                Project name
                <input
                  required
                  autoFocus
                  value={newProject.name}
                  onChange={(event) => setNewProject({ ...newProject, name: event.target.value })}
                  placeholder="e.g. Skycrane Commerce Experience"
                />
              </label>
              <label className="field">
                Client
                <input
                  value={newProject.client}
                  onChange={(event) => setNewProject({ ...newProject, client: event.target.value })}
                  placeholder="e.g. Starbucks"
                />
              </label>
            </div>
            <label className="field">
              Summary
              <textarea
                rows={3}
                value={newProject.summary}
                onChange={(event) => setNewProject({ ...newProject, summary: event.target.value })}
                placeholder="Short description shown on the project card."
              />
            </label>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setShowCreate(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create project
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}
