import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: blog } = await supabase.from('blog').select()

  return <pre>{JSON.stringify(blog, null, 2)}</pre>
}
