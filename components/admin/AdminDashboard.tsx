"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { revalidateNow } from "@/lib/revalidate";
import { optimizeImage, isSupportedImage } from "@/lib/image";
import Stars from "../Stars";
import PostsManager from "./PostsManager";
import FaqManager from "./FaqManager";
import AccountSettings from "./AccountSettings";
import type { Work, Review } from "@/lib/supabase/queries";

const CATEGORIES = ["Mariage", "Fiançailles", "Événements", "Autre"];

type Tab = "works" | "reviews" | "blog" | "faq" | "account";

function pathFromUrl(url: string): string | null {
  const marker = "/object/public/works/";
  const i = url.indexOf(marker);
  return i === -1 ? null : url.slice(i + marker.length);
}

async function fetchWorksAndReviews() {
  const supabase = createClient();
  const [{ data: worksData }, { data: reviewsData }] = await Promise.all([
    supabase
      .from("works")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);
  return {
    works: (worksData ?? []) as Work[],
    reviews: (reviewsData ?? []) as Review[],
  };
}

function PhotoGrid({
  photos,
  onRemove,
  onMove,
  onUpload,
  uploading = false,
  maxHeight = "max-h-72",
}: {
  photos: string[];
  onRemove: (index: number) => void;
  onMove: (from: number, to: number) => void;
  onUpload?: (files: FileList | null) => void;
  uploading?: boolean;
  maxHeight?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-600">
          <span className="font-medium text-zinc-900">{photos.length}</span>{" "}
          photo{photos.length > 1 ? "s" : ""}
          {photos.length > 0 && (
            <span className="text-zinc-400">
              {" "}
              — la première est la couverture
            </span>
          )}
        </p>
        {onUpload && (
          <label className="cursor-pointer rounded-full border border-dashed border-zinc-300 px-4 py-2 text-xs text-zinc-500 transition-colors hover:border-zinc-500">
            {uploading ? "Upload..." : "+ Ajouter"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => onUpload(e.target.files)}
            />
          </label>
        )}
      </div>

      {photos.length > 0 ? (
        <div
          className={`mt-3 grid grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4 ${maxHeight}`}
        >
          {photos.map((url, i) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-lg bg-zinc-100"
            >
              <Image
                src={url}
                alt={`Photo ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-zinc-900">
                  Couverture
                </span>
              )}
              <div className="absolute right-1 top-1 flex gap-1">
                <button
                  type="button"
                  onClick={() => onMove(i, i - 1)}
                  disabled={i === 0}
                  aria-label={`Déplacer la photo ${i + 1} avant`}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900/70 text-[11px] text-white transition-colors hover:bg-zinc-900 disabled:opacity-25"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => onMove(i, i + 1)}
                  disabled={i === photos.length - 1}
                  aria-label={`Déplacer la photo ${i + 1} après`}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900/70 text-[11px] text-white transition-colors hover:bg-zinc-900 disabled:opacity-25"
                >
                  →
                </button>
              </div>
              <button
                type="button"
                onClick={() => onRemove(i)}
                aria-label={`Supprimer la photo ${i + 1}`}
                className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 rounded-xl border border-dashed border-zinc-200 p-6 text-center text-sm text-zinc-400">
          Aucune photo pour le moment.
        </p>
      )}
    </div>
  );
}

export default function AdminDashboard({ userEmail }: { userEmail?: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("works");
  const [works, setWorks] = useState<Work[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Add-work form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(0);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [editingPhotos, setEditingPhotos] = useState<string | null>(null);
  const [draftPhotos, setDraftPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const data = await fetchWorksAndReviews();
    setWorks(data.works);
    setReviews(data.reviews);
    revalidateNow();
  }, []);

  useEffect(() => {
    let active = true;
    fetchWorksAndReviews().then((data) => {
      if (!active) return;
      setWorks(data.works);
      setReviews(data.reviews);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  async function uploadOne(file: File) {
    if (!isSupportedImage(file)) {
      throw new Error("ce n'est pas une photo");
    }
    const supabase = createClient();
    const optimized = await optimizeImage(file);
    const path = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}-${optimized.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabase.storage
      .from("works")
      .upload(path, optimized, { cacheControl: "3600" });
    if (error) throw new Error(error.message);
    const { data } = await supabase.storage.from("works").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadDone(0);
    setUploadErrors([]);
    let done = 0;
    const ok: string[] = [];
    const failed: string[] = [];

    const queue = Array.from(files);
    const workers = Array.from(
      { length: Math.min(4, queue.length) },
      async () => {
        while (queue.length > 0) {
          const file = queue.shift();
          if (!file) return;
          try {
            ok.push(await uploadOne(file));
          } catch (e) {
            failed.push(
              `${file.name} — ${e instanceof Error ? e.message : "échec"}`,
            );
          }
          done += 1;
          setUploadDone(done);
        }
      },
    );
    await Promise.all(workers);

    setImages((prev) => [...prev, ...ok]);
    setUploadErrors(failed);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function addWork(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const supabase = createClient();
    const { error } = await supabase.from("works").insert({
      title: title.trim(),
      category,
      description: description.trim() || null,
      location: location.trim() || null,
      event_date: eventDate || null,
      image_urls: images,
    });
    if (error) {
      alert(error.message);
      return;
    }
    setTitle("");
    setDescription("");
    setLocation("");
    setEventDate("");
    setImages([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    await load();
  }

  function moveIn(list: string[], from: number, to: number) {
    if (to < 0 || to >= list.length) return list;
    const next = [...list];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
  }

  function openPhotoEditor(work: Work) {
    setEditingPhotos(work.id);
    setDraftPhotos(work.image_urls);
  }

  async function saveDraftPhotos(work: Work) {
    const supabase = createClient();
    const { error } = await supabase
      .from("works")
      .update({ image_urls: draftPhotos })
      .eq("id", work.id);
    if (error) {
      alert(error.message);
      return;
    }
    setEditingPhotos(null);
    await load();
  }

  async function addPhotosToWork(work: Work, files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const queue = Array.from(files);
    const added: string[] = [];
    const failed: string[] = [];
    const workers = Array.from(
      { length: Math.min(4, queue.length) },
      async () => {
        while (queue.length > 0) {
          const file = queue.shift();
          if (!file) return;
          try {
            added.push(await uploadOne(file));
          } catch (e) {
            failed.push(
              `${file.name} — ${e instanceof Error ? e.message : "échec"}`,
            );
          }
        }
      },
    );
    await Promise.all(workers);
    setDraftPhotos((prev) => [...prev, ...added]);
    setUploadErrors(failed);
    setUploading(false);
  }

  async function deleteWork(work: Work) {
    if (!confirm(`Supprimer « ${work.title} » ?`)) return;
    const supabase = createClient();
    for (const url of work.image_urls) {
      const path = pathFromUrl(url);
      if (path) await supabase.storage.from("works").remove([path]);
    }
    await supabase.from("works").delete().eq("id", work.id);
    await load();
  }

  async function approveReview(id: string) {
    const supabase = createClient();
    await supabase.from("reviews").update({ approved: true }).eq("id", id);
    await load();
  }

  async function deleteReview(id: string) {
    if (!confirm("Supprimer cet avis ?")) return;
    const supabase = createClient();
    await supabase.from("reviews").delete().eq("id", id);
    await load();
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const pending = reviews.filter((r) => !r.approved);
  const approved = reviews.filter((r) => r.approved);

  return (
    <div className="bg-zinc-50 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-zinc-900">
              Tableau de bord
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Connecté : {userEmail ?? "admin"}
            </p>
          </div>
          <button
            onClick={signOut}
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-400"
          >
            Se déconnecter
          </button>
        </div>

        <div className="mt-8 flex gap-2">
          {(
            [
              ["works", "Travaux"],
              ["reviews", `Avis${pending.length ? ` (${pending.length})` : ""}`],
              ["blog", "Blog"],
              ["faq", "FAQ"],
              ["account", "Compte"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-full px-5 py-2 text-sm transition-colors ${
                tab === key
                  ? "bg-zinc-900 text-white"
                  : "bg-white text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="py-20 text-center text-zinc-400">Chargement...</p>
        ) : tab === "works" ? (
          <div className="mt-8 space-y-8">
            {/* Add work */}
            <form
              onSubmit={addWork}
              className="rounded-2xl border border-zinc-100 bg-white p-6"
            >
              <h2 className="font-medium text-zinc-900">Ajouter un travail</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre (ex: Mariage de Salma & Karim)"
                  required
                  className="rounded-xl border border-zinc-200 px-4 py-2.5 outline-none transition-colors focus:border-zinc-400"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 outline-none transition-colors focus:border-zinc-400"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Lieu (ex: Riad, Marrakech)"
                  className="rounded-xl border border-zinc-200 px-4 py-2.5 outline-none transition-colors focus:border-zinc-400"
                />
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="rounded-xl border border-zinc-200 px-4 py-2.5 outline-none transition-colors focus:border-zinc-400"
                />
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (facultatif)"
                rows={3}
                className="mt-4 w-full rounded-xl border border-zinc-200 px-4 py-2.5 outline-none transition-colors focus:border-zinc-400"
              />
              <div className="mt-4">
                <label className="cursor-pointer rounded-full border border-dashed border-zinc-300 px-5 py-3 text-sm text-zinc-500 transition-colors hover:border-zinc-500">
                  {uploading
                    ? "Upload en cours..."
                    : "+ Ajouter des photos (plusieurs possibles)"}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </label>
                <PhotoGrid
                  photos={images}
                  uploading={uploading}
                  onUpload={handleFiles}
                  onRemove={(i) =>
                    setImages(images.filter((_, j) => j !== i))
                  }
                  onMove={(from, to) => setImages(moveIn(images, from, to))}
                />
                {uploadDone > 0 && uploading && (
                  <p className="mt-2 text-xs text-zinc-500">
                    {uploadDone} photo(s) envoyée(s)…
                  </p>
                )}
                {uploadErrors.length > 0 && (
                  <div className="mt-2 rounded-xl border border-red-100 bg-red-50 p-3">
                    <p className="text-xs font-medium text-red-700">
                      {uploadErrors.length} photo(s) n&apos;ont pas pu être
                      envoyées :
                    </p>
                    <ul className="mt-1 list-inside list-disc text-xs text-red-600">
                      {uploadErrors.slice(0, 5).map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="mt-3 text-xs text-zinc-400">
                  Les photos sont automatiquement compressées pour accélérer le
                  site. Elles deviennent visibles dès la publication.
                </p>
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="mt-5 rounded-full bg-zinc-900 px-6 py-2.5 text-sm text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
              >
                Publier le travail
              </button>
            </form>

            {/* Works list */}
            <div>
              <h2 className="mb-4 font-medium text-zinc-900">
                Travaux publiés ({works.length})
              </h2>
              {works.length === 0 ? (
                <p className="rounded-2xl border border-zinc-100 bg-white p-8 text-center text-sm text-zinc-400">
                  Aucun travail publié. Ajoutez votre premier travail !
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {works.map((work) => (
                    <div
                      key={work.id}
                      className="overflow-hidden rounded-2xl border border-zinc-100 bg-white"
                    >
                      <div className="relative aspect-[4/3] bg-zinc-100">
                        {work.image_urls[0] && (
                          <Image
                            src={work.image_urls[0]}
                            alt={work.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                          />
                        )}
                        <span className="absolute right-2 top-2 rounded-full bg-zinc-900/75 px-2.5 py-1 text-[10px] font-medium text-white">
                          {work.image_urls.length} photo
                          {work.image_urls.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="p-4">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                          {work.category}
                        </p>
                        <h3 className="mt-1 font-medium text-zinc-900">
                          {work.title}
                        </h3>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => {
                              if (editingPhotos === work.id) {
                                setEditingPhotos(null);
                              } else {
                                openPhotoEditor(work);
                              }
                            }}
                            className="flex-1 rounded-full border border-zinc-200 py-2 text-sm text-zinc-700 transition-colors hover:border-zinc-400"
                          >
                            {editingPhotos === work.id
                              ? "Fermer"
                              : "Gérer les photos"}
                          </button>
                          <button
                            onClick={() => deleteWork(work)}
                            className="rounded-full border border-red-100 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                          >
                            Supprimer
                          </button>
                        </div>

                        {editingPhotos === work.id && (
                          <div className="mt-4 border-t border-zinc-100 pt-4">
                            <PhotoGrid
                              photos={draftPhotos}
                              uploading={uploading}
                              maxHeight="max-h-60"
                              onUpload={(files) => addPhotosToWork(work, files)}
                              onRemove={(i) =>
                                setDraftPhotos(
                                  draftPhotos.filter((_, j) => j !== i),
                                )
                              }
                              onMove={(from, to) =>
                                setDraftPhotos(moveIn(draftPhotos, from, to))
                              }
                            />
                            <div className="mt-4 flex gap-2">
                              <button
                                onClick={() => saveDraftPhotos(work)}
                                disabled={uploading}
                                className="flex-1 rounded-full bg-zinc-900 py-2 text-sm text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
                              >
                                Enregistrer
                              </button>
                              <button
                                onClick={() => openPhotoEditor(work)}
                                disabled={uploading}
                                className="rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-400"
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : tab === "reviews" ? (
          <div className="mt-8 space-y-6">
            {/* Pending reviews */}
            <div>
              <h2 className="mb-4 font-medium text-zinc-900">
                En attente de validation ({pending.length})
              </h2>
              {pending.length === 0 ? (
                <p className="rounded-2xl border border-zinc-100 bg-white p-8 text-center text-sm text-zinc-400">
                  Aucun avis en attente.
                </p>
              ) : (
                <div className="space-y-4">
                  {pending.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-2xl border border-amber-100 bg-white p-5"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-zinc-800">
                          {r.name}
                        </p>
                        <Stars rating={r.rating} />
                      </div>
                      {r.feedback && (
                        <p className="mt-2 text-sm text-zinc-600">{r.feedback}</p>
                      )}
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => approveReview(r.id)}
                          className="rounded-full bg-emerald-600 px-4 py-2 text-sm text-white transition-colors hover:bg-emerald-500"
                        >
                          Approuver
                        </button>
                        <button
                          onClick={() => deleteReview(r.id)}
                          className="rounded-full border border-red-100 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                        >
                          Refuser
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Approved reviews */}
            <div>
              <h2 className="mb-4 font-medium text-zinc-900">
                Avis publiés ({approved.length})
              </h2>
              {approved.length === 0 ? (
                <p className="rounded-2xl border border-zinc-100 bg-white p-8 text-center text-sm text-zinc-400">
                  Aucun avis publié encore.
                </p>
              ) : (
                <div className="space-y-4">
                  {approved.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-start justify-between rounded-2xl border border-zinc-100 bg-white p-5"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-medium text-zinc-800">
                            {r.name}
                          </p>
                          <Stars rating={r.rating} />
                        </div>
                        {r.feedback && (
                          <p className="mt-2 text-sm text-zinc-600">{r.feedback}</p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteReview(r.id)}
                        className="rounded-full border border-red-100 px-3 py-1.5 text-xs text-red-600 transition-colors hover:bg-red-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : tab === "blog" ? (
          <div className="mt-8">
            <PostsManager />
          </div>
        ) : tab === "faq" ? (
          <div className="mt-8">
            <FaqManager />
          </div>
        ) : (
          <AccountSettings userEmail={userEmail} />
        )}
      </div>
    </div>
  );
}