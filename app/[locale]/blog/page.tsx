import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { isLocale, locales, type Locale } from "@/i18n/routing";
import { localeAlternates } from "@/i18n/metadata";
import {
  getPublishedPosts,
  getLocalizedPost,
  formatDate,
} from "@/lib/supabase/queries";

export const revalidate = 300;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safe: Locale = isLocale(locale) ? locale : "fr";
  const isEn = safe === "en";

  return {
    title: isEn
      ? "Blog & photo guides — wedding & engagement advice"
      : "Blog & guides photo — conseils mariage & fiançailles",
    description: isEn
      ? "Practical guides, planning tips and photography advice from Youssef Production, photographer in Marrakech: weddings, engagements, events."
      : "Guides pratiques, idées d'organisation et conseils photo de Youssef Production, photographe à Marrakech : mariage, fiançailles, événements.",
    alternates: localeAlternates(safe, "/blog"),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("blog");
  const rawPosts = await getPublishedPosts();
  const posts = rawPosts.map((p) => getLocalizedPost(p, locale));

  const isEn = locale === "en";

  return (
    <div className="bg-white px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-xs uppercase tracking-[0.35em] text-zinc-400">
          {t("title")}
        </p>
        <h1 className="mt-4 text-center font-display text-4xl font-semibold text-zinc-900 sm:text-5xl">
          {isEn ? "Photo Guides & Advice" : "Guides & conseils photo"}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-center text-lg text-zinc-500">
          {t("description")}
        </p>

        {posts.length === 0 ? (
          <p className="mt-16 rounded-2xl border border-zinc-100 p-10 text-center text-zinc-400">
            {t("empty")}
          </p>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-2xl border border-zinc-100 bg-white transition-all hover:-translate-y-0.5 hover:border-zinc-200 hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                  {post.cover_image ? (
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-display text-4xl text-zinc-300">
                      YP
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                    {formatDate(post.created_at, locale as Locale)}
                  </p>
                  <h2 className="mt-2 text-xl font-medium leading-snug text-zinc-900">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2.5 text-[15px] leading-relaxed text-zinc-500">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}