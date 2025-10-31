'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Edit3, Save, CheckCircle, Loader2 } from 'lucide-react'

type Post = {
  id: number
  title: string | null
  author: string | null
  date: string | null
  description: string | null
  content: string | null
}

export default function BlogPost({
  post,
  onChange,
  onSave,
}: {
  post: Post
  onChange: (patch: Partial<Post>) => void
  onSave: () => void
}) {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
  const [textareaHeight, setTextareaHeight] = React.useState<number>(160)
  const [isEditing, setIsEditing] = React.useState(false)
  const [status, setStatus] = React.useState<'idle' | 'unsaved' | 'saving' | 'saved'>('idle')

  React.useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    setTextareaHeight(el.offsetHeight)
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === el) {
          setTextareaHeight(entry.target.getBoundingClientRect().height)
        }
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const labelClass =
    'font-semibold block text-[0.65rem] mb-1 uppercase tracking-wider text-secondary'

  const handleEdit = () => {
    setIsEditing(true)
    setStatus('unsaved')
  }

  const handleSave = async () => {
    setStatus('saving')
    await onSave()
    setTimeout(() => {
      setStatus('saved')
      setIsEditing(false)
      setTimeout(() => setStatus('idle'), 2000)
    }, 500)
  }

  const handleChange = (patch: Partial<Post>) => {
    onChange(patch)
    if (isEditing) setStatus('unsaved')
  }

  return (
    <div className="rounded-md border border-primary/60 p-2 mb-4 bg-background">
      {/* Top inputs */}
      <div className="flex flex-col md:flex-row md:items-end gap-2 mb-2">
        <div className="flex-1 min-w-[200px]">
          <label className={labelClass}>TITLE</label>
          <input
            type="text"
            value={post.title || ''}
            onChange={e => handleChange({ title: e.target.value })}
            placeholder="Title"
            className="w-full border border-ternary/50 rounded px-2 py-1 bg-ternary/10 text-foreground"
            disabled={!isEditing}
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className={labelClass}>AUTHOR</label>
          <input
            type="text"
            value={post.author || ''}
            onChange={e => handleChange({ author: e.target.value })}
            placeholder="Author"
            className="w-full border border-ternary/50 rounded px-2 py-1 bg-ternary/10 text-foreground"
            disabled={!isEditing}
          />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className={labelClass}>DATE</label>
          <input
            type="date"
            value={post.date ? post.date.split('T')[0] : ''}
            onChange={e => handleChange({ date: e.target.value })}
            className="w-full border border-ternary/50 rounded px-2 py-1 bg-ternary/10 text-foreground"
            disabled={!isEditing}
          />
        </div>
      </div>

      {/* Description */}
      <label className={labelClass}>DESCRIPTION</label>
      <input
        type="text"
        value={post.description || ''}
        onChange={e => handleChange({ description: e.target.value })}
        placeholder="Description"
        className="block w-full mb-2 border border-ternary/50 rounded px-2 py-1 bg-ternary/10 text-foreground"
        disabled={!isEditing}
      />

      {/* Editor + Preview */}
      <div className="mb-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Editor */}
          <div className="flex-1 flex flex-col">
            <label className={labelClass}>EDITOR</label>
            <textarea
              ref={textareaRef}
              value={post.content || ''}
              onChange={e => handleChange({ content: e.target.value })}
              placeholder="Write your Markdown here..."
              className={`block w-full min-h-[20rem] max-h-[60vh] border border-ternary/50 rounded px-2 py-1 font-mono text-xs resize-y text-foreground ${isEditing ? 'bg-ternary/10' : 'bg-gray-100 cursor-not-allowed'
                }`}
              disabled={!isEditing}
            />
          </div>

          {/* Preview */}
          <div className="flex-1 flex flex-col">
            <label className={labelClass}>PREVIEW</label>
            <div
              className="w-full border border-ternary/50 rounded px-3 py-2 text-sm bg-ternary/10 overflow-auto"
              style={{ height: textareaHeight }}
            >
              {post.content && post.content.trim() !== '' ? (
                <div
                  className="
                    prose prose-sm max-w-none
                    prose-headings:text-primary
                    prose-a:text-secondary
                    prose-code:bg-ternary/20
                    prose-code:text-foreground
                    prose-pre:bg-ternary/20
                    prose-pre:text-foreground
                    prose-img:rounded
                    prose-img:border
                    prose-img:border-ternary/40
                  "
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {String(post.content ?? '')}
                  </ReactMarkdown>
                </div>
              ) : (
                <span className="text-foreground/40 text-xs italic">
                  (Markdown preview will appear here)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save/Edit button + status */}
      <div className="flex items-center gap-2">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="flex items-center gap-1 bg-primary text-background border border-primary rounded-lg px-2 py-1 text-sm transition-all hover:bg-secondary active:bg-background active:text-primary"
          >
            <Save size={14} /> Save
          </button>
        ) : (
          <button
            onClick={handleEdit}
            className="flex items-center gap-1 bg-secondary text-background border border-secondary rounded-lg px-2 py-1 text-sm transition-all hover:bg-primary active:bg-background active:text-primary"
          >
            <Edit3 size={14} /> Edit
          </button>
        )}

        <div className="flex items-center gap-1 text-xs text-foreground/70">
          {status === 'unsaved' && (
            <>
              <Edit3 size={12} className="text-secondary" /> Unsaved changes
            </>
          )}
          {status === 'saving' && (
            <>
              <Loader2 size={12} className="animate-spin text-secondary" /> Saving...
            </>
          )}
          {status === 'saved' && (
            <>
              <CheckCircle size={12} className="text-green-600" /> Saved!
            </>
          )}
        </div>
      </div>
    </div>
  )
}
