import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminUsers, siteSettings, authorProfile, categories, books, chapters, blogPosts, pageToggles } from '@/lib/db/schema';
import { hashPassword } from '@/lib/auth';
import { sql } from 'drizzle-orm';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    // Create tables (Neon requires one statement per execute)
    await db.execute(sql`CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'editor' NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS site_settings (
      id SERIAL PRIMARY KEY, key VARCHAR(255) UNIQUE NOT NULL, value TEXT,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS author_profile (
      id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, photo TEXT, bio TEXT,
      achievements TEXT, facebook_url TEXT, instagram_url TEXT, x_url TEXT,
      linkedin_url TEXT, youtube_url TEXT, website_url TEXT,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT, image TEXT, sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY, title VARCHAR(500) NOT NULL, slug VARCHAR(500) UNIQUE NOT NULL,
      description TEXT, author_note TEXT, category_id INTEGER REFERENCES categories(id),
      cover_image TEXT, gallery_images JSONB DEFAULT '[]', featured BOOLEAN DEFAULT false,
      book_type VARCHAR(50) DEFAULT 'series', status VARCHAR(20) DEFAULT 'draft' NOT NULL,
      meta_title TEXT, meta_description TEXT, views INTEGER DEFAULT 0,
      published_at TIMESTAMP, created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS chapters (
      id SERIAL PRIMARY KEY, book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      title VARCHAR(500) NOT NULL, slug VARCHAR(500) NOT NULL, content TEXT,
      chapter_image TEXT, chapter_order INTEGER DEFAULT 1 NOT NULL,
      status VARCHAR(20) DEFAULT 'draft' NOT NULL, views INTEGER DEFAULT 0,
      published_at TIMESTAMP, created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS media (
      id SERIAL PRIMARY KEY, filename VARCHAR(500) NOT NULL, path TEXT NOT NULL,
      mime_type VARCHAR(100), size INTEGER, alt TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY, title VARCHAR(500) NOT NULL, slug VARCHAR(500) UNIQUE NOT NULL,
      excerpt TEXT, content TEXT, featured_image TEXT, tags TEXT,
      status VARCHAR(20) DEFAULT 'draft' NOT NULL, meta_title TEXT, meta_description TEXT,
      views INTEGER DEFAULT 0, published_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL, updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS page_views (
      id SERIAL PRIMARY KEY, page_type VARCHAR(50) NOT NULL, page_id INTEGER,
      page_slug VARCHAR(500), viewed_at TIMESTAMP DEFAULT NOW() NOT NULL
    )`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS page_toggles (
      id SERIAL PRIMARY KEY, page_key VARCHAR(100) UNIQUE NOT NULL,
      enabled BOOLEAN DEFAULT true NOT NULL, label VARCHAR(255),
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )`);
    // Check if already seeded
    const existing = await db.select().from(adminUsers).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ message: 'Already seeded. Delete data first to re-seed.' });
    }
    // Admin user
    const hash = await hashPassword('admin123');
    await db.insert(adminUsers).values({ email: 'admin@authorshelf.com', password: hash, name: 'Site Admin', role: 'super_admin' });
    // Site settings
    const settingsData: Record<string, string> = {
      site_name: 'AuthorShelf',
      tagline: 'Stories worth reading',
      seo_title: 'AuthorShelf — Stories worth reading',
      seo_description: 'A personal online book reading platform. Browse and read stories for free.',
      footer_text: '© AuthorShelf. All rights reserved.',
      homepage_latest: 'books',
      homepage_featured: 'true',
      theme_name: 'midnight-ink',
      support_enabled: 'true',
      support_title: 'Support the Author',
      support_description: 'If my stories moved you, made you feel something, or kept you up past your bedtime — consider supporting my craft. Every contribution fuels the next chapter.',
      support_button_text: 'Buy Me a Coffee',
      support_methods: JSON.stringify([
        { label: 'Buy Me a Coffee', url: 'https://buymeacoffee.com/', icon: 'fa-solid fa-mug-hot' },
        { label: 'PayPal', url: 'https://paypal.me/', icon: 'fa-brands fa-paypal' },
        { label: 'Cash App', url: 'https://cash.app/', icon: 'fa-solid fa-dollar-sign' }
      ]),
    };
    for (const [key, value] of Object.entries(settingsData)) {
      await db.insert(siteSettings).values({ key, value });
    }
    // Author profile
    await db.insert(authorProfile).values({
      name: 'Site Author',
      bio: `<p>Welcome! I'm the author behind this platform.</p><p>I write stories that explore the full spectrum of human experience — from desire and heartbreak to self-discovery and societal truths. My work spans multiple genres including romance, storytelling, and reflective essays that challenge how we think about love, identity, and the world around us.</p><p>I believe in the power of storytelling to heal, provoke, and connect. So stick around, read something that moves you, and let's create beautiful written memories together.</p>`,
      achievements: `<ul><li>Creator of an independent creative writing platform</li><li>Published stories spanning multiple genres: Romance, Storytelling, Self-Discovery</li><li>Building a dedicated readership through authentic storytelling</li><li>Featured storyteller across multiple categories</li></ul>`,
    });
    // Categories — matching WordPress exactly
    const catData = [
      { name: 'Erotica', slug: 'erotica', description: 'Bold, provocative, and unapologetic adult fiction. These stories explore desire, intimacy, and the raw chemistry between characters.', sortOrder: 1 },
      { name: 'Romance', slug: 'romance', description: 'Stories of love, longing, connection, and the complicated dance between hearts. From sweet to steamy.', sortOrder: 2 },
      { name: 'Storytelling', slug: 'storytelling', description: 'Narrative fiction that transports you — character-driven tales rooted in real emotions and vivid settings.', sortOrder: 3 },
      { name: 'Love & Emotional Healing', slug: 'love-emotional-healing', description: 'A safe space for raw conversations about love, heartbreak, rejection, and recovery. Here, I unpack emotional attachment, self-worth, and the messy process of healing and letting go.', sortOrder: 4 },
      { name: 'Self-Discovery & Growth', slug: 'self-discovery-growth', description: 'Reflections on becoming — on who we are, who we\'re becoming, and what it takes to grow through change. These pieces challenge habits, mindsets, and identity with honesty and courage.', sortOrder: 5 },
      { name: 'Society & Culture Reflections', slug: 'society-culture-reflections', description: 'Cultural analysis through a personal lens — where film, media, and society meet introspection. I dive into themes that mirror human experience and provoke meaningful dialogue.', sortOrder: 6 },
    ];
    const insertedCats: Record<string, number> = {};
    for (const c of catData) {
      const [row] = await db.insert(categories).values(c).returning({ id: categories.id });
      insertedCats[c.slug] = row.id;
    }
    // ═══════════════════════════════════════════════════
    // BOOKS — Stories from the WordPress site
    // ═══════════════════════════════════════════════════
    // Book 1: Burning Desires (Series — 3 parts/chapters)
    const [burningDesires] = await db.insert(books).values({
      title: 'Burning Desires',
      slug: 'burning-desires',
      description: `<p>A searing office romance between a woman and a powerful man who can never truly be hers. <strong>Burning Desires</strong> is a multi-part series exploring forbidden attraction, power dynamics, and the painful collision of desire and reality.</p><p>What begins as an irresistible pull turns into a complicated affair — one that threatens careers, marriages, and the very sense of self.</p>`,
      authorNote: `<p>This series was born from conversations I've had with women who've found themselves in impossible situations with impossible men. The emotions are real even if the characters aren't. Handle with care.</p>`,
      categoryId: insertedCats['romance'],
      featured: true,
      bookType: 'series',
      status: 'published',
      publishedAt: new Date('2025-12-18'),
    }).returning({ id: books.id });
    // Burning Desires chapters
    await db.insert(chapters).values([
      {
        bookId: burningDesires.id, title: 'Burning Desires Pt.1: Ignition', slug: 'pt-1-ignition', chapterOrder: 1, status: 'published', publishedAt: new Date('2025-11-30'),
        content: `<p>The first time I saw him, he was standing at the head of the conference table like he owned every molecule of air in the room. And maybe he did.</p><p>He was my boss. Married. Off-limits in every conceivable way. But the heart — or whatever organ was responsible for this reckless infatuation — didn't care about rules.</p><p>It started with glances. Then lingering conversations after meetings. Then late nights at the office where the silence between us said more than words ever could.</p><p><em>"You should go home,"</em> he said one evening, his voice low, his eyes betraying something he wasn't supposed to feel.</p><p><em>"So should you,"</em> I whispered back.</p><p>Neither of us moved.</p><p>That night, the line we'd been toeing disappeared completely. His hands found me in the dim light of his office, and I let them. I let him pull me close, let his lips trace the curve of my neck, let the world outside those four walls cease to exist.</p><p>It was wrong. We both knew it. But wrong had never felt so intoxicating.</p><p>He kissed me like a man who'd been holding his breath for years — desperate, consuming, reverent. And I kissed him back like a woman who'd finally found the fire she'd been searching for.</p><p><em>"This can't happen again,"</em> he murmured against my skin.</p><p><em>"I know,"</em> I lied.</p><p>Because we both knew it would.</p>`,
      },
      {
        bookId: burningDesires.id, title: 'Burning Desires Pt.2: Combustion', slug: 'pt-2-combustion', chapterOrder: 2, status: 'published', publishedAt: new Date('2025-12-10'),
        content: `<p>The days that followed were a blur of stolen moments and calculated risks. We developed a language of our own — a look across the boardroom, a brush of fingers passing documents, the way he'd say my name with just enough weight to make my stomach flip.</p><p>His office became our sanctuary. After hours, when the building emptied and the city lights replaced the fluorescent ones, we existed in a world built for two.</p><p><em>"What are we doing?"</em> I asked him one night, tangled in each other on the leather couch that had witnessed more confessions than any therapist's.</p><p><em>"Something we can't stop,"</em> he said simply.</p><p>He was right. I'd tried. Lord knows I'd tried. I'd deleted his number (he called from the office line). I'd avoided his floor (he came to mine). I'd gone on dates with other men (I compared them all to him and they fell short).</p><p>The guilt was there too — a constant companion that followed me home every night. His wife. His children. The life I was helping him betray. I'd stare at my ceiling at 2 AM, bargaining with my conscience, promising myself <em>this is the last time.</em></p><p>But then he'd look at me, and every resolution would crumble.</p><p>One evening, he surprised me. Instead of the office, he drove us to a small restaurant on the outskirts of the city — somewhere no one would recognize us.</p><p><em>"I wanted to take you somewhere real,"</em> he explained. <em>"Not behind closed doors."</em></p><p>That dinner broke something in me. Because sitting across from him in candlelight, laughing freely, being looked at like I was the only woman in the world — it gave me a taste of what I could never fully have.</p><p>And that was more dangerous than any physical encounter.</p><p>When he drove me home, he kissed me at the door — long, slow, aching.</p><p><em>"I wish things were different,"</em> he said.</p><p><em>"But they're not."</em></p><p>He drove away. And I stood there, watching his taillights disappear, feeling like a woman split in two — one half alive with love, the other dying from the impossibility of it.</p>`,
      },
      {
        bookId: burningDesires.id, title: 'Burning Desires Pt.3: Fated', slug: 'pt-3-fated', chapterOrder: 3, status: 'published', publishedAt: new Date('2025-12-18'),
        content: `<p>I sat down, trying to drown myself in the paperwork that lay before me, but the uncertainty in my body remained, and a taut string was ready to snap. The thrill of last night mingled with the bitter taste of reality, left me restless. I had given him everything, yet here I was… just another face in the crowd.</p><p>As the afternoon sun shone through the office windows, I made a resolution to confront my emotions. I picked up my phone, and my fingers hovered over his number. It felt like a dangerous temptation, one I knew I had to resist. Reaching out would only deepen my wounds, reminding me of the abyss that lay between us.</p><p>But the urge gnawed at me, a reminder of the intimacy we had shared. My mind drifted to the time I caught sight of him through the glass walls of his office, a figure of power and control, oblivious to the turmoil fuming within me.</p><p>Suddenly, a knock on the door broke my reverie. It was Caroline, my closest colleague and confidante.</p><p><em>"Are you okay?"</em> she asked, stepping inside.</p><p>I forced a smile. <em>"Just busy."</em></p><p>But she wasn't deceived.</p><p><em>"It's him,"</em> I admitted. <em>"Last night… it changed everything."</em></p><p><em>"Is he still treating you like the other woman?"</em></p><p>I nodded, the pain flaring up anew. <em>"He wants me to wait while he plays house with his wife."</em></p><p><em>"And are you willing to do that?"</em> she probed.</p><p><em>"I don't know,"</em> I confessed, tears prickling my eyes. <em>"But I can't just turn off my feelings like a light switch."</em></p><p>She stepped closer. <em>"You deserve more than being a secret. You deserve to be somebody's first choice, not a backup plan."</em></p><p>Her words resonated deep within me. Perhaps it was time to confront my worth. I had let him entangle his way into my heart, but I didn't have to remain in the dark. I could fight for my place. For my happiness.</p><hr><p><strong><em>Phone ringing…</em></strong></p><p><em>"Hello, who's this?"</em></p><p><strong>Shit! His wife picked up…</strong></p><p><em>"I'm calling from the firm. There's been an emergency and I was hoping to speak to him directly."</em> I said.</p><p><em>"Don't you have his business line or something? How did you get this number?"</em></p><p>I heard him talking in the background.</p><p><em>"It's okay honey, I got this now, thank you."</em></p><p><em>"Why are you calling my house?"</em> He said with an irritated tone. <em>"Do you want to get fired?"</em></p><p><em>"I'm sorry, I didn't mean to…"</em></p><p>He hung up before I could speak any further. I had never been so humiliated before.</p><p><strong>Why couldn't I accept that he would never love me like I wanted?</strong></p><p>Maybe it was time to open my heart up to somebody else.</p>`,
      },
    ]);
    // Book 2: Erotic Nights Of A Shady Slut (Single)
    const [eroticNights] = await db.insert(books).values({
      title: 'Erotic Nights Of A Shady Slut',
      slug: 'erotic-nights-of-a-shady-slut',
      description: `<p>A raw, unapologetic erotic tale of a woman who meets a devastatingly beautiful stranger at a private beach party — and surrenders to a night of pleasure that rewires her entire world. But when the stranger vanishes, obsession takes root. Their paths cross again in the most unexpected place, revealing secrets neither of them can afford to keep.</p><p><em>Bold. Explicit. Unforgettable.</em></p>`,
      categoryId: insertedCats['erotica'],
      featured: true,
      bookType: 'single',
      status: 'published',
      publishedAt: new Date('2025-12-21'),
    }).returning({ id: books.id });
    await db.insert(chapters).values({
      bookId: eroticNights.id, title: 'Erotic Nights Of A Shady Slut', slug: 'full-story', chapterOrder: 1, status: 'published', publishedAt: new Date('2025-12-21'),
      content: `<p>This man was sickeningly beautiful. He wore the type of confidence that made him look like a golden god. He was something else. Something I'd never seen before, and quite frankly, I was pretty much occupied with the thought of him atop of me, so much that I didn't notice when he came up to me…</p><p>I met him at a private beach party sometime in late August. Ugh! I wish I could go on to say that he was tall, dark and handsome, but I realise that would be too cliché.</p><p>…</p><p><em>"I didn't know pretty sophisticated women came to places like this."</em></p><p>There he was, face-to-face with me. He was dashing and I didn't realise when he came up to me.</p><p><em>"And what's that supposed to mean? Are you assuming that pretty sophisticated women don't have the type of fun people like you do?"</em> I snapped back viciously.</p><p><em>"Oooh feisty! I mean no offense."</em></p><p><em>"Of course you didn't."</em></p><p>I could sense the look of admiration in his eyes. It was intense, deep, and questioning. Almost as if he was caught off guard by my rigidity.</p><p><em>"I'm Gerald by the way. It's nice to meet you."</em></p><p><em>"I'm Fatimah. Can't exactly say the same about you."</em></p><p>I wish I knew why I was acting all bitchy, especially when I knew how happy I was to be standing so close to him. I couldn't give the excitement away, so a little pretence was all I needed.</p><p>…</p><p>It had been three days since my encounter with the stranger I met on the beach, and honestly, if you had asked me how everything happened so fast, I wouldn't have the answer for you. Because I don't know the answer myself. Things escalated so quickly, I didn't even realise when we appeared at his hotel room that same night. The same night he flipped my world over.</p><p>No contacts were exchanged. No names. No addresses. But I longed to see him again. To feel him once more.</p><p>Seconds turned into minutes, minutes into hours, hours into days, and days into weeks. Yet, this mysterious man was nowhere to be found. He lingered in my thoughts, and his shadows lurked in my room at night… My body was obsessing over what it could not understand.</p><p><strong><em>Who really could he be? And why was I so hung up on him?</em></strong></p><p>…</p><p>Two months later, I visited the hospital to consult a doctor. It was a matter of urgency.</p><p>I was asked to wait in the office. While I sat waiting, my desires got the best of me.</p><p>I felt a hand go down into my blouse, reaching for my breasts. I flinched and I tried to scream, but he put his hand over my mouth, signalling me to be quiet. As soon as I saw his face, my heart raced.</p><p>It was him. The very man I had been longing for.</p><p>He quietly locked the door and pulled a chair beside me.</p><p><em>"Are you stalking me"</em> He said, wearing a smirk.</p><p>I tried to slap him, but he caught my hand.</p><p><em>"No need to get all worked up. We're in the hospital, remember?"</em></p><p>Helpless, I yielded.</p><p><em>"Where have you been? I've been waiting on you."</em> I cried.</p><p><em>"I know. I'm sorry I left you."</em></p><p>…</p><p>Suddenly, a knock is heard at the door.</p><p><em>"Sorry, Doc. I wanted to ask if you have a lady in there with you. Her husband's waiting for her, it's past her appointment time."</em></p><p>My heart sank. I knew my secret was now in the open.</p><p><em>"Listen, I can explain—"</em></p><p><em>"Get out!"</em></p><p><em>"But— but if you could just—"</em></p><p><em>"I said leave. Don't make me repeat myself."</em></p><p>Defeated, I put my clothes on and left. My world felt empty, and I was crumbled… once again.</p><p>…</p><p>One day, I lurked in the parking lot, waiting for him to leave. He got into his car and drove off, while I followed him.</p><p>He snuck up behind me, pressing me down on the windshield like a cop reprimanding a criminal.</p><p><em>"I told you to stay away from me, but you wouldn't listen. I'll teach you not to mess with me."</em></p><p><em>"You thought you were the only one with secrets, huh?"</em></p><p>In that moment, I surrendered. We were both culpable.</p><p>…</p><p>We were like two peas in a pod — bound by a fatal attraction, with no compass pointing toward north. We had nothing to lose, nothing to gain…</p>`,
    });
    // Book 3: The Man Who Stole Hearts In Ibadan (Single)
    const [ibadanMan] = await db.insert(books).values({
      title: 'The Man Who Stole Hearts In Ibadan Ended Up Breaking One',
      slug: 'the-man-who-stole-hearts-in-ibadan',
      description: `<p><em>"Olatunji, if you can read this, I want you to know that it will never be well with you. All the men in Ibadan will break your children's hearts like you broke mine."</em></p><p>A gripping tale of heartbreak, deception, and a Nigerian woman who trusted the wrong man in Ibadan. Part love story, part cautionary tale, told with raw emotion and cultural authenticity.</p>`,
      categoryId: insertedCats['storytelling'],
      featured: true,
      bookType: 'single',
      status: 'published',
      publishedAt: new Date('2025-12-29'),
    }).returning({ id: books.id });
    await db.insert(chapters).values({
      bookId: ibadanMan.id, title: 'The Man Who Stole Hearts In Ibadan', slug: 'full-story', chapterOrder: 1, status: 'published', publishedAt: new Date('2025-12-29'),
      content: `<p>I remember how tired I was when I traveled by train that afternoon despite the heavy rain that came upon the unfortunate city of Ibadan.</p><p><em>"Be weary of those Ibadan men oo, don't let them deceive you, they don't know how to love or keep good things."</em></p><p>That was what she told me.</p><p><strong>Ah! I wish I had listened to Aunty Sade.</strong></p><p>I should've listened to the voice of an elderly woman who had seen shege in the hands of not just Ibadan men, but Ota, Mushin, and Akoka men.</p><p>Olatunji was no different. All he knew how to do was open my legs every night, after opening other women's legs by day.</p><p>The signs were always there. Na me no just get sense.</p><p>***</p><p><em>"Hello Miss. What do you make of your trip to my beautiful hometown?"</em> He said to me at the station upon arrival.</p><p>I ignored him at first, because I was upset about the rain, but I decided to reply to him.</p><p><em>"Your hometown? My first impression of it so far is very poor. My only hope is that something good comes out of it at the end of the day."</em></p><p><em>"And I will make sure of that. You've got the right one."</em> He said proudly.</p><p>Three days into my Ibadan stay, I decided to lower my guard and let Olatunji in. He took me to a very nice restaurant where we were eventually joined by three of his colleagues…</p><p><em>"So you're the Fola babe Tuntun has been talking about? You're even more beautiful than he described."</em> One of them, Seyi, said.</p><p>Alas, it was time to return to my hotel room, and he accompanied me.</p><p><em>"Would you like to come inside?"</em></p><p>I hadn't realised when the words came out of my mouth.</p><p><em>"I don't mind spending the night with you…"</em></p><p>He said as he quickly grabbed me by the waist and began kissing me with an urgent desire I hadn't detected on him, but couldn't deny I felt inside of me as well.</p><p>***</p><p>That was what he always said to me. I was such a fool to believe a professional playboy over my instincts.</p><p>My instincts screamed: <strong><em>Stay away from this 'too-good-to-be-true Ibadan man'</em></strong>… While my heart screamed: <strong><em>You may be wrong about him. Aunty Sade's experience is not yours, have fun.</em></strong></p><p>And what did I do? I listened to my stupid heart like a goat that doesn't leave when you chase it.</p><p>Who could've thought that Olatunji's so-called 'sister' was his side chick? Or that his 'mother' was his sugarmommy? Or worse, that his 'cousin' was the next-door-neighbor he fucked every Saturday?</p><p>Yes! Olatunji wasn't only a master manipulator, he was exceptionally skillful in his dealings with these women, such that he had a schedule for all of us. I was his 'Thursday-to-Friday' schedule.</p><p>***</p><p><em>"Listen to me,"</em> A woman's voice took over the call. <em>"Ola is my husband, we have 3 children, and I'm currently eight months pregnant. You better stop calling his phone and search elsewhere for who you're looking for."</em></p><p>She said and hung up on me. I had never felt so humiliated before.</p><p>I remember falling to the ground in Bodija market, Ibadan, rolling and crying like a woman in despair, because I really was.</p><p><em>"Dide ki o dekun didamu ara re!"</em> (Meaning: Get up and stop embarrassing yourself!)</p><p>An elderly woman shouted at me.</p><p>***</p><p>You see, Olatunji didn't just break my heart, collect money from me under false pretenses, play me so bad, or embarrass me. No. He broke a piece of me that I could never recover. A part of me that wished I had listened to the voice of wisdom — <strong>Aunty Sade.</strong></p><p>Finally, it is with a heavy heart, the unwavering support of my ancestors, and the curse that lies beneath Nigeria that I say:</p><p><strong><em>"Olatunji, if you can read this, I want you to know that it will never be well with you. All the men in Ibadan will break your children's hearts like you broke mine."</em></strong></p>`,
    });
    // Book 4: Whoredom Wasn't My First Sin (Single — multi-part story)
    const [whoredom] = await db.insert(books).values({
      title: "Whoredom Wasn't My First Sin",
      slug: 'whoredom-wasnt-my-first-sin',
      description: `<p><em>Before you dive in: This story is purely fictional. Yes, it's dark. Yes, it's raw. And yes, it feels real, but that's the point of storytelling.</em></p><p>A haunting, multi-layered fictional narrative about a woman shaped by abuse, betrayal, and survival. From childhood trauma to a life of dangerous choices, this story doesn't flinch. It confronts the cycle of pain with brutal honesty.</p>`,
      categoryId: insertedCats['storytelling'],
      featured: true,
      bookType: 'single',
      status: 'published',
      publishedAt: new Date('2025-11-27'),
    }).returning({ id: books.id });
    await db.insert(chapters).values({
      bookId: whoredom.id, title: "Whoredom Wasn't My First Sin", slug: 'full-story', chapterOrder: 1, status: 'published', publishedAt: new Date('2025-11-27'),
      content: `<p>Hi. My name is…</p><p>Well, does it really matter? Identity feels like a luxury I no longer recognize, so let's skip that part.</p><p>I want to talk about something I've never talked about before. It's something that's happened to me over the years, but I'm finally getting to share it with you.</p><p>I'm asking for one thing — kindness. Not sympathy, not pity. Just a little kindness in how you judge what you're about to read. Because getting here hasn't been easy.</p><h2>Part 1: Interactions With The Devil</h2><p>My father used to have this friend. Middle-aged, married, his stomach was like a drum, and his smiles looked deceptive. At first, his visits were normal, until they weren't. Until he started coming for me…</p><p>He'd call me outside at night, to his perfect hiding place, and the perfect crime scene. And then he'd test the boundaries of a child who didn't know what safety looked like. I knew it was wrong. My body knew, my mind knew. But I was a kid, and silence was the only language adults had taught me.</p><h2>Part 2: The Accidental Making of a Whore</h2><p>Abuse rewired my brain like faulty electricity, and I learned desire the wrong way… from predators, not partners. From boys who saw me alone in a dark corner and read that as permission.</p><p>No one noticed. No one asked. No one cared.</p><h2>Part 3: A Forbidden Affair</h2><p>By seventeen, I was living inside a shell of my own making. Pain felt familiar, so maybe that's why I kept ending up with men who could smell my vulnerability like perfume from a mile away.</p><p>Then there was Mr. Bayo who was an architect by profession, and an architect of my ruin by practice. He was older, powerful, experienced, and bored. He didn't seduce me… instead, he recruited me.</p><h2>Part 4: Hardcore, Softcore</h2><p>Then I met Tobi. He was pure, kind, and normal. A man who loved gently, he was a completely foreign breed of the male species I had ever met.</p><p>I wanted normalcy so badly it hurt.</p><p>But life laughed at me.</p><p>The day his family invited me over, I walked straight into hell. His father — the man who stole my childhood — sat smiling at me across the dinner table like we shared nothing in common.</p><p>You know, sometimes trauma doesn't knock at your door, it strolls in wearing agbada and shining its teeth like Baba Suwe.</p><h2>Part 5: Echoes of Shame</h2><p>I self-destructed the relationship with Tobi by sleeping with his best friend. I didn't cheat because I was wicked, rather, I cheated because chaos was the only rhythm I'd ever learned to dance to.</p><h2>Part 6: The Art of Submission</h2><p>Men were easy. Easily predictable, driven by desire and ego. I knew just how to weaponize both.</p><p>Submission was my artistry. Seduction was my strategy. Survival was my KPI.</p><h2>Part 7: Inflammable Passions</h2><p>One night, Ada dragged me to a party in Banana Island. Rich men, expensive cars, shallow conversations, all of that stuff… It was a marketplace of desire, and I was the most valuable item on display.</p>`,
    });
    // Book 5: My Secret Obsession — A Miniseries
    const [secretObsession] = await db.insert(books).values({
      title: 'My Secret Obsession: A Miniseries',
      slug: 'my-secret-obsession',
      description: `<p>A provocative miniseries that begins at a house party and spirals into uncharted territory. When a roommate's secret gets exposed, it triggers a chain of confessions, desires, and experiences that challenge everything the narrator thought she knew about herself.</p><p><em>Daring. Intimate. Boundary-pushing.</em></p>`,
      categoryId: insertedCats['erotica'],
      featured: false,
      bookType: 'series',
      status: 'published',
      publishedAt: new Date('2025-11-28'),
    }).returning({ id: books.id });
    await db.insert(chapters).values({
      bookId: secretObsession.id, title: 'Ep.1: My First Kink Experience', slug: 'ep-1-my-first-kink-experience', chapterOrder: 1, status: 'published', publishedAt: new Date('2025-11-28'),
      content: `<p>I went to a house party on a lovely Saturday night. I suppose you could say that I was bored, and my roommate forced me to go out with her.</p><p>She was the bubbly type — talkative, social, and annoyingly polite. I admired her from afar because she lived on vibes and extroversion, while I lived on caution.</p><p><em>"You need to meet people,"</em> she'd always say. <em>"Touch grass."</em></p><p>Well, congratulations to her, I touched more than grass that night.</p><p>The house was big, loud, and creeping with strangers. My anxiety shot through the roof instantly.</p><p>After what felt like two hours of suffering, I realized I couldn't find her. I spotted her earlier walking into one of the rooms with her boyfriend, so I wandered off to track them down. That was my first mistake… or maybe my first awakening.</p><p>As I approached the hallway leading to the balcony, I heard sounds. Pleasure, rhythm, breathlessness. I recognized the voice.</p><p><strong><em>My friend.</em></strong></p><p>And the door? It was wide open like a movie invitation.</p><p>Curiosity was already beating my morals, so I peeked in while pretending to check if anyone else was watching me be a pervert.</p><p><em>What was this new, sinful, ungodly electricity moving slowly through my body?</em></p><p>It was unusual, it felt forbidden, but I loved it.</p><p>…</p><p>Later, exhausted, I crashed on the bed. Sometime in the middle of the night, a warm touch pulled me out of sleep. It was soft, intentional… intimate.</p><p><em>"What are you doing?"</em> I whispered, confused.</p><p>She said nothing, just stared at me with this unreadable expression.</p><p>Then…</p><p><em>"I know it was you, babe. You were there."</em></p><p>My heart did a backflip.</p><p><em>"I see the way you look at me,"</em> she continued. <em>"The way you watch me undress. I've seen it."</em></p><p><em>"Do you find me attractive?"</em> she asked. <em>"Because if you do… that's okay."</em></p><p>She closed the space between us and pressed her lips against mine — it was slow, intense, and passionate. I melted into her without thinking.</p><p><em>"If it makes you feel better, I'm into you too."</em></p><p>I blinked. Trap? Or truth?</p>`,
    });
    // ═══════════════════════════════════════════════════
    // BLOG POSTS — Essays & Reflections from WordPress
    // ═══════════════════════════════════════════════════
    await db.insert(blogPosts).values([
      {
        title: 'My First Blog Post',
        slug: 'my-first-blog-post',
        excerpt: "Welcome! I'm super excited to start this journey with you all.",
        content: `<p>Welcome!</p><p>I'm super excited to start this journey with you all. It is with utmost pleasure that I ask you to stick around and create beautiful written memories with me!</p><p>I'm just getting this new blog going, so stay tuned for more. Subscribe below to get notified when I post new updates!</p>`,
        tags: 'introduction,welcome,blog',
        status: 'published',
        publishedAt: new Date('2019-12-01'),
      },
      {
        title: 'How to Get Over a Past Lover or Partner Who Has Clearly Moved On and Resisting the Urge to Text Them',
        slug: 'how-to-get-over-a-past-lover',
        excerpt: 'Getting over someone who has clearly moved on is one of the hardest emotional battles. Here are raw, honest reflections on healing.',
        content: `<p>Getting over someone who has moved on while you're still emotionally attached is one of life's cruelest exercises. The urge to text them — to reach out, check in, or simply remind them you exist — is overwhelming.</p><p>But here's the truth you don't want to hear: <strong>they've moved on.</strong> And every text you send is a step backward in your own healing.</p><p>The phone becomes your enemy. You draft messages you never send. You stalk their socials. You replay conversations looking for signs that maybe, just maybe, they still care.</p><p>They don't. Not in the way you need them to.</p><p><em>And that's okay.</em></p><p>Healing isn't linear. Some days you'll feel strong, and other days you'll find yourself crying over a song that reminds you of them. Both are valid.</p><p>But resist the urge. Put the phone down. Write in a journal instead. Call a friend. Go for a walk. Do anything but text that person who has already closed the chapter you're still reading.</p><p>You deserve someone who doesn't make you question your worth. Remember that.</p>`,
        tags: 'heartbreak,healing,relationships,love',
        status: 'published',
        publishedAt: new Date('2020-10-18'),
      },
      {
        title: 'Why Do I Miss Someone Who Hurt Me?',
        slug: 'why-do-i-miss-someone-who-hurt-me',
        excerpt: 'The paradox of missing someone who caused you pain — and why it doesn\'t make you weak.',
        content: `<p>It's a question that haunts so many of us: <strong>Why do I miss someone who hurt me?</strong></p><p>You'd think the pain would be enough to kill the longing. That the memories of tears, arguments, and betrayal would override the good times. But the heart doesn't work that way.</p><p>We miss them because love doesn't come with an off switch. We miss the version of them that made us feel seen, wanted, alive — even if that version was only part-time.</p><p>We miss the potential. The "what could have been." The person we believed they could become if they just tried a little harder.</p><p>But missing someone doesn't mean you should go back. It means you're human. It means the love was real, even if the relationship wasn't healthy.</p><p>Give yourself permission to grieve what you lost without romanticizing what it actually was.</p><p>You're not weak for missing them. You're strong for choosing yourself anyway.</p>`,
        tags: 'healing,love,heartbreak,emotional-healing',
        status: 'published',
        publishedAt: new Date('2020-12-27'),
      },
      {
        title: 'He Used To Be Infatuated With Me, What Happened?',
        slug: 'he-used-to-be-infatuated-with-me',
        excerpt: 'When the chase ends and the attention fades — understanding why men lose interest and what it means for you.',
        content: `<p><em>"I remember a few months back when this guy was so into me and kept chasing after me. He was literally begging for my attention. I made it obvious to him that I just wasn't interested but he was as stubborn as a goat. After a long time of chasing, I decided to give him a chance. Things went well, he was romantic and would chat me up regularly and we'd make out time where we'd meet up and sometimes we had sex. But a few months down the line, everything changed. He's no longer drawn to me like before and he seems to be busy an awful lot these days and barely has time for me."</em></p><p>Is this you? Does this scenario seem to resonate with you? I bet every woman, at some point, can relate…</p><p>So let's get to the bottom of this.</p><p>It's not uncommon for men who were once obsessively interested to suddenly pull back once they've "secured" the object of their affection. The thrill of the chase is often more intoxicating than the reality of the relationship itself.</p><p>Some men are driven by conquest, not connection. Once the challenge disappears, so does their interest. It's not about you — it's about their inability to sustain genuine emotional investment.</p><p>But here's what I need you to understand: <strong>you are not a prize to be won and then shelved.</strong> You deserve consistent love, not situational attention.</p>`,
        tags: 'relationships,love,dating,self-worth',
        status: 'published',
        publishedAt: new Date('2021-05-16'),
      },
      {
        title: 'Coping With Rejection: Unrequited Feelings (Pt.1)',
        slug: 'coping-with-rejection-unrequited-feelings',
        excerpt: 'What more can be as gut-wrenching as being rejected by someone you adore?',
        content: `<p><em>Dear Lord! What more can be as gut-wrenching as being rejected by someone you adore? Someone you like and have strong feelings for?</em></p><p>I know right, but sadly, it all boils down to accepting the fact that <strong>"HE'S JUST NOT THAT INTO YOU"</strong></p><p>Perhaps you can say "Goodness! that's her favourite phrase" lol and I'll probably tell you it's true.</p><p>It's important to note that you can't control how someone feels about you. So trying to convince someone to like you back isn't going to make them fall for you.</p><p>If you cut yourself off entirely, it can help sometimes, but I've found it only makes your heart ache anytime the memories of them come back. The best way I've found is to just accept that you feel the way you do and try to redirect that.</p><p>It's really unclear to me why we want the people who don't want us back. We're into people who aren't just that into us. And then I begin to wonder:</p><p>Is it because we're not used to the idea of being rejected? Is it because it's difficult for us to accept reality; therefore, we daydream and become so hopeful? <strong>OR</strong> Is it because we've allowed ourselves to fall deeply for these people, nurtured feelings for them and we convince ourselves that these feelings are shared and reciprocated?</p><p>It hurts when feelings that are developed are shared but not reciprocated, but it hurts even more when these feelings are shared but no answer is given. Then you're left in a shadow of doubt.</p>`,
        tags: 'rejection,unrequited-love,healing,self-worth',
        status: 'published',
        publishedAt: new Date('2021-06-22'),
      },
      {
        title: 'Can We Really Be True To Ourselves?',
        slug: 'can-we-really-be-true-to-ourselves',
        excerpt: "I've struggled, many times and in so many ways to prove that I could be true to myself but the farther my efforts go, the clearer it occurs to me that I could be living beneath my shadow.",
        content: `<p>Ava has been best pals with Tobi and Tish since high school. Now in college, Tish reveals her true feelings for Tobi to Ava. Ava is crushed. Being an expert in concealing her true emotions, she expresses excitement over the news and urges Tish to go for it.</p><p>But why is Ava taking all these in? Can't she open up and express her true feelings? Why does she have to sacrifice what she feels for the sake of peace?</p><p>This then introduces the question: <strong>Can We Really Be True To Ourselves?</strong></p><p>I don't think there's exactly a definitive answer to the question. I've struggled, many times and in so many ways to prove that I could be true to myself but the farther my efforts go, the clearer it occurs to me that I could be living beneath my shadow. I could be living an entire lie, clouded with a sheet of deceit, clothed in a crystal rays of disguise I call truth.</p><p>When you are being true to yourself, you are open and unapologetically honest about your feelings, values, and desires. It takes bravery to be authentic. You must be self-aware, truthful, objective, and fair in order to succeed.</p><p>So in essence, what this means is that you shouldn't be afraid to put yourself first as long as you're not hurting anyone.</p><p>Some recommendations:</p><p>– Practice introspection, every now and then.<br>– Self-talk. This helps affirm certain positive things you believe in.<br>– Say what you mean and mean what you say. Learn to say no, create healthy boundaries.<br>– Accept that you can't please everyone.<br>– Know what you want in life.<br>– Follow your guts or intuition.<br>– Do not waste your time on frivolities or friendships that yield you no good benefits.</p>`,
        tags: 'self-discovery,growth,authenticity,truth',
        status: 'published',
        publishedAt: new Date('2022-12-30'),
      },
      {
        title: 'You Are What You Eat',
        slug: 'you-are-what-you-eat',
        excerpt: 'At least that\'s what they say. Our bodies are a product of what we eat — here are key tips for better nutrition.',
        content: `<p><em>At least that's what they say.</em></p><p>I must say that I couldn't agree more with that statement. If you truly look at your environment and take the time to observe, you'll realise that our bodies are a product of what we eat.</p><p>Nutrition plays a crucial role in maintaining our overall health and well-being. Today, I'll briefly walk us through several key tips that can help improve your dietary habits.</p><h2>1. Balance Your Plate</h2><p>Plan a balanced diet by including a variety of food groups. A part of your plate should consist of fruits and vegetables, while the other should include whole grains and proteins.</p><h2>2. Add Protein To Every Meal</h2><p>Adding protein in each meal can help maintain blood sugar levels and give you satisfaction.</p><h2>3. "Rainbow" That Dish</h2><p>Transform your fruits intake and vegetables by going for a variety of colors. Different colors indicate different nutrients and antioxidants.</p><h2>4. Pick Whole Grains</h2><p>Replace refined grains with whole grains such as brown rice, quinoa, and whole wheat bread.</p><h2>5. Limit Added Sugars and Sodium</h2><p>Be mindful of added sugars in processed foods and beverages.</p><h2>6. Always Stay Hydrated</h2><p>See water as your primary beverage because it is very important to stay hydrated at all times.</p><h2>7. Incorporate Healthy Fats</h2><p>Focus on consuming healthy fats found in avocados, nuts, seeds, and olive oil.</p><h2>8. Increase Your Fiber Intake</h2><p>Fiber is essential for digestive health and can help lower cholesterol levels.</p><h2>9. Be Mindful Of Your Food Portions</h2><p>Take great care when it comes to food portion sizes to avoid overeating.</p><h2>10. Plan Your Meals</h2><p>Planning meals ahead of time can help you make healthier choices.</p><p>Always remember that small changes can lead to lasting results… It's all about taking the baby steps!</p><p><em>I hope this helps…</em> 😊🌹</p>`,
        tags: 'health,nutrition,wellness,self-care',
        status: 'published',
        publishedAt: new Date('2024-09-22'),
      },
      {
        title: "Analysing the Theme Of Abuse In Netflix's Special \"The Deliverance\"",
        slug: 'analyzing-the-theme-of-abuse-in-netflixs-the-deliverance',
        excerpt: 'I observe several disturbing, troubling, and inspiring themes that resonate throughout the film, touching on issues many of us can relate to.',
        content: `<p>In "The Deliverance" movie, I observe several disturbing, troubling, and inspiring themes that resonate throughout the film.</p><p>These themes touch on issues many of us can relate to, whether from personal experiences, reading, or conversations we've had with other people.</p><p>The prominent themes include various forms of Abuse (physical, mental, emotional, and psychological), a loveless home, a strained relationship between mother and daughter, the dynamics between a mother and her children, demonic possessions, a faithless life, a broken marriage, and the importance of a spiritual life.</p><p>The main character, a mother, is portrayed as violent and abusive, with a horrible relationship with her children. She exhibits a 'switch-up' personality — on rare occasions she's sweet, but most times, erratic.</p><p>One incident that struck me was a family dinner scene where a minor argument with her own mother escalated. When her youngest son made a comment, she hit him very hard in the face, causing him to bleed profusely.</p><p>This scene was deeply disturbing and upsetting, and I found myself speaking to the screen, grappling with my emotions.</p><p>As the plot unfolds, we see more dimensions of this woman's life. She is depicted as a struggling single mother with no external support, embodying bitterness and anger.</p><p><em>While I am empathetic by nature, I strive not to lose sight of the bigger picture. Understanding her past offers insight into her behavior, but it raises critical questions: Is it justifiable to treat others poorly based on one's own suffering?</em></p><p>Sympathy should not blind us to the need for accountability. People in her position need to be confronted about their harmful actions and guided toward help.</p><p>Dialogue, although often dismissed, is crucial for conflict resolution. Violence begets violence, and abusive parents often use it to exert control over their children.</p><p>My feelings toward this woman were conflicted: I acknowledged how much of a victim she was in the story, but quite frankly, it didn't deter the fact that she became the perpetrator.</p><p>I chose to focus on the theme of abuse, as it is frequently overlooked, downplayed, or glamorized.</p>`,
        tags: 'abuse,netflix,the-deliverance,film-analysis,society',
        status: 'published',
        publishedAt: new Date('2024-10-25'),
      },
    ]);
    // Page toggles
    const pages = [
      { pageKey: 'home', label: 'Home Page', enabled: true },
      { pageKey: 'books', label: 'Books', enabled: true },
      { pageKey: 'categories', label: 'Categories', enabled: true },
      { pageKey: 'author', label: 'Author', enabled: true },
      { pageKey: 'blog', label: 'Blog', enabled: true },
      { pageKey: 'search', label: 'Search', enabled: true },
      { pageKey: 'support', label: 'Support', enabled: true },
    ];
    for (const p of pages) {
      await db.insert(pageToggles).values(p);
    }
    return NextResponse.json({
      message: 'Seeded successfully!',
      admin: { email: 'admin@authorshelf.com', password: 'admin123' },
      data: {
        categories: catData.length,
        books: 5,
        blogPosts: 8,
        author: 'Site Author',
        siteName: 'AuthorShelf',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 });
  }
}
