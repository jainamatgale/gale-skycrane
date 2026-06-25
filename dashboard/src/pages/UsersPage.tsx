import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Mail, Shield, Trash2, UserPlus } from 'lucide-react'
import { db } from '../db'
import { useAuth } from '../auth/AuthContext'
import type { User, UserRole } from '../types'

const roleMeta: Record<UserRole, { label: string; className: string; description: string }> = {
  admin: {
    label: 'Admin',
    className: 'role-admin',
    description: 'Full access, including user management.',
  },
  edit: {
    label: 'Edit',
    className: 'role-edit',
    description: 'Can edit project details and environments.',
  },
  read: {
    label: 'Read',
    className: 'role-read',
    description: 'Can launch environments and read details.',
  },
}

const defaultUser = (): User => ({
  id: `user-${crypto.randomUUID()}`,
  fullName: '',
  email: '',
  password: '',
  role: 'read',
})

export const UsersPage = () => {
  const { currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [draftUser, setDraftUser] = useState<User>(defaultUser())

  const loadUsers = async () => {
    setUsers(await db.users.toArray())
  }

  useEffect(() => {
    void loadUsers()
  }, [])

  if (currentUser?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  const addUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!draftUser.fullName || !draftUser.email || !draftUser.password) return
    await db.users.put(draftUser)
    setDraftUser(defaultUser())
    await loadUsers()
  }

  const removeUser = async (id: string) => {
    if (currentUser?.id === id) return
    await db.users.delete(id)
    await loadUsers()
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Access control</p>
          <h1>Team &amp; Users</h1>
          <p className="page-lead">
            Manage who can view, edit, and administer the Skycrane workspace.
          </p>
        </div>
      </header>

      <div className="users-layout">
        <section className="card user-list-card">
          <h2 className="card-title">Members ({users.length})</h2>
          <div className="user-list">
            {users.map((user) => {
              const meta = roleMeta[user.role]
              const initials = user.fullName
                .split(' ')
                .map((part) => part[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()
              return (
                <div key={user.id} className="user-row">
                  <span className="avatar">{initials}</span>
                  <div className="user-row-meta">
                    <strong>{user.fullName}</strong>
                    <span className="user-email">
                      <Mail size={12} />
                      {user.email}
                    </span>
                  </div>
                  <span className={`role-tag ${meta.className}`}>{meta.label}</span>
                  <button
                    type="button"
                    className="icon-btn danger"
                    disabled={currentUser?.id === user.id}
                    onClick={() => removeUser(user.id)}
                    aria-label="Remove user"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        <section className="card">
          <div className="access-head">
            <span className="access-icon eng">
              <UserPlus size={18} />
            </span>
            <h2 className="card-title">Add new user</h2>
          </div>
          <form className="add-user-form" onSubmit={addUser}>
            <label className="field">
              Full name
              <input
                required
                value={draftUser.fullName}
                onChange={(event) => setDraftUser({ ...draftUser, fullName: event.target.value })}
              />
            </label>
            <label className="field">
              Work email
              <input
                required
                type="email"
                value={draftUser.email}
                onChange={(event) => setDraftUser({ ...draftUser, email: event.target.value })}
              />
            </label>
            <label className="field">
              Temporary password
              <input
                required
                value={draftUser.password}
                onChange={(event) => setDraftUser({ ...draftUser, password: event.target.value })}
              />
            </label>
            <label className="field">
              Role
              <select
                value={draftUser.role}
                onChange={(event) =>
                  setDraftUser({ ...draftUser, role: event.target.value as UserRole })
                }
              >
                <option value="admin">Admin</option>
                <option value="edit">Edit</option>
                <option value="read">Read</option>
              </select>
            </label>
            <p className="role-hint">
              <Shield size={13} />
              {roleMeta[draftUser.role].description}
            </p>
            <button type="submit" className="btn btn-primary full">
              <UserPlus size={16} />
              Create user
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
