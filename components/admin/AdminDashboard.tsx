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
import MessagesManager from "./MessagesManager";
import AccountSettings from "./AccountSettings";
import { PORTFOLIO_CATEGORIES } from "@/lib/categories";
import type { Work, Review } from "@/lib/supabase/queries";

const CATEGORIES = [...PORTFOLIO_CATEGORIES];

type Tab = "messages" | "works" | "reviews" | "blog" | "faq" | "account";

const TAB_CONFIG: { key: Tab; label: string; icon: React.ReactNode }[] = [
  {
    key: "messages",
    label: "Messages",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    key: "works",
    label: "Travaux",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    ),
  },
  {
    key: "reviews",
    label: "Avis",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    ),
  },
  {
    key: "blog",
    label: "Blog",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    key: "faq",
    label: "FAQ",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    key: "account",
    label: "Compte",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

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

/* ── Language tab component for bilingual forms ── */

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
          {l === "fr" ? "🇫🇷 Français" : "🇬🇧 English"}
        </button>
      ))}
    </div>
  );
}

/* ── Photo grid ── */

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
        <p className="text-sm text-white/50">
          <span className="font-medium text-white/80">{photos.length}</span>{" "}
          photo{photos.length > 1 ? "s" : ""}
          {photos.length > 0 && (
            <span className="text-white/30">
              {" "}
              — la première est la couverture
            </span>
          )}
        </p>
        {onUpload && (
          <label className="cursor-pointer rounded-lg border border-dashed border-white/20 px-4 py-2 text-xs text-white/50 transition-colors hover:border-amber-400/50 hover:text-amber-400">
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
              className="group relative aspect-square overflow-hidden rounded-lg bg-white/5"
            >
              <Image
                src={url}
                alt={`Photo ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-zinc-900">
                  Couverture
                </span>
              )}
              <div className="absolute right-1 top-1 flex gap-1">
                <button
                  type="button"
                  onClick={() => onMove(i, i - 1)}
                  disabled={i === 0}
                  aria-label={`Déplacer la photo ${i + 1} avant`}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-[11px] text-white transition-colors hover:bg-black/80 disabled:opacity-25"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => onMove(i, i + 1)}
                  disabled={i === photos.length - 1}
                  aria-label={`Déplacer la photo ${i + 1} après`}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-[11px] text-white transition-colors hover:bg-black/80 disabled:opacity-25"
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
        <p className="mt-3 rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-white/30">
          Aucune photo pour le moment.
        </p>
      )}
    </div>
  );
}

/* ── Stat card ── */
function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/40">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ── Main dashboard ── */

export default function AdminDashboard({ userEmail }: { userEmail?: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("messages");
  const [works, setWorks] = useState<Work[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Add-work form
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(0);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [editingPhotos, setEditingPhotos] = useState<string | null>(null);
  const [draftPhotos, setDraftPhotos] = useState<string[]>([]);
  const [workLang, setWorkLang] = useState<"fr" | "en">("fr");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Edit-work modal state
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [editLang, setEditLang] = useState<"fr" | "en">("fr");
  const [editTitle, setEditTitle] = useState("");
  const [editTitleEn, setEditTitleEn] = useState("");
  const [editCategory, setEditCategory] = useState<string>(CATEGORIES[0]);
  const [editLocation, setEditLocation] = useState("");
  const [editEventDate, setEditEventDate] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDescriptionEn, setEditDescriptionEn] = useState("");
  const [editVideoUrl, setEditVideoUrl] = useState("");
  const [editUploadingVideo, setEditUploadingVideo] = useState(false);
  const editVideoInputRef = useRef<HTMLInputElement>(null);

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

  async function handleVideoUpload(file: File, isEdit = false) {
    if (!file) return;
    if (isEdit) setEditUploadingVideo(true);
    else setUploadingVideo(true);

    try {
      const formData = new FormData();
      formData.append("video", file);

      const res = await fetch("/api/admin/video-upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Échec du téléversement de la vidéo");
      }

      if (isEdit) {
        setEditVideoUrl(data.url);
      } else {
        setVideoUrl(data.url);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      alert("Erreur upload vidéo : " + msg);
    } finally {
      if (isEdit) {
        setEditUploadingVideo(false);
        if (editVideoInputRef.current) editVideoInputRef.current.value = "";
      } else {
        setUploadingVideo(false);
        if (videoInputRef.current) videoInputRef.current.value = "";
      }
    }
  }

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
    const payload = {
      title: title.trim(),
      title_en: titleEn.trim() || null,
      category,
      description: description.trim() || null,
      description_en: descriptionEn.trim() || null,
      location: location.trim() || null,
      event_date: eventDate || null,
      image_urls: images,
      video_url: videoUrl.trim() || null,
    };

    let { error } = await supabase.from("works").insert(payload);
    if (error && error.message.includes("video_url")) {
      const { video_url, ...legacy } = payload;
      const retry = await supabase.from("works").insert(legacy);
      error = retry.error;
      if (!error) {
        alert("Travail créé ! Note : exécutez le script supabase/006-works-video.sql pour enregistrer les vidéos dans la base.");
      }
    }

    if (error) {
      alert(error.message);
      return;
    }
    setTitle("");
    setTitleEn("");
    setDescription("");
    setDescriptionEn("");
    setLocation("");
    setEventDate("");
    setImages([]);
    setVideoUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
    await load();
  }

  function openWorkEditor(work: Work) {
    setEditingWork(work);
    setEditLang("fr");
    setEditTitle(work.title || "");
    setEditTitleEn(work.title_en || "");
    setEditCategory(work.category || CATEGORIES[0]);
    setEditLocation(work.location || "");
    setEditEventDate(work.event_date ? work.event_date.split("T")[0] : "");
    setEditDescription(work.description || "");
    setEditDescriptionEn(work.description_en || "");
    setEditVideoUrl(work.video_url || "");
  }

  async function saveEditedWork(e: React.FormEvent) {
    e.preventDefault();
    if (!editingWork || !editTitle.trim()) return;
    const supabase = createClient();
    const payload = {
      title: editTitle.trim(),
      title_en: editTitleEn.trim() || null,
      category: editCategory,
      location: editLocation.trim() || null,
      event_date: editEventDate || null,
      description: editDescription.trim() || null,
      description_en: editDescriptionEn.trim() || null,
      video_url: editVideoUrl.trim() || null,
    };

    let { error } = await supabase
      .from("works")
      .update(payload)
      .eq("id", editingWork.id);

    if (error && error.message.includes("video_url")) {
      const { video_url, ...legacy } = payload;
      const retry = await supabase
        .from("works")
        .update(legacy)
        .eq("id", editingWork.id);
      error = retry.error;
    }

    if (error) {
      alert("Erreur mise à jour : " + error.message);
      return;
    }

    setEditingWork(null);
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

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/25 outline-none transition-all duration-200 focus:border-amber-400/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-amber-400/20";

  return (
    <div className="relative flex min-h-screen bg-zinc-950">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(251,191,36,0.06),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-zinc-950/95 backdrop-blur-xl transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/10">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-amber-400">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Youssef</p>
            <p className="text-[11px] text-white/40">Administration</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto text-white/40 hover:text-white lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {TAB_CONFIG.map((t) => {
              const isActive = tab === t.key;
              const badge =
                t.key === "reviews" && pending.length > 0
                  ? pending.length
                  : null;

              return (
                <button
                  key={t.key}
                  onClick={() => {
                    setTab(t.key);
                    setSidebarOpen(false);
                  }}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-amber-400/10 text-amber-400"
                      : "text-white/50 hover:bg-white/5 hover:text-white/80"
                  }`}
                >
                  <span className={`transition-colors ${isActive ? "text-amber-400" : "text-white/30 group-hover:text-white/50"}`}>
                    {t.icon}
                  </span>
                  {t.label}
                  {badge && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-[10px] font-bold text-zinc-950">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-600 text-sm font-semibold text-zinc-900">
              {(userEmail?.charAt(0) || "A").toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white/80">
                {userEmail ?? "admin"}
              </p>
              <p className="text-[11px] text-white/30">Administrateur</p>
            </div>
            <button
              onClick={signOut}
              title="Se déconnecter"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/5 hover:text-red-400"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="relative flex-1 overflow-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-white/10 bg-zinc-950/80 px-4 sm:px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <h1 className="text-base sm:text-lg font-semibold text-white">
              {TAB_CONFIG.find((t) => t.key === tab)?.label ?? "Tableau de bord"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span className="hidden sm:inline">Voir le site</span>
            </a>
          </div>
        </header>

        {/* Content area */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="flex flex-col items-center gap-4">
                <svg className="h-8 w-8 animate-spin text-amber-400" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                </svg>
                <p className="text-sm text-white/40">Chargement...</p>
              </div>
            </div>
          ) : tab === "messages" ? (
            <>
              <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <StatCard
                  label="Travaux publiés"
                  value={works.length}
                  icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>}
                />
                <StatCard
                  label="Avis publiés"
                  value={approved.length}
                  icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" /></svg>}
                />
                <StatCard
                  label="En attente"
                  value={pending.length}
                  icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
                />
              </div>
              <MessagesManager />
            </>
          ) : tab === "works" ? (
            <div className="space-y-8">
              {/* Add work form */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Ajouter un travail</h2>
                  <LangTabs lang={workLang} setLang={setWorkLang} />
                </div>
                <form onSubmit={addWork} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {workLang === "fr" ? (
                      <input
                        key="title-fr"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Titre (ex: Mariage de Salma & Karim)"
                        required
                        className={inputClass}
                      />
                    ) : (
                      <input
                        key="title-en"
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                        placeholder="Title in English (e.g. Salma & Karim's Wedding)"
                        className={inputClass}
                      />
                    )}
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={inputClass}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c} className="bg-zinc-900">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Lieu (ex: Riad, Marrakech)"
                      className={inputClass}
                    />
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  {workLang === "fr" ? (
                    <textarea
                      key="desc-fr"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description en français (facultatif)"
                      rows={3}
                      className={inputClass}
                    />
                  ) : (
                    <textarea
                      key="desc-en"
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      placeholder="Description in English (optional)"
                      rows={3}
                      className={inputClass}
                    />
                  )}
                  <div>
                    <label className="cursor-pointer rounded-xl border border-dashed border-white/15 px-5 py-3 text-sm text-white/40 transition-colors hover:border-amber-400/40 hover:text-amber-400">
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
                      <p className="mt-2 text-xs text-white/40">
                        {uploadDone} photo(s) envoyée(s)…
                      </p>
                    )}
                    {uploadErrors.length > 0 && (
                      <div className="mt-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                        <p className="text-xs font-medium text-red-400">
                          {uploadErrors.length} photo(s) n&apos;ont pas pu être envoyées :
                        </p>
                        <ul className="mt-1 list-inside list-disc text-xs text-red-300/80">
                          {uploadErrors.slice(0, 5).map((e) => (
                            <li key={e}>{e}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p className="mt-3 text-xs text-white/25">
                      Les photos sont automatiquement compressées pour accélérer le site.
                    </p>
                  </div>

                  {/* Video upload section (Cloudflare R2) */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="flex items-center gap-2 text-sm font-medium text-white">
                          <svg viewBox="0 0 24 24" className="h-4 w-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                          Vidéo / Film du travail (Cloudflare R2)
                        </h3>
                        <p className="mt-0.5 text-xs text-white/40">
                          Optionnel : téléversez un teaser, film de mariage ou vidéo drone
                        </p>
                      </div>
                      {videoUrl && (
                        <button
                          type="button"
                          onClick={() => setVideoUrl("")}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                          ✕ Retirer la vidéo
                        </button>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <label className="cursor-pointer rounded-xl border border-dashed border-amber-400/30 bg-amber-400/5 px-4 py-2.5 text-xs font-medium text-amber-300 transition-colors hover:border-amber-400/60 hover:bg-amber-400/10">
                        {uploadingVideo ? "Téléversement vers Cloudflare..." : "+ Uploader une vidéo (MP4 / MOV)"}
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/mp4,video/quicktime,video/webm"
                          className="hidden"
                          disabled={uploadingVideo}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleVideoUpload(file, false);
                          }}
                        />
                      </label>

                      <span className="text-xs text-white/30">ou coller l&apos;URL :</span>

                      <input
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://pub-...r2.dev/works/film.mp4"
                        className="flex-1 min-w-[200px] rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/25 outline-none focus:border-amber-400"
                      />
                    </div>

                    {videoUrl && (
                      <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-black max-w-sm">
                        <video src={videoUrl} controls preload="metadata" className="w-full aspect-video object-cover" />
                        <div className="p-2 text-[11px] text-white/50 truncate flex items-center justify-between">
                          <span className="text-amber-400 font-medium">✓ Vidéo Cloudflare attachée</span>
                          <span className="truncate max-w-[180px]">{videoUrl}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={uploading || uploadingVideo}
                    className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition-all duration-200 hover:from-amber-300 hover:to-amber-400 hover:shadow-lg hover:shadow-amber-500/20 disabled:opacity-50"
                  >
                    Publier le travail
                  </button>
                </form>
              </div>

              {/* Works list */}
              <div>
                <h2 className="mb-4 text-lg font-semibold text-white">
                  Travaux publiés ({works.length})
                </h2>
                {works.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-white/30">
                    Aucun travail publié. Ajoutez votre premier travail !
                  </p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {works.map((work) => (
                      <div
                        key={work.id}
                        className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-200 hover:border-white/20"
                      >
                        <div className="relative aspect-[4/3] bg-white/5">
                          {work.image_urls[0] && (
                            <Image
                              src={work.image_urls[0]}
                              alt={work.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                          <div className="absolute left-2 top-2 z-10 flex items-center gap-1.5">
                            {work.video_url && (
                              <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2 py-0.5 text-[10px] font-bold text-zinc-950 shadow-md">
                                <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-current"><polygon points="6 4 18 12 6 20 6 4" /></svg>
                                Vidéo
                              </span>
                            )}
                          </div>
                          <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                            {work.image_urls.length} photo
                            {work.image_urls.length > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="p-4">
                          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-amber-400/70">
                            {work.category}
                          </p>
                          <h3 className="mt-1 font-medium text-white">
                            {work.title}
                          </h3>
                          {work.title_en && (
                            <p className="mt-0.5 text-xs text-white/30">
                              EN: {work.title_en}
                            </p>
                          )}
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => openWorkEditor(work)}
                              className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-400/20"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => {
                                if (editingPhotos === work.id) {
                                  setEditingPhotos(null);
                                } else {
                                  openPhotoEditor(work);
                                }
                              }}
                              className="flex-1 rounded-lg border border-white/10 py-2 text-xs text-white/60 transition-colors hover:border-white/20 hover:text-white"
                            >
                              {editingPhotos === work.id
                                ? "Fermer"
                                : "Photos"}
                            </button>
                            <button
                              onClick={() => deleteWork(work)}
                              className="rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-400 transition-colors hover:bg-red-500/10"
                            >
                              Supprimer
                            </button>
                          </div>

                          {editingPhotos === work.id && (
                            <div className="mt-4 border-t border-white/10 pt-4">
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
                                  className="flex-1 rounded-lg bg-amber-400 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-300 disabled:opacity-50"
                                >
                                  Enregistrer
                                </button>
                                <button
                                  onClick={() => openPhotoEditor(work)}
                                  disabled={uploading}
                                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 transition-colors hover:border-white/20"
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
            <div className="space-y-8">
              {/* Pending reviews */}
              <div>
                <h2 className="mb-4 text-lg font-semibold text-white">
                  En attente de validation ({pending.length})
                </h2>
                {pending.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-white/30">
                    Aucun avis en attente.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pending.map((r) => (
                      <div
                        key={r.id}
                        className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.03] p-5 backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-600 text-sm font-semibold text-zinc-900">
                              {(r.name.charAt(0) || "?").toUpperCase()}
                            </div>
                            <p className="font-medium text-white">{r.name}</p>
                          </div>
                          <Stars rating={r.rating} />
                        </div>
                        {r.feedback && (
                          <p className="mt-3 text-sm leading-relaxed text-white/60 italic">&ldquo;{r.feedback}&rdquo;</p>
                        )}
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => approveReview(r.id)}
                            className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-400"
                          >
                            Approuver
                          </button>
                          <button
                            onClick={() => deleteReview(r.id)}
                            className="rounded-lg border border-red-500/20 px-5 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
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
                <h2 className="mb-4 text-lg font-semibold text-white">
                  Avis publiés ({approved.length})
                </h2>
                {approved.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-white/30">
                    Aucun avis publié encore.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {approved.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-start justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-600 text-sm font-semibold text-zinc-900">
                            {(r.name.charAt(0) || "?").toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <p className="font-medium text-white">{r.name}</p>
                              <Stars rating={r.rating} />
                            </div>
                            {r.feedback && (
                              <p className="mt-2 text-sm text-white/50">{r.feedback}</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteReview(r.id)}
                          className="shrink-0 rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/10"
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
            <PostsManager />
          ) : tab === "faq" ? (
            <FaqManager />
          ) : (
            <AccountSettings userEmail={userEmail} />
          )}
        </div>
      </div>

      {/* Edit Work Modal */}
      {editingWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-zinc-900 p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Modifier le travail
                </h2>
                <p className="text-xs text-white/40 mt-0.5">
                  ID: {editingWork.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingWork(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveEditedWork} className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white/60">Contenu bilingue</span>
                <LangTabs lang={editLang} setLang={setEditLang} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {editLang === "fr" ? (
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Titre (FR)</label>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                      placeholder="Titre en français"
                      className={inputClass}
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Title (EN)</label>
                    <input
                      value={editTitleEn}
                      onChange={(e) => setEditTitleEn(e.target.value)}
                      placeholder="Title in English"
                      className={inputClass}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Catégorie</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className={inputClass}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-zinc-900">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Lieu</label>
                  <input
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="Lieu (ex: Riad, Marrakech)"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Date de l&apos;événement</label>
                  <input
                    type="date"
                    value={editEventDate}
                    onChange={(e) => setEditEventDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {editLang === "fr" ? (
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Description (FR)</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={3}
                    placeholder="Description en français..."
                    className={inputClass}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Description (EN)</label>
                  <textarea
                    value={editDescriptionEn}
                    onChange={(e) => setEditDescriptionEn(e.target.value)}
                    rows={3}
                    placeholder="Description in English..."
                    className={inputClass}
                  />
                </div>
              )}

              {/* Video upload in edit modal */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Vidéo du travail (Cloudflare R2)
                  </span>
                  {editVideoUrl && (
                    <button
                      type="button"
                      onClick={() => setEditVideoUrl("")}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      ✕ Retirer la vidéo
                    </button>
                  )}
                </div>

                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer rounded-lg border border-dashed border-amber-400/30 bg-amber-400/5 px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-400/10 transition-colors">
                    {editUploadingVideo ? "Téléversement..." : "+ Remplacer / Uploader vidéo"}
                    <input
                      ref={editVideoInputRef}
                      type="file"
                      accept="video/mp4,video/quicktime,video/webm"
                      className="hidden"
                      disabled={editUploadingVideo}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleVideoUpload(file, true);
                      }}
                    />
                  </label>
                  <input
                    value={editVideoUrl}
                    onChange={(e) => setEditVideoUrl(e.target.value)}
                    placeholder="https://pub-...r2.dev/..."
                    className="flex-1 min-w-[180px] rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/20 outline-none focus:border-amber-400"
                  />
                </div>

                {editVideoUrl && (
                  <div className="mt-2.5 overflow-hidden rounded-lg border border-white/10 bg-black max-w-xs">
                    <video src={editVideoUrl} controls preload="metadata" className="w-full aspect-video object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingWork(null)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={editUploadingVideo}
                  className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2 text-sm font-semibold text-zinc-950 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}