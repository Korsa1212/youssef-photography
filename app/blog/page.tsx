import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Blog & Guides",
  description:
    "Guides pratiques, conseils photo et inspirations de Youssef Production, photographe à Marrakech.",
};

export const revalidate = 300;

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="bg-white px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-xs uppercase tracking-[0.35em] text-zinc-400">
          Blog
        </p>
        <h1 className="mt-4 text-center font-display text-4xl font-semibold text-zinc-900 sm:text-5xl">
          Guides & conseils photo
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-center text-lg text-zinc-500">
          Conseils pratiques, idées de lieux et réponses à vos questions sur la
          photo de mariage, de fiançailles et d&apos;événement à Marrakech.
        </p>

        {posts.length === 0 ? (
          <p className="mt-16 rounded-2xl border border-zinc-100 p-10 text-center text-zinc-400">
            Les articles arrivent bientôt.
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
                    {new Date(post.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
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