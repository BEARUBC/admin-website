'use client'

import React, { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import MarkdownGuide from '@/app/components/MarkdownGuide'
import BlogPost from '@/app/components/BlogPost'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// Fix build error: mark this page as client-rendered only
export const dynamic = 'force-dynamic'

type Post = {
    id: number
    title: string | null
    author: string | null
    date: string | null
    description: string | null
    content: string | null
}

// ---- main wrapper with Suspense ----
export default function EditBlogPage() {
    return (
        <Suspense fallback={<div className="p-4 text-center">Loading editor...</div>}>
            <EditBlogContent />
        </Suspense>
    )
}

// ---- actual page logic separated ----
function EditBlogContent() {
    const supabase = createClient()
    const searchParams = useSearchParams()
    const blogId = searchParams.get('blogId')

    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(false)
    const [notFound, setNotFound] = useState(false)

    const fetchPost = useCallback(async () => {
        if (!blogId) return
        setLoading(true)
        setNotFound(false)

        const { data, error } = await supabase
            .from('blog')
            .select('*')
            .eq('id', blogId)
            .single()

        if (error || !data) {
            console.warn('Blog not found:', error?.message)
            setNotFound(true)
            setPost(null)
        } else {
            setPost(data)
        }

        setLoading(false)
    }, [supabase, blogId])

    useEffect(() => {
        fetchPost()
    }, [fetchPost])

    async function updatePost() {
        if (!post) return
        const { error } = await supabase
            .from('blog')
            .update(post)
            .eq('id', post.id)
        if (error) console.error(error)
    }

    function editLocal(patch: Partial<Post>) {
        setPost(prev => (prev ? { ...prev, ...patch } : prev))
    }

    // ---- Fallback cases ----
    if (!blogId)
        return (
            <div className="p-8 text-center font-sans text-foreground">
                <h1 className="text-2xl font-semibold text-primary mb-4">
                    No blog selected
                </h1>
                <p className="mb-4 text-muted-foreground">
                    You must provide a <code>?blogId=</code> in the URL to edit a post.
                </p>
                <StyledBackButton />
            </div>
        )

    if (notFound)
        return (
            <div className="p-8 text-center font-sans text-foreground">
                <h1 className="text-2xl font-semibold text-destructive mb-4">
                    Blog not found
                </h1>
                <p className="mb-4 text-muted-foreground">
                    The blog post with ID <strong>{blogId}</strong> doesn’t exist or was deleted.
                </p>
                <StyledBackButton />
            </div>
        )

    if (loading)
        return (
            <div className="p-8 text-center font-sans text-foreground">
                <p>Loading blog #{blogId}...</p>
            </div>
        )

    // ---- Main editor ----
    return (
        <div className="p-4 font-sans bg-background text-foreground">
            <StyledBackButton />

            <MarkdownGuide />

            <h1 className="mt-4 mb-2 text-2xl font-semibold text-primary">
                Editing Blog #{blogId}
            </h1>
            <div className="h-1 bg-primary w-full rounded-full my-2"></div>

            {post && (
                <BlogPost post={post} onChange={editLocal} onSave={updatePost} />
            )}
        </div>
    )
}

// ---- consistent back button component ----
function StyledBackButton() {
    return (
        <Link
            href="/blogs-select"
            className="flex items-center gap-1 bg-secondary text-background border border-secondary rounded-lg px-2 py-1 text-sm transition-all hover:bg-primary active:bg-background active:text-primary mb-4 inline-flex"
        >
            <ArrowLeft size={14} /> Back to all blogs
        </Link>
    )
}
