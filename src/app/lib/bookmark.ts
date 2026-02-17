import { supabase } from "./supabaseCient";

export async function getBookmarks() {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching bookmarks:", error.message);
    return [];
  }
  return data;
}
export async function addBookmark(title: string, url: string) {
  const { data: bookmark, error } = await supabase
    .from("bookmarks")
    .insert({ title, url })
    .select()
    .single();
  if (error) {
    console.error("Error adding bookmark:", error.message);
    return null;
  }
  return bookmark;
}
export async function deleteBookmark(id: string) {
  const { error } = await supabase.from("bookmarks").delete().eq("id", id);
  if (error) {
    console.error("Error deleting bookmark:", error.message);
    return false;
  }
  return true;
}
