import Link from 'next/link';
interface BookCardProps {
  book: { slug: string; title: string; coverImage?: string | null; description?: string | null; categoryName?: string | null; featured?: boolean; bookType?: string | null; };
}
function stripHtml(html: string) { return html?.replace(/<[^>]*>/g, '').trim() || ''; }
export default function BookCard({ book }: BookCardProps) {
  const desc = stripHtml(book.description || '');
  return (
    <Link href={`/book/${book.slug}`}>
      <div className="card h-full flex flex-col">
        {book.featured && <div className="card-badge"><i className="fa-solid fa-star mr-1"></i>Featured</div>}
        {book.coverImage ? (
          <img src={book.coverImage} alt={book.title} className="card-cover" loading="lazy" />
        ) : (
          <div className="card-cover-empty"><i className="fa-solid fa-book-open"></i></div>
        )}
        <div className="card-body flex-1 flex flex-col">
          <h3 className="card-title">{book.title}</h3>
          {book.categoryName && <span className="pill mb-2 self-start" style={{ fontSize: '0.6875rem' }}>{book.categoryName}</span>}
          {desc && <p className="card-meta line-clamp-2 flex-1">{desc}</p>}
          <div className="mt-3 text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
            {book.bookType === 'single' ? 'Read Story' : 'Read Now'} <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.625rem' }}></i>
          </div>
        </div>
      </div>
    </Link>
  );
}
