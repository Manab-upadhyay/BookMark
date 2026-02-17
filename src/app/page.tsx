"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseCient";
import { getBookmarks, addBookmark, deleteBookmark } from "./lib/bookmark";
import Login from "./auth/login";
interface Bookmark {
  id: string;
  title: string;
  url: string;
  created_at: string;
}

export default function Page() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        const data = await getBookmarks();
        setBookmarks(data);
      } catch (err: any) {
        setErrorMsg(err.message);
      }
    }

    fetchData();
  }, [user]);
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("bookmarks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
        },
        (payload) => {
          console.log("Realtime event:", payload);

          if (payload.eventType === "INSERT") {
            setBookmarks((prev) => {
              // avoid duplicates
              if (prev.find((b) => b.id === payload.new.id)) return prev;
              return [payload.new as Bookmark, ...prev];
            });
          }

          if (payload.eventType === "DELETE") {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  async function handleAdd() {
    if (!title || !url) {
      setErrorMsg("Title and URL are required.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const newBookmark = await addBookmark(title, url);

      setBookmarks((prev) => [newBookmark, ...prev]);

      setTitle("");
      setUrl("");
    } catch (err: any) {
      setErrorMsg("Failed to add bookmark.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteBookmark(id);
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      setErrorMsg("Failed to delete bookmark.");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (!user) {
    return <Login />;
  }
  console.log(bookmarks);
  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Bookmarks</h1>
        <button
          onClick={handleLogout}
          className="text-sm bg-blue-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-600 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Error */}
      {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Title"
          className="border p-2 flex-1 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL"
          className="border p-2 flex-1 rounded"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-blue-600 text-white px-4 rounded"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {bookmarks.length === 0 && (
          <p className="text-gray-500">No bookmarks yet.</p>
        )}

        {bookmarks.map((b) => (
          <div
            key={b.id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <div>
              <p className="font-semibold">{b.title}</p>
              <a href={b.url} target="_blank" className="text-blue-600 text-sm">
                {b.url}
              </a>
            </div>
            <button
              onClick={() => handleDelete(b.id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
