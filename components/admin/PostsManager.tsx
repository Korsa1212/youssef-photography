"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slug";
import { revalidateNow } from "@/lib/revalidate";
import type { Post } from "@/lib/supabase/queries";

export default function PostsManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
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
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
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
    const { error } = await supabase.from("posts").insert({
      title: title.trim(),
      slug,
      excerpt: excerpt.trim() || null,
      content: content.trim(),
      cover_image: cover,
    });
    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }
    setTitle("");
    setExcerpt("");
    setContent("");
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
      <form
        onSubmit={addPost}
        className="rounded-2xl border border-zinc-100 bg-white p-6"
      >
        <h2 className="font-medium text-zinc-900">Nouvel article</h2>
        <div className="mt-4 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de l'article"
            required
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition-colors focus:border-zinc-400"
          />
          <input
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Résumé (affiché sur la page Blog, facultatif)"
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition-colors focus:border-zinc-400"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"Contenu de l'article...\n\nSéparez les paragraphes par une ligne vide."}
            rows={8}
            required
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition-colors focus:border-zinc-400"
          />
          <div>
            <label className="cursor-pointer rounded-full border border-dashed border-zinc-300 px-5 py-3 text-sm text-zinc-500 transition-colors hover:border-zinc-500">
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
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm text-white"
                >
                  ×
                </button>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
          >
            {saving ? "Publication..." : "Publier l'article"}
          </button>
        </div>
      </form>

      <div>
        <h2 className="mb-4 font-medium text-zinc-900">
          Articles ({posts.length})
        </h2>
        {loading ? (
          <p className="text-sm text-zinc-400">Chargement...</p>
        ) : posts.length === 0 ? (
          <p className="rounded-2xl border border-zinc-100 bg-white p-8 text-center text-sm text-zinc-400">
            Aucun article publié.
          </p>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-100 bg-white p-5"
              >
                <div className="min-w-0">
                  <p className="font-medium text-zinc-900">{post.title}</p>
                  <p className="mt-0.5 truncate text-sm text-zinc-400">
                    /blog/{post.slug} ·{" "}
                    {new Date(post.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <button
                  onClick={() => deletePost(post)}
                  className="shrink-0 rounded-full border border-red-100 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
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