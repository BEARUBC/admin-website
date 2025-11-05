'use client'

import React, { useEffect, useState, useCallback, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Edit3, Save, CheckCircle, Loader2, ArrowUpDown, ExternalLink, X } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Member = {
  id: number
  first_name: string | null
  last_name: string | null
  team: string | null
  role: string | null
  bio: string | null
  link: string | null
}

export default function EditMembersPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading members...</div>}>
      <EditMembersContent />
    </Suspense>
  )
}

function EditMembersContent() {
  const supabase = createClient()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [status, setStatus] = useState<'idle' | 'unsaved' | 'saving' | 'saved' | 'error'>('idle')
  const [sortKey, setSortKey] = useState<'first_name' | 'last_name' | 'team'>('first_name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [search, setSearch] = useState('')

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('members').select('*')
    if (error) console.error('Error loading members:', error)
    else setMembers(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const handleChange = (id: number, patch: Partial<Member>) => {
    setMembers(prev => prev.map(m => (m.id === id ? { ...m, ...patch } : m)))
    if (isEditing) setStatus('unsaved')
  }

  const handleSave = async () => {
    setStatus('saving')
    const updates = members.map(({ id, ...fields }) => ({ id, ...fields }))
    const { error } = await supabase.from('members').upsert(updates)
    if (error) {
      console.error('Error saving members:', error)
      setStatus('error')
      return
    }
    setStatus('saved')
    setIsEditing(false)
    setTimeout(() => setStatus('idle'), 1500)
  }

  const handleEdit = () => {
    setIsEditing(true)
    setStatus('unsaved')
  }

  const handleHeaderClick = (key: 'first_name' | 'last_name' | 'team') => {
    if (key === sortKey) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sortedMembers = React.useMemo(() => {
    const safeMembers = Array.isArray(members) ? members : []
    const val = (m: Member, k: keyof Member) => (m[k] ?? '').toString().toLowerCase()
    const list = [...safeMembers]
    list.sort((a, b) => {
      const av = val(a, sortKey)
      const bv = val(b, sortKey)
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    // 🔍 Apply search filter
    if (!search.trim()) return list
    const q = search.toLowerCase()
    return list.filter(m =>
      val(m, 'first_name').includes(q) ||
      val(m, 'last_name').includes(q) ||
      val(m, 'team').includes(q) ||
      val(m, 'role').includes(q)
    )
  }, [members, sortKey, sortDir, search])

  const labelClass = 'text-xs font-semibold tracking-wider uppercase'
  const inputBase = 'w-full rounded border border-ternary/50 bg-white px-2 py-1 text-sm text-foreground focus:ring-2 focus:ring-secondary/60 h-[2rem]'

  const headerButton = (label: string, key: 'first_name' | 'last_name' | 'team') => (
    <button
      type="button"
      onClick={() => handleHeaderClick(key)}
      className={`group inline-flex items-center gap-1 text-xs font-semibold tracking-wider uppercase align-middle ${sortKey === key ? 'text-secondary' : 'text-foreground/70 hover:text-secondary'}`}
    >
      {label}
      <ArrowUpDown size={14} className={`transition-opacity ${sortKey === key ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`} />
    </button>
  )

  if (loading)
    return <div className="p-4 text-center text-foreground">Loading members...</div>

  return (
    <div className="w-full p-4 bg-white min-h-screen">
      {/* Header bar with search */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-primary">Edit Members</h1>

        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="
              w-64 rounded-md border border-ternary/40 bg-white
              px-3 py-1.5 text-sm text-foreground placeholder:text-foreground/40
              appearance-none outline-none
              focus:border-secondary/70 focus:ring-2 focus:ring-secondary/30
              transition-all
              [color-scheme:light]
            "
          />

          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 text-gray-500 hover:text-secondary transition-colors"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

      </div>

      <div className="w-full">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white shadow-sm grid grid-cols-6 md:grid-cols-[1fr,1fr,1fr,1.25fr,3fr,1.25fr] gap-2 px-2 py-2 text-foreground/70 border-b border-ternary/30 items-center">
          <div>{headerButton('First name', 'first_name')}</div>
          <div>{headerButton('Last name', 'last_name')}</div>
          <div>{headerButton('Team', 'team')}</div>
          <div className={labelClass}>Role</div>
          <div className={labelClass}>Bio</div>
          <div className={labelClass}>Link</div>
        </div>

        {/* Table rows */}
        {sortedMembers.map((m, i) => (
          <div
            key={m.id}
            className={`grid grid-cols-6 md:grid-cols-[1fr,1fr,1fr,1.25fr,3fr,1.25fr]
              gap-2 items-center px-2 py-2
              ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              hover:bg-gray-100 rounded-md transition-colors`}
          >
            <div>
              {isEditing ? (
                <input className={inputBase} value={m.first_name ?? ''} onChange={e => handleChange(m.id, { first_name: e.target.value })} />
              ) : (
                <div className="font-medium">{m.first_name || '—'}</div>
              )}
            </div>
            <div>
              {isEditing ? (
                <input className={inputBase} value={m.last_name ?? ''} onChange={e => handleChange(m.id, { last_name: e.target.value })} />
              ) : (
                <div>{m.last_name || '—'}</div>
              )}
            </div>
            <div>
              {isEditing ? (
                <input className={inputBase} value={m.team ?? ''} onChange={e => handleChange(m.id, { team: e.target.value })} />
              ) : (
                <div>{m.team || '—'}</div>
              )}
            </div>
            <div>
              {isEditing ? (
                <input className={inputBase} value={m.role ?? ''} onChange={e => handleChange(m.id, { role: e.target.value })} />
              ) : (
                <div className="truncate max-w-[24ch] sm:max-w-[32ch]" title={m.role ?? ''}>{m.role || '—'}</div>
              )}
            </div>
            <div>
              {isEditing ? (
                <input className={inputBase} value={m.bio ?? ''} onChange={e => handleChange(m.id, { bio: e.target.value })} />
              ) : (
                <div className="truncate max-w-[28ch] sm:max-w-[40ch]" title={m.bio ?? ''}>{m.bio || '—'}</div>
              )}
            </div>
            <div>
              {isEditing ? (
                <input className={inputBase} type="url" value={m.link ?? ''} onChange={e => handleChange(m.id, { link: e.target.value })} />
              ) : m.link ? (
                <a href={m.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-secondary underline-offset-2 hover:underline">
                  Open <ExternalLink size={14} />
                </a>
              ) : (
                <span className="text-foreground/50">—</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-foreground/60">Click column headers to sort. Default: First name ↑</div>
      <div className="mt-2 flex items-center gap-2">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="flex items-center gap-1 bg-primary text-white border border-primary rounded-lg px-3 py-1 text-sm hover:bg-secondary active:bg-background active:text-primary"
          >
            <Save size={14} /> Save
          </button>
        ) : (
          <button
            onClick={handleEdit}
            className="flex items-center gap-1 bg-secondary text-white border border-secondary rounded-lg px-3 py-1 text-sm hover:bg-primary active:bg-background active:text-primary"
          >
            <Edit3 size={14} /> Edit
          </button>
        )}

        <div className="flex items-center gap-1 text-xs text-foreground/70">
          {status === 'unsaved' && (<><Edit3 size={12} className="text-secondary" /> Unsaved</>)}
          {status === 'saving' && (<><Loader2 size={12} className="animate-spin text-secondary" /> Saving...</>)}
          {status === 'saved' && (<><CheckCircle size={12} className="text-green-600" /> Saved!</>)}
          {status === 'error' && (<><span className="text-red-600 text-xs">Save failed.</span></>)}
        </div>
      </div>
    </div>
  )
}
