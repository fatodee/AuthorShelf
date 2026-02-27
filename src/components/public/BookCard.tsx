import Link from 'next/link';

interface BookCardProps {
  book: {
    slug: string;
    title: string;
    coverImage?: string | null;
    description?: string | null;
    categoryName?: string | null;
    featured?: boolean;
    bookType?: string | null;
  };
}

function stripHtml(html: string) {
  return html?.replace(/<[^>]*>/g, '').trim() || '';
}

export default function BookCard({ book }: BookCardProps) {
  const desc = stripHtml(book.description || '');
  return (
    <Link href={`/book/${book.slug}`}>
      <div className="book-card h-full flex flex-col relative">
        {book.featured && <div className="featured-badge"><i className="fa-solid fa-star mr-1"></i>Featured</div>}
        {book.coverImage ? (
          <img src={book.coverImage} alt={book.title} className="book-cover" loading="lazy" />
        ) : (
          <div className="book-cover-placeholder"><i className="fa-solid fa-book"></i></div>
        )}
        <div className="p-3 flex-1 flex flex-col">
          <h3 className="font-bold text-sm mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{book.title}</h3>
          {book.categoryName && <span className="category-pill mb-2 self-start">{book.categoryName}</span>}
          {desc && <p className="text-xs flex-1" style={{ color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{desc}</p>}
          <div className="mt-2 text-xs font-medium flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
            <i className="fa-solid fa-book-open"></i>
            {book.bookType === 'single' ? 'Read Story' : 'Read Now'}
          </div>
        </div>
      </div>
    </Link>
  );
}
