'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function EditBlogPage() {
  const supabase = createClient()
  const [blog, setBlog] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')

  useEffect(() => {
    fetchBlog()
  }, [])

  async function fetchBlog() {
    const { data, error } = await supabase.from('blog').select()
    if (error) console.error(error)
    setBlog(data || [])
  }

  async function addPost() {
    if (!title.trim() || !author.trim()) return
    const { error } = await supabase.from('blog').insert({ title, author })
    if (error) {
      console.error('Insert error:', error)
      return
    }
    setTitle('')
    setAuthor('')
    fetchBlog()
  }

  async function deletePost(id: number) {
    const { error } = await supabase.from('blog').delete().eq('id', id)
    if (error) console.error(error)
    fetchBlog()
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Edit Blog</h1>

      <div className="flex flex-col gap-2 max-w-md">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2 rounded"
        />
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author"
          className="border p-2 rounded"
        />
        <button
          onClick={addPost}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Post
        </button>
      </div>

      <ul className="space-y-2">
        {blog.map((post) => (
          <li
            key={post.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <div>
              <strong>{post.title}</strong> <em>by {post.author}</em>
            </div>
            <button
              onClick={() => deletePost(post.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <pre className="bg-gray-100 p-2 rounded">
        {JSON.stringify(blog, null, 2)}
      </pre>
    </div>
  )
}
