import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Code2, KeyRound, Palette, Plus, Save, Trash2 } from 'lucide-react'
import { db } from '../db'
import { useAuth } from '../auth/AuthContext'
import type { Environment, Project } from '../types'

type TabKey = 'overview' | 'access' | 'environments'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'access', label: 'Team Access' },
  { key: 'environments', label: 'Environments' },
]

const tierClass: Record<Environment['tier'], string> = {
  PROD: 'tier-prod',
  QA: 'tier-qa',
  DEV: 'tier-dev',
  CUSTOM: 'tier-custom',
}

const splitList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const defaultEnvironment = (): Environment => ({
  id: `env-${crypto.randomUUID()}`,
  name: '',
  tier: 'CUSTOM',
  description: '',
  launchUrl: '',
  credentials: '',
})

export const ProjectSettingsPage = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [draftEnvironment, setDraftEnvironment] = useState<Environment>(defaultEnvironment())
  const [showEnvForm, setShowEnvForm] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const canEdit = currentUser?.role === 'admin' || currentUser?.role === 'edit'

  const stackText = useMemo(() => project?.stack.join(', ') ?? '', [project])
  const analyticsText = useMemo(() => project?.analytics.join(', ') ?? '', [project])
  const platformsText = useMemo(
    () => project?.analyticsAccess.platforms.join(', ') ?? '',
    [project],
  )

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

  const update = (next: Project) => setProject(next)

  const save = async () => {
    if (!project) return
    await db.projects.put(project)
    setStatusMessage('Changes saved')
    setTimeout(() => setStatusMessage(''), 2200)
  }

  const addEnvironment = () => {
    if (!project || !draftEnvironment.name.trim()) return
    update({ ...project, environments: [...project.environments, draftEnvironment] })
    setDraftEnvironment(defaultEnvironment())
    setShowEnvForm(false)
  }

  const removeEnvironment = (id: string) => {
    if (!project) return
    update({ ...project, environments: project.environments.filter((env) => env.id !== id) })
  }

  if (!canEdit) {
    return <Navigate to={`/projects/${params.projectId ?? ''}`} replace />
  }

  if (!project) {
    return <div className="loading-screen">Loading project…</div>
  }

  return (
    <div className="page">
      <Link to={`/projects/${project.id}`} className="back-link">
        <ArrowLeft size={16} />
        Back to project
      </Link>

      <header className="page-header project-detail-header">
        <div>
          <p className="eyebrow">Project Settings</p>
          <h1>{project.name}</h1>
          <p className="page-lead">Edit the details shown on the project page.</p>
        </div>
        <div className="header-actions">
          {statusMessage ? <span className="save-pill">{statusMessage}</span> : null}
          <button type="button" className="btn btn-primary" onClick={save}>
            <Save size={16} />
            Save changes
          </button>
        </div>
      </header>

      <div className="tab-bar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' ? (
        <div className="tab-panel">
          <section className="card glass">
            <h2 className="card-title">Project information</h2>
            <div className="field-grid two">
              <label className="field">
                Project name
                <input
                  value={project.name}
                  onChange={(event) => update({ ...project, name: event.target.value })}
                />
              </label>
              <label className="field">
                Client
                <input
                  value={project.client}
                  onChange={(event) => update({ ...project, client: event.target.value })}
                />
              </label>
            </div>
            <label className="field">
              Project icon URL
              <input
                value={project.iconUrl ?? ''}
                placeholder="https://… (optional custom logo)"
                onChange={(event) => update({ ...project, iconUrl: event.target.value })}
              />
              <span className="field-hint">Leave blank to use the lettered monogram.</span>
            </label>
            <label className="field">
              Summary
              <textarea
                rows={2}
                value={project.summary}
                onChange={(event) => update({ ...project, summary: event.target.value })}
              />
            </label>
            <label className="field">
              Purpose
              <textarea
                rows={3}
                value={project.purpose}
                onChange={(event) => update({ ...project, purpose: event.target.value })}
              />
            </label>
            <label className="field">
              Implementation status
              <textarea
                rows={2}
                value={project.implementationStatus}
                onChange={(event) => update({ ...project, implementationStatus: event.target.value })}
              />
            </label>
          </section>

          <section className="card glass">
            <h2 className="card-title">Tech stack &amp; analytics</h2>
            <div className="field-grid two">
              <label className="field">
                Tech stack (comma separated)
                <input
                  value={stackText}
                  onChange={(event) => update({ ...project, stack: splitList(event.target.value) })}
                />
              </label>
              <label className="field">
                Analytics implemented (comma separated)
                <input
                  value={analyticsText}
                  onChange={(event) =>
                    update({ ...project, analytics: splitList(event.target.value) })
                  }
                />
              </label>
            </div>
          </section>
        </div>
      ) : null}

      {activeTab === 'access' ? (
        <div className="tab-panel access-grid">
          <section className="card glass access-card">
            <div className="access-head">
              <span className="access-icon eng">
                <Code2 size={18} />
              </span>
              <h2 className="card-title">Engineering</h2>
            </div>
            <label className="field">
              Codebase access
              <textarea
                rows={2}
                value={project.teamAccess.codebaseAccess}
                onChange={(event) =>
                  update({
                    ...project,
                    teamAccess: { ...project.teamAccess, codebaseAccess: event.target.value },
                  })
                }
              />
            </label>
            <label className="field">
              Repository links
              <input
                value={project.teamAccess.repoLinks}
                onChange={(event) =>
                  update({
                    ...project,
                    teamAccess: { ...project.teamAccess, repoLinks: event.target.value },
                  })
                }
              />
            </label>
            <label className="field">
              Pull request process
              <textarea
                rows={3}
                value={project.teamAccess.changeProcess}
                onChange={(event) =>
                  update({
                    ...project,
                    teamAccess: { ...project.teamAccess, changeProcess: event.target.value },
                  })
                }
              />
            </label>
          </section>

          <section className="card glass access-card">
            <div className="access-head">
              <span className="access-icon design">
                <Palette size={18} />
              </span>
              <h2 className="card-title">Design</h2>
            </div>
            <label className="field">
              Tools used
              <input
                value={project.designAccess.tools}
                onChange={(event) =>
                  update({
                    ...project,
                    designAccess: { ...project.designAccess, tools: event.target.value },
                  })
                }
              />
            </label>
            <label className="field">
              Notes
              <textarea
                rows={6}
                value={project.designAccess.notes}
                onChange={(event) =>
                  update({
                    ...project,
                    designAccess: { ...project.designAccess, notes: event.target.value },
                  })
                }
              />
            </label>
          </section>

          <section className="card glass access-card">
            <div className="access-head">
              <span className="access-icon analytics">
                <KeyRound size={18} />
              </span>
              <h2 className="card-title">Analytics &amp; Media</h2>
            </div>
            <label className="field">
              Platforms (comma separated)
              <input
                value={platformsText}
                onChange={(event) =>
                  update({
                    ...project,
                    analyticsAccess: {
                      ...project.analyticsAccess,
                      platforms: splitList(event.target.value),
                    },
                  })
                }
              />
            </label>
            <label className="field">
              Implementation notes
              <textarea
                rows={2}
                value={project.analyticsAccess.notes}
                onChange={(event) =>
                  update({
                    ...project,
                    analyticsAccess: { ...project.analyticsAccess, notes: event.target.value },
                  })
                }
              />
            </label>
            <label className="field">
              How to request access
              <textarea
                rows={2}
                value={project.analyticsAccess.accessProcess}
                onChange={(event) =>
                  update({
                    ...project,
                    analyticsAccess: {
                      ...project.analyticsAccess,
                      accessProcess: event.target.value,
                    },
                  })
                }
              />
            </label>
          </section>
        </div>
      ) : null}

      {activeTab === 'environments' ? (
        <div className="tab-panel">
          <div className="env-grid">
            {project.environments.map((environment) => (
              <article key={environment.id} className="env-card glass">
                <div className="env-card-head">
                  <span className={`tier-badge ${tierClass[environment.tier]}`}>
                    {environment.tier}
                  </span>
                  <button
                    type="button"
                    className="icon-btn danger"
                    onClick={() => removeEnvironment(environment.id)}
                    aria-label="Remove environment"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <h3>{environment.name}</h3>
                <p>{environment.description}</p>
                <div className="env-cred">
                  <KeyRound size={13} />
                  <span>{environment.credentials || 'No credentials provided'}</span>
                </div>
              </article>
            ))}

            <button
              type="button"
              className="env-add-tile"
              onClick={() => setShowEnvForm((value) => !value)}
            >
              <Plus size={20} />
              Add environment
            </button>
          </div>

          {showEnvForm ? (
            <section className="card glass">
              <h2 className="card-title">New environment</h2>
              <div className="field-grid two">
                <label className="field">
                  Name
                  <input
                    value={draftEnvironment.name}
                    placeholder="e.g. QA2"
                    onChange={(event) =>
                      setDraftEnvironment({ ...draftEnvironment, name: event.target.value })
                    }
                  />
                </label>
                <label className="field">
                  Tier
                  <select
                    value={draftEnvironment.tier}
                    onChange={(event) =>
                      setDraftEnvironment({
                        ...draftEnvironment,
                        tier: event.target.value as Environment['tier'],
                      })
                    }
                  >
                    <option value="PROD">PROD</option>
                    <option value="QA">QA</option>
                    <option value="DEV">DEV</option>
                    <option value="CUSTOM">CUSTOM</option>
                  </select>
                </label>
              </div>
              <label className="field">
                Description
                <input
                  value={draftEnvironment.description}
                  onChange={(event) =>
                    setDraftEnvironment({ ...draftEnvironment, description: event.target.value })
                  }
                />
              </label>
              <div className="field-grid two">
                <label className="field">
                  Launch URL
                  <input
                    value={draftEnvironment.launchUrl}
                    placeholder="https://"
                    onChange={(event) =>
                      setDraftEnvironment({ ...draftEnvironment, launchUrl: event.target.value })
                    }
                  />
                </label>
                <label className="field">
                  Credentials / access note
                  <input
                    value={draftEnvironment.credentials}
                    onChange={(event) =>
                      setDraftEnvironment({ ...draftEnvironment, credentials: event.target.value })
                    }
                  />
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowEnvForm(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={addEnvironment}>
                  Add environment
                </button>
              </div>
            </section>
          ) : null}

          <p className="muted-note">Remember to save changes after editing environments.</p>
        </div>
      ) : null}
    </div>
  )
}
