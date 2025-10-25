'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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

  return (
    <div className="rounded-md border border-primary/60 p-2 mb-4 bg-background">
      {/* Top inputs */}
      <div className="flex flex-col md:flex-row md:items-end gap-2 mb-2">
        <div className="flex-1 min-w-[200px]">
          <label className={labelClass}>TITLE</label>
          <input
            type="text"
            value={post.title || ''}
            onChange={e => onChange({ title: e.target.value })}
            placeholder="Title"
            className="w-full border border-ternary/50 rounded px-2 py-1 bg-ternary/10 text-foreground"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className={labelClass}>AUTHOR</label>
          <input
            type="text"
            value={post.author || ''}
            onChange={e => onChange({ author: e.target.value })}
            placeholder="Author"
            className="w-full border border-ternary/50 rounded px-2 py-1 bg-ternary/10 text-foreground"
          />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className={labelClass}>DATE</label>
          <input
            type="date"
            value={post.date ? post.date.split('T')[0] : ''}
            onChange={e => onChange({ date: e.target.value })}
            className="w-full border border-ternary/50 rounded px-2 py-1 bg-ternary/10 text-foreground"
          />
        </div>
      </div>

      {/* Description */}
      <label className={labelClass}>DESCRIPTION</label>
      <input
        type="text"
        value={post.description || ''}
        onChange={e => onChange({ description: e.target.value })}
        placeholder="Description"
        className="block w-full mb-2 border border-ternary/50 rounded px-2 py-1 bg-ternary/10 text-foreground"
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
              onChange={e => onChange({ content: e.target.value })}
              placeholder="Write your Markdown here..."
              className="block w-full min-h-[20rem] max-h-[60vh] border border-ternary/50 rounded px-2 py-1 font-mono text-xs resize-y bg-ternary/10 text-foreground"
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

      {/* Save button + status */}
      <div>
        <button
          onClick={onSave}
          className="bg-primary text-background border border-primary rounded-lg px-2 py-1 transition-all hover:bg-secondary active:bg-background active:text-primary"
        >
          Save
        </button>

        <div className="text-xs text-foreground/60 mt-1">
          [ status here — up to date / saving... / unsaved changes! ]
        </div>
      </div>
    </div>
  )
}
