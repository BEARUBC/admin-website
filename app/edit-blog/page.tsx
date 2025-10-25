'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import MarkdownGuide from '@/app/components/MarkdownGuide'


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
    const { data, error } = await supabase.from('blog').select('*').order('id', { ascending: false })
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

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>

      <MarkdownGuide />

      <h1 style={{ marginBottom: '0.5rem', marginTop: '1rem' }}> Edit Blog Posts </h1>

      <div className="h-1 bg-[#152248] w-full rounded-full my-2"></div>


      {loading && <p>Loading...</p>}

      {posts.map((post) => (
        <div key={post.id} style={{ borderRadius: '4px', border: '1px solid #ddd', padding: '0.5rem', marginBottom: '1rem' }}>

          {/* == container == */}
          <div className="flex flex-col md:flex-row md:items-end gap-2 mb-2">

            {/* Title */}
            <div className="flex-1 min-w-[200px]">
              <label className="font-semibold block text-xs text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={post.title || ''}
                onChange={(e) =>
                  setPosts((prev) =>
                    prev.map((p) =>
                      p.id === post.id ? { ...p, title: e.target.value } : p
                    )
                  )
                }
                placeholder="Title"
                className="w-full border border-gray-300 rounded px-2 py-1"
              />
            </div>

            {/* Author */}
            <div className="flex-1 min-w-[200px]">
              <label className="font-semibold block text-xs text-gray-700 mb-1">Author</label>
              <input
                type="text"
                value={post.author || ''}
                onChange={(e) =>
                  setPosts((prev) =>
                    prev.map((p) =>
                      p.id === post.id ? { ...p, author: e.target.value } : p
                    )
                  )
                }
                placeholder="Author"
                className="w-full border border-gray-300 rounded px-2 py-1"
              />
            </div>

            {/* Date */}
            <div className="flex-1 min-w-[150px]">
              <label className="font-semibold block text-xs text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={post.date ? post.date.split('T')[0] : ''}
                onChange={(e) =>
                  setPosts((prev) =>
                    prev.map((p) =>
                      p.id === post.id ? { ...p, date: e.target.value } : p
                    )
                  )
                }
                className="w-full border border-gray-300 rounded px-2 py-1"
              />
            </div>
          </div>


          {/* // description text */}
          <label className="font-semibold block text-xs text-gray-700 mb-1">Description</label>
          <input
            type="text"
            value={post.description || ''}
            onChange={(e) =>
              setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, description: e.target.value } : p)))
            }
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


          {/* === Content + Preview section === */}
          <div className="mb-3">
            <label className="text-xs text-gray-600 block mb-1">Content</label>

            {/* Small bar under "Content" */}
            <div className="h-[2px] bg-[#152248] w-full rounded-full mb-3"></div>

            {/* wrapper */}
            <div className="flex flex-col md:flex-row gap-3">

              {/* Left: Markdown editor */}
              <div className="flex-1 flex flex-col">
                <div className="text-[0.65rem] text-gray-500 mb-1 font-medium uppercase tracking-wide">
                  Editor
                </div>
                <textarea
                  value={post.content || ''}
                  onChange={(e) =>
                    setPosts((prev) =>
                      prev.map((p) =>
                        p.id === post.id ? { ...p, content: e.target.value } : p
                      )
                    )
                  }
                  placeholder="Write your Markdown here..."
                  className="block w-full h-40 border border-gray-300 rounded px-2 py-1 font-mono text-xs resize-y"
                />
              </div>

              {/* Right: Preview box */}
              <div className="flex-1 flex flex-col">
                <div className="text-[0.65rem] text-gray-500 mb-1 font-medium uppercase tracking-wide">
                  Preview
                </div>
                <div className="w-full h-40 border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50 overflow-auto">
                  {post.content ? (
                    <pre className="whitespace-pre-wrap break-words font-sans text-xs text-gray-800">
                      {post.content}
                    </pre>
                  ) : (
                    <span className="text-gray-400 text-xs italic">
                      (Markdown preview will appear here)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>


          {/* // save changes button */}
          <button
            onClick={() => updatePost(post)}
            style={{
              backgroundColor: '#152248',
              color: 'white',
              border: '1px solid #152248',
              borderRadius: '8px',
              padding: '0.25rem 0.5rem',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease, color 0.15s ease, transform 0.05s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1c2d63'; // slightly lighter on hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#152248';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.backgroundColor = 'white';   // flash white
              e.currentTarget.style.color = '#152248';           // text turns blue
              e.currentTarget.style.transform = 'scale(0.96)';   // small "press" shrink
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor = '#1c2d63'; // back to hover color quickly
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Save
          </button>


        </div>
      ))}

    </div>
  )
}