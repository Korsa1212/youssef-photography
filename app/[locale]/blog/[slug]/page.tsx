import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { isLocale, locales, type Locale } from "@/i18n/routing";
import { localeAlternates } from "@/i18n/metadata";
import { absoluteUrl } from "@/lib/seo";
import {
  getPostBySlug,
  getPublishedPosts,
  getLocalizedPost,
  formatDate,
} from "@/lib/supabase/queries";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return locales.flatMap((locale) =>
    posts.map((post) => ({
      locale,
      slug: locale === "en" && post.slug_en ? post.slug_en : post.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const safe: Locale = isLocale(locale) ? locale : "fr";
  const rawPost = await getPostBySlug(slug);
  if (!rawPost) return { title: safe === "en" ? "Article not found" : "Article introuvable" };
  const post = getLocalizedPost(rawPost, safe);

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: localeAlternates(safe, `/blog/${post.slug}`),
    openGraph: {
      type: "article",
      title: `${post.title} — Youssef Production`,
      description: post.excerpt ?? undefined,
      url: absoluteUrl(`/${safe}/blog/${post.slug}`),
      publishedTime: post.created_at,
      images: post.cover_image
        ? [{ url: absoluteUrl(post.cover_image), alt: post.title }]
        : [],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const rawPost = await getPostBySlug(slug);
  if (!rawPost) notFound();
  const post = getLocalizedPost(rawPost, locale);

  const isEn = locale === "en";

  const paragraphs = post.content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.cover_image ? absoluteUrl(post.cover_image) : undefined,
    datePublished: post.created_at,
    author: {
      "@type": "Person",
      name: "Youssef Production",
    },
    publisher: {
      "@type": "Organization",
      name: "Youssef Production",
    },
  };

  return (
    <div className="bg-white px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <div className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="text-sm text-zinc-400 transition-colors hover:text-zinc-900"
        >
          {isEn ? "← Back to blog" : "← Retour au blog"}
        </Link>

        <p className="mt-8 text-xs uppercase tracking-[0.25em] text-zinc-400">
          {formatDate(post.created_at, locale as Locale)}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-zinc-900 sm:text-5xl">
          {post.title}
        </h1>

        {post.cover_image && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-zinc-100">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              preload
              className="object-cover"
            />
          </div>
        )}

        <article className="mt-8 space-y-5 text-[17px] leading-relaxed text-zinc-600">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>

        <div className="mt-14 rounded-2xl bg-zinc-900 p-10 text-center">
          <h2 className="font-display text-2xl font-semibold text-white">
            {isEn ? "Ready to create your memories?" : "Prêt à créer vos souvenirs ?"}
          </h2>
          <p className="mt-3 text-white/80">
            {isEn
              ? "Book your session or wedding coverage on WhatsApp."
              : "Réservez votre séance ou votre reportage sur WhatsApp."}
          </p>
          <a
            href="https://wa.me/212696819328"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-white px-7 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            {isEn ? "Book on WhatsApp" : "Réserver via WhatsApp"}
          </a>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/portfolio"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-900"
          >
            {isEn ? "View my portfolio →" : "Voir mes réalisations →"}
          </Link>
        </div>
      </div>
    </div>
  );
}