'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import MarkdownGuide from '@/app/components/MarkdownGuide'

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

export default function EditBlogPage() {
  const supabase = createClient()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('blog')
      .select('*')
      .order('id', { ascending: false })
    if (error) console.error(error)
    setPosts(data || [])
    setLoading(false)
  }

  async function updatePost(post: Post) {
    const { error } = await supabase
      .from('blog')
      .update({
        title: post.title,
        author: post.author,
        date: post.date,
        description: post.description,
        content: post.content,
      })
      .eq('id', post.id)
    if (error) console.error(error)
  }

  // helper to update local state for any field in a post
  function editLocalPost(id: number, patch: Partial<Post>) {
    setPosts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...patch } : p)),
    )
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <MarkdownGuide />

      <h1 style={{ marginBottom: '0.5rem', marginTop: '1rem' }}>
        Edit Blog Posts
      </h1>

      <div className="h-1 bg-[#152248] w-full rounded-full my-2"></div>

      {loading && <p>Loading...</p>}

      {posts.map(post => (
        <PostEditorRow
          key={post.id}
          post={post}
          onChange={patch => editLocalPost(post.id, patch)}
          onSave={() => updatePost(post)}
        />
      ))}
    </div>
  )
}

function PostEditorRow({
  post,
  onChange,
  onSave,
}: {
  post: {
    id: number
    title: string | null
    author: string | null
    date: string | null
    description: string | null
    content: string | null
  }
  onChange: (patch: Partial<Post>) => void
  onSave: () => void
}) {
  // ref + height for THIS row only
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
  const [textareaHeight, setTextareaHeight] = React.useState<number>(160)

  React.useEffect(() => {
    const el = textareaRef.current
    if (!el) return

    // set initial height
    setTextareaHeight(el.offsetHeight)

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === el) {
          setTextareaHeight(entry.target.getBoundingClientRect().height)
        }
      }
    })


    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div
      style={{
        borderRadius: '4px',
        border: '1px solid #ddd',
        padding: '0.5rem',
        marginBottom: '1rem',
      }}
    >
      {/* == top inputs == */}
      <div className="flex flex-col md:flex-row md:items-end gap-2 mb-2">
        {/* Title */}
        <div className="flex-1 min-w-[200px]">
          <label className="font-semibold block text-xs text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={post.title || ''}
            onChange={e => onChange({ title: e.target.value })}
            placeholder="Title"
            className="w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>

        {/* Author */}
        <div className="flex-1 min-w-[200px]">
          <label className="font-semibold block text-xs text-gray-700 mb-1">
            Author
          </label>
          <input
            type="text"
            value={post.author || ''}
            onChange={e => onChange({ author: e.target.value })}
            placeholder="Author"
            className="w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>

        {/* Date */}
        <div className="flex-1 min-w-[150px]">
          <label className="font-semibold block text-xs text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={post.date ? post.date.split('T')[0] : ''}
            onChange={e => onChange({ date: e.target.value })}
            className="w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>
      </div>

      {/* Description */}
      <label className="font-semibold block text-xs text-gray-700 mb-1">
        Description
      </label>
      <input
        type="text"
        value={post.description || ''}
        onChange={e => onChange({ description: e.target.value })}
        placeholder="Description"
        style={{
          display: 'block',
          width: '100%',
          marginBottom: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '0.25rem 0.5rem 0.25rem 0.25rem',
        }}
      />

      {/* === Content + Preview === */}
      <div className="mb-3">
        <label className="text-xs text-gray-600 block mb-1">Content</label>

        <div className="h-[2px] bg-[#152248] w-full rounded-full mb-3"></div>

        <div className="flex flex-col md:flex-row gap-3">
          {/* Left: Editor */}
          <div className="flex-1 flex flex-col">
            <div className="text-[0.65rem] text-gray-500 mb-1 font-medium uppercase tracking-wide">
              Editor
            </div>
            <textarea
              ref={textareaRef}
              value={post.content || ''}
              onChange={e => onChange({ content: e.target.value })}
              placeholder="Write your Markdown here..."
              className="block w-full min-h-[10rem] max-h-[60vh] border border-gray-300 rounded px-2 py-1 font-mono text-xs resize-y"
            />
          </div>

          {/* Right: Preview */}
          <div className="flex-1 flex flex-col">
            <div className="text-[0.65rem] text-gray-500 mb-1 font-medium uppercase tracking-wide">
              Preview
            </div>

            <div
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50 overflow-auto"
              style={{
                height: textareaHeight,
              }}
            >
              {post.content && post.content.trim() !== '' ? (
                <div
                  className="
                    prose prose-sm max-w-none
                    prose-headings:text-[#152248]
                    prose-a:text-[#152248]

                    prose-code:bg-gray-200
                    prose-code:text-black
                    prose-code:px-[3px]
                    prose-code:py-[1px]
                    prose-code:rounded

                    prose-pre:bg-gray-200
                    prose-pre:text-black
                    prose-pre:rounded
                    prose-pre:p-2
                    prose-pre:text-[0.75rem]
                    prose-pre:overflow-x-auto

                    prose-img:rounded
                    prose-img:border
                    prose-img:border-gray-300
                  "
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    children={String(post.content ?? '')}
                  />
                </div>
              ) : (
                <span className="text-gray-400 text-xs italic">
                  (Markdown preview will appear here)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={onSave}
        style={{
          backgroundColor: '#152248',
          color: 'white',
          border: '1px solid #152248',
          borderRadius: '8px',
          padding: '0.25rem 0.5rem',
          cursor: 'pointer',
          transition:
            'background-color 0.15s ease, color 0.15s ease, transform 0.05s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#1c2d63'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#152248'
          e.currentTarget.style.color = 'white'
          e.currentTarget.style.transform = 'scale(1)'
        }}
        onMouseDown={e => {
          e.currentTarget.style.backgroundColor = 'white'
          e.currentTarget.style.color = '#152248'
          e.currentTarget.style.transform = 'scale(0.96)'
        }}
        onMouseUp={e => {
          e.currentTarget.style.backgroundColor = '#1c2d63'
          e.currentTarget.style.color = 'white'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        Save
      </button>
    </div>
  )
}