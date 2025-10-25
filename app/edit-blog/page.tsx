'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import MarkdownGuide from '@/app/components/MarkdownGuide'
import BlogPost from '@/app/components/BlogPost'

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

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('blog')
      .select('*')
      .order('id', { ascending: false })
    if (error) console.error(error)
    setPosts(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

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

  function editLocalPost(id: number, patch: Partial<Post>) {
    setPosts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...patch } : p)),
    )
  }

  return (
    <div className="p-4 font-sans bg-background text-foreground">
      <MarkdownGuide />

      <h1 className="mt-4 mb-2 text-2xl font-semibold text-primary">
        Edit Blog Posts
      </h1>

      <div className="h-1 bg-primary w-full rounded-full my-2"></div>

      {loading && <p>Loading...</p>}

      {posts.map(post => (
        <BlogPost
          key={post.id}
          post={post}
          onChange={patch => editLocalPost(post.id, patch)}
          onSave={() => updatePost(post)}
        />
      ))}
    </div>
  )
}