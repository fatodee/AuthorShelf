interface SupportSectionProps { settings: Record<string, string | null>; }
export default function SupportSection({ settings }: SupportSectionProps) {
  if (settings.support_enabled !== 'true') return null;
  let methods: { label: string; url: string; icon: string }[] = [];
  try { methods = JSON.parse(settings.support_methods || '[]'); } catch {}
  return (
    <div className="support-card">
      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
        {settings.support_title || 'Support the Author'}
      </h3>
      {settings.support_description && <p className="mb-4" style={{ color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto 1rem' }}>{settings.support_description}</p>}
      {methods.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center mb-4">
          {methods.map((m, i) => (
            <a key={i} href={m.url} target="_blank" rel="noopener noreferrer" className="support-btn">
              <i className={m.icon}></i> {m.label}
            </a>
          ))}
        </div>
      )}
      {settings.support_custom_html && <div dangerouslySetInnerHTML={{ __html: settings.support_custom_html }} />}
    </div>
  );
}
