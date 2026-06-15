import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity'

export const revalidate = 60

type Post = { title: string; slug: string; category: string; excerpt: string; date: string }

const POSTS_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  "title": title,
  "slug": slug.current,
  "category": coalesce(categories[0]->title, "Trading"),
  "excerpt": excerpt,
  "date": publishedAt
}`

// Used only if Sanity is briefly unreachable, so the page never breaks.
const FALLBACK: Post[] = [
  { title: '5 Essential Risk Management Rules for Prop Traders', slug: '', category: 'Risk Management', excerpt: 'Learn the fundamentals of protecting your trading capital.', date: 'March 10, 2025' },
]

function formatDate(d: string): string {
  if (!d) return ''
  const date = new Date(d)
  if (isNaN(date.getTime())) return d
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function BlogPage() {
  const data = await sanityFetch<Post[]>(POSTS_QUERY)
  const source: Post[] = data && data.length ? data : FALLBACK
  const posts: Post[] = source.map((p) => ({
    title: p.title,
    slug: p.slug || '',
    category: p.category || 'Trading',
    excerpt: p.excerpt || '',
    date: formatDate(p.date),
  }))

  const categories = ['All', 'Trading Tips', 'Market Analysis', 'Risk Management', 'Success Stories']
  const featured = posts[0]
  const rest = posts.slice(1)
  const href = (slug: string) => (slug ? `/blog/${slug}` : '#')

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#070A18] via-[#0C1024] to-[#070A18]" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(110, 84, 255, 0.1) 0%, transparent 50%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h1 className="hero-title text-white mb-6 text-balance">
            CK Capital <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-lg text-foreground max-w-2xl mx-auto">
            Trading insights, market analysis, and success stories from our community.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  idx === 0 ? 'bg-primary text-white' : 'bg-card border border-border text-foreground hover:border-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featured && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12">
            <div className="glow-card border-primary/30 h-64 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-semibold mb-4">
                  Featured
                </span>
                <h2 className="text-3xl font-bold text-white mb-3">{featured.title}</h2>
                <p className="text-foreground text-lg">{featured.excerpt}</p>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{featured.date}</span>
                <Link href={href(featured.slug)} className="text-primary hover:text-[#7C5CFF] transition-colors">
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post, idx) => (
              <div key={idx} className="glow-card flex flex-col">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-semibold mb-3 w-fit">
                  {post.category}
                </span>
                <h3 className="text-xl font-bold text-white mb-2 flex-1">{post.title}</h3>
                <p className="text-foreground text-sm mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{post.date}</span>
                  <Link href={href(post.slug)} className="text-primary hover:text-[#7C5CFF] transition-colors">
                    Read →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
