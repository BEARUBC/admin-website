'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Edit3 } from 'lucide-react'

type Post = {
  id: number
  title: string | null
  author: string | null
  date: string | null
  description: string | null
}

export default function BlogsSelectPage() {
  const supabase = createClient()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('blog')
        .select('id, title, author, date, description')
        .order('id', { ascending: false })
      if (error) console.error(error)
      setPosts(data || [])
      setLoading(false)
    }
    fetchPosts()
  }, [supabase])

  return (
    <div className="p-6 font-sans bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4 text-primary">Blog Posts</h1>
      <div className="h-1 bg-primary w-full rounded-full my-2"></div>
      {loading && <p>Loading...</p>}

      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.id}>
            <Link
              href={`/blog-edit?blogId=${post.id}`}
              className="block p-4 rounded-lg border border-border bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  <p>{post.author}</p>
                  <p className="text-sm text-muted-foreground">{post.date}</p>

                  <p className="text-sm text-muted-foreground mt-2 border border-border rounded-md p-2">
                    {post.description || 'No description.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Optional: keep the Edit button if you want visual consistency */}
                  <span className="flex items-center gap-1 bg-secondary text-background border border-secondary rounded-lg px-2 py-1 text-sm transition-all hover:bg-primary active:bg-background active:text-primary">
                    <Edit3 size={14} /> Edit
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
