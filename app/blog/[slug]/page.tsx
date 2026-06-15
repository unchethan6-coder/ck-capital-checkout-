import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { sanityFetch } from '@/lib/sanity'

export const revalidate = 60

type Block = { _type: string; children?: { text?: string }[] }
type PostDetail = {
  title: string
  date: string
  category: string
  excerpt: string
  body: Block[]
}

function formatDate(d: string): string {
  if (!d) return ''
  const date = new Date(d)
  if (isNaN(date.getTime())) return d
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const safe = slug.replace(/[^a-z0-9-]/gi, '')
  const post = await sanityFetch<PostDetail | null>(
    `*[_type == "post" && slug.current == "${safe}"][0]{ "title": title, "excerpt": excerpt }`,
  )
  if (!post) return { title: 'Blog | CK Capital' }
  return { title: `${post.title} | CK Capital`, description: post.excerpt || undefined }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const safe = slug.replace(/[^a-z0-9-]/gi, '')
  const post = await sanityFetch<PostDetail | null>(`*[_type == "post" && slug.current == "${safe}"][0]{
    "title": title,
    "date": publishedAt,
    "category": coalesce(categories[0]->title, ""),
    "excerpt": excerpt,
    "body": body[]{ _type, "children": children[]{ text } }
  }`)

  if (!post) notFound()

  const paragraphs = (post.body || [])
    .filter((b) => b._type === 'block')
    .map((b) => (b.children || []).map((c) => c.text || '').join(''))
    .filter((t) => t.trim().length > 0)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <article className="relative py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#070A18] via-[#0C1024] to-[#070A18]" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6">
          <Link href="/blog" className="text-primary hover:text-[#7C5CFF] transition-colors text-sm">
            ← Back to Blog
          </Link>

          {post.category && (
            <span className="inline-block mt-6 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-semibold">
              {post.category}
            </span>
          )}

          <h1 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-3 text-balance">{post.title}</h1>
          {post.date && <p className="text-sm text-muted-foreground mb-8">{formatDate(post.date)}</p>}

          <div className="space-y-5">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => (
                <p key={i} className="text-base md:text-lg text-foreground leading-relaxed">
                  {p}
                </p>
              ))
            ) : (
              <p className="text-base md:text-lg text-foreground leading-relaxed">{post.excerpt}</p>
            )}
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}
