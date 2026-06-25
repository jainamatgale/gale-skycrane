import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Code2,
  ExternalLink,
  KeyRound,
  Palette,
  Play,
  Settings,
} from 'lucide-react'
import { db } from '../db'
import { useAuth } from '../auth/AuthContext'
import { getToolColor, getToolIcon } from '../lib/icons'
import { getPrimaryEnvironment } from '../lib/project'
import { ProjectIcon } from '../components/ProjectIcon'
import type { Environment, Project } from '../types'

const tierClass: Record<Environment['tier'], string> = {
  PROD: 'tier-prod',
  QA: 'tier-qa',
  DEV: 'tier-dev',
  CUSTOM: 'tier-custom',
}

export const ProjectPage = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [project, setProject] = useState<Project | null>(null)

  const canEdit = currentUser?.role === 'admin' || currentUser?.role === 'edit'

  useEffect(() => {
    const load = async () => {
      const found = await db.projects.get(params.projectId ?? '')
      if (!found) {
        navigate('/dashboard')
        return
      }
      setProject(found)
    }
    void load()
  }, [params.projectId, navigate])

  if (!project) {
    return <div className="loading-screen">Loading project…</div>
  }

  const tools = [...project.stack, ...project.analytics]
  const primaryEnv = getPrimaryEnvironment(project)

  return (
    <div className="page pdp">
      <Link to="/dashboard" className="back-link">
        <ArrowLeft size={16} />
        All projects
      </Link>

      <header className="pdp-hero glass">
        <div className="pdp-hero-main">
          <ProjectIcon project={project} size="lg" />
          <div>
            <p className="project-client">{project.client || 'Unassigned client'}</p>
            <h1>{project.name}</h1>
            {project.summary ? <p className="pdp-summary">{project.summary}</p> : null}
          </div>
        </div>

        <div className="pdp-hero-actions">
          {primaryEnv ? (
            <a
              className="btn btn-primary"
              href={primaryEnv.launchUrl || '#'}
              target="_blank"
              rel="noreferrer"
            >
              <Play size={15} />
              Launch {primaryEnv.name}
            </a>
          ) : null}
          {canEdit ? (
            <Link to={`/projects/${project.id}/settings`} className="btn btn-ghost">
              <Settings size={15} />
              Project Settings
            </Link>
          ) : (
            <span className="role-note">Read-only access</span>
          )}
        </div>
      </header>

      {project.environments.length > 0 ? (
        <section className="pdp-launch-row">
          <span className="launch-row-label">Quick launch</span>
          <div className="launch-row-buttons">
            {project.environments.map((environment) => (
              <a
                key={environment.id}
                className="launch-chip"
                href={environment.launchUrl || '#'}
                target="_blank"
                rel="noreferrer"
              >
                <span className={`tier-dot ${tierClass[environment.tier]}`} />
                {environment.name}
                <ExternalLink size={13} />
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <div className="pdp-body">
        <div className="pdp-main">
          {project.purpose ? (
            <section className="card glass pdp-prose">
              <h2 className="card-title">About this sandbox</h2>
              <p>{project.purpose}</p>
            </section>
          ) : null}

          {project.implementationStatus ? (
            <section className="card glass pdp-prose">
              <h2 className="card-title">What's implemented</h2>
              <p>{project.implementationStatus}</p>
            </section>
          ) : null}

          <section className="card glass">
            <h2 className="card-title">Tech stack &amp; analytics</h2>
            <div className="tool-showcase">
              {tools.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="tool-pill"
                  style={{ color: getToolColor(item) }}
                >
                  {getToolIcon(item)}
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </section>

          <section className="card glass">
            <h2 className="card-title">Environments</h2>
            <div className="env-grid">
              {project.environments.map((environment) => (
                <article key={environment.id} className="env-card">
                  <div className="env-card-head">
                    <span className={`tier-badge ${tierClass[environment.tier]}`}>
                      {environment.tier}
                    </span>
                  </div>
                  <h3>{environment.name}</h3>
                  <p>{environment.description}</p>
                  <div className="env-cred">
                    <KeyRound size={13} />
                    <span>{environment.credentials || 'No credentials provided'}</span>
                  </div>
                  <a
                    className="btn btn-soft full"
                    href={environment.launchUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Launch environment
                    <ExternalLink size={14} />
                  </a>
                </article>
              ))}
              {project.environments.length === 0 ? (
                <p className="muted-note">No environments added yet.</p>
              ) : null}
            </div>
          </section>
        </div>

        <aside className="pdp-side">
          <section className="card glass access-block">
            <div className="access-head">
              <span className="access-icon eng">
                <Code2 size={16} />
              </span>
              <h3>Engineering</h3>
            </div>
            <Field label="Codebase access" value={project.teamAccess.codebaseAccess} />
            <Field label="Repository" value={project.teamAccess.repoLinks} isLink />
            <Field label="PR process" value={project.teamAccess.changeProcess} />
          </section>

          <section className="card glass access-block">
            <div className="access-head">
              <span className="access-icon design">
                <Palette size={16} />
              </span>
              <h3>Design</h3>
            </div>
            <Field label="Tools" value={project.designAccess.tools} />
            <Field label="Notes" value={project.designAccess.notes} />
          </section>

          <section className="card glass access-block">
            <div className="access-head">
              <span className="access-icon analytics">
                <KeyRound size={16} />
              </span>
              <h3>Analytics &amp; Media</h3>
            </div>
            <Field label="Platforms" value={project.analyticsAccess.platforms.join(', ')} />
            <Field label="Notes" value={project.analyticsAccess.notes} />
            <Field label="Request access" value={project.analyticsAccess.accessProcess} />
          </section>
        </aside>
      </div>
    </div>
  )
}

const Field = ({ label, value, isLink }: { label: string; value: string; isLink?: boolean }) => (
  <div className="read-field">
    <span className="read-label">{label}</span>
    {value ? (
      isLink ? (
        <a href={value} target="_blank" rel="noreferrer" className="read-value link">
          {value}
        </a>
      ) : (
        <span className="read-value">{value}</span>
      )
    ) : (
      <span className="read-value muted">Not provided</span>
    )}
  </div>
)
