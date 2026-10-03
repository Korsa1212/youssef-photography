"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slug";
import { revalidateNow } from "@/lib/revalidate";
import { optimizeImage } from "@/lib/image";
import type { Post } from "@/lib/supabase/queries";

function LangTabs({
  lang,
  setLang,
}: {
  lang: "fr" | "en";
  setLang: (l: "fr" | "en") => void;
}) {
  return (
    <div className="flex rounded-lg border border-white/10 bg-white/5 p-0.5">
      {(["fr", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`rounded-md px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
            lang === l
              ? "bg-amber-400 text-zinc-950 shadow-sm"
              : "text-white/50 hover:text-white/80"
          }`}
        >
          {l === "fr" ? "🇫🇷 FR" : "🇬🇧 EN"}
        </button>
      ))}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/25 outline-none transition-all duration-200 focus:border-amber-400/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-amber-400/20";

export default function PostsManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"fr" | "en">("fr");

  // FR fields
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  // EN fields
  const [titleEn, setTitleEn] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [contentEn, setContentEn] = useState("");

  const [cover, setCover] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!active) return;
        setPosts((data ?? []) as Post[]);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleCover(files: FileList | null) {
    const original = files?.[0];
    if (!original) return;
    setUploading(true);
    const supabase = createClient();
    const file = await optimizeImage(original);
    const path = `cover-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabase.storage
      .from("works")
      .upload(path, file, { cacheControl: "3600" });
    if (error) {
      alert("Erreur d'upload : " + error.message);
      setUploading(false);
      return;
    }
    const { data } = await supabase.storage.from("works").getPublicUrl(path);
    setCover(data.publicUrl);
    setUploading(false);
  }

  async function addPost(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    const supabase = createClient();
    const slug = slugify(title);
    const { data: existing } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (existing) {
      alert("Un article avec ce même titre existe déjà — changez le titre.");
      setSaving(false);
      return;
    }
    const slugEn = titleEn.trim() ? slugify(titleEn) : null;
    const { error } = await supabase.from("posts").insert({
      title: title.trim(),
      title_en: titleEn.trim() || null,
      slug,
      slug_en: slugEn,
      excerpt: excerpt.trim() || null,
      excerpt_en: excerptEn.trim() || null,
      content: content.trim(),
      content_en: contentEn.trim() || null,
      cover_image: cover,
    });
    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }
    setTitle("");
    setTitleEn("");
    setExcerpt("");
    setExcerptEn("");
    setContent("");
    setContentEn("");
    setCover(null);
    setSaving(false);
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts((data ?? []) as Post[]);
    revalidateNow();
  }

  async function deletePost(post: Post) {
    if (!confirm(`Supprimer « ${post.title} » ?`)) return;
    const supabase = createClient();
    await supabase.from("posts").delete().eq("id", post.id);
    setPosts((p) => p.filter((x) => x.id !== post.id));
    revalidateNow();
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Nouvel article</h2>
          <LangTabs lang={lang} setLang={setLang} />
        </div>
        <form onSubmit={addPost} className="space-y-4">
          {lang === "fr" ? (
            <>
              <input
                key="title-fr"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de l'article"
                required
                className={inputClass}
              />
              <input
                key="excerpt-fr"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Résumé (affiché sur la page Blog, facultatif)"
                className={inputClass}
              />
              <textarea
                key="content-fr"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={"Contenu de l'article...\n\nSéparez les paragraphes par une ligne vide."}
                rows={8}
                required
                className={inputClass}
              />
            </>
          ) : (
            <>
              <input
                key="title-en"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Article title in English"
                className={inputClass}
              />
              <input
                key="excerpt-en"
                value={excerptEn}
                onChange={(e) => setExcerptEn(e.target.value)}
                placeholder="Excerpt / summary in English (optional)"
                className={inputClass}
              />
              <textarea
                key="content-en"
                value={contentEn}
                onChange={(e) => setContentEn(e.target.value)}
                placeholder={"Article content in English...\n\nSeparate paragraphs with an empty line."}
                rows={8}
                className={inputClass}
              />
            </>
          )}
          <div>
            <label className="cursor-pointer rounded-xl border border-dashed border-white/15 px-5 py-3 text-sm text-white/40 transition-colors hover:border-amber-400/40 hover:text-amber-400">
              {uploading ? "Upload en cours..." : "+ Image de couverture (facultatif)"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleCover(e.target.files)}
              />
            </label>
            {cover && (
              <div className="relative mt-3 h-32 w-48">
                <Image
                  src={cover}
                  alt="Couverture"
                  fill
                  sizes="192px"
                  className="rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCover(null)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm text-white shadow-lg"
                >
                  ×
                </button>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition-all duration-200 hover:from-amber-300 hover:to-amber-400 hover:shadow-lg hover:shadow-amber-500/20 disabled:opacity-50"
          >
            {saving ? "Publication..." : "Publier l'article"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Articles ({posts.length})
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <svg className="h-6 w-6 animate-spin text-amber-400" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
              <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
            </svg>
          </div>
        ) : posts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-white/30">
            Aucun article publié.
          </p>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-200 hover:border-white/15"
              >
                <div className="min-w-0">
                  <p className="font-medium text-white">{post.title}</p>
                  {post.title_en && (
                    <p className="mt-0.5 text-xs text-white/30">EN: {post.title_en}</p>
                  )}
                  <p className="mt-1 truncate text-sm text-white/30">
                    /blog/{post.slug} ·{" "}
                    {new Date(post.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <button
                  onClick={() => deletePost(post)}
                  className="shrink-0 rounded-lg border border-red-500/20 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}