'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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
      <h1>Edit Blog Posts</h1>

      {loading && <p>Loading...</p>}

      {posts.map((post) => (
        <div key={post.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            value={post.title || ''}
            onChange={(e) =>
              setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, title: e.target.value } : p)))
            }
            placeholder="Title"
            style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }}
          />

          <input
            type="text"
            value={post.author || ''}
            onChange={(e) =>
              setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, author: e.target.value } : p)))
            }
            placeholder="Author"
            style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }}
          />

          <input
            type="date"
            value={post.date ? post.date.split('T')[0] : ''}
            onChange={(e) =>
              setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, date: e.target.value } : p)))
            }
            style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }}
          />

          <input
            type="text"
            value={post.description || ''}
            onChange={(e) =>
              setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, description: e.target.value } : p)))
            }
            placeholder="Description"
            style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }}
          />

          <textarea
            value={post.content || ''}
            onChange={(e) =>
              setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, content: e.target.value } : p)))
            }
            placeholder="Content"
            style={{ display: 'block', width: '100%', height: '120px', marginBottom: '0.5rem' }}
          />

          <button onClick={() => updatePost(post)}>Save</button>
        </div>
      ))}
    </div>
  )
}