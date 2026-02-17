import { supabase } from "../lib/supabaseCient";

export default function Login() {
  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error("Error signing in with Google:", error.message);
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 space-y-6 border border-zinc-200 dark:border-zinc-800">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to manage your bookmarks securely
          </p>
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all duration-200 font-medium text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-5 h-5"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.1 0 5.9 1.1 8.1 3.1l6.1-6.1C34.3 2.4 29.5 0 24 0 14.6 0 6.6 5.8 2.7 14.1l7.4 5.7C12 13.2 17.5 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.4c-.5 2.7-2 5-4.3 6.6l6.6 5.1c3.9-3.6 7.4-9 7.4-15.7z"
            />
            <path
              fill="#4A90E2"
              d="M10.1 28.4c-1-2.9-1-6 0-8.9l-7.4-5.7C.9 17.3 0 20.6 0 24c0 3.4.9 6.7 2.7 10.2l7.4-5.8z"
            />
            <path
              fill="#FBBC05"
              d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-6.6-5.1c-2 1.3-4.6 2-9.3 2-6.5 0-12-3.7-13.9-9.3l-7.4 5.8C6.6 42.2 14.6 48 24 48z"
            />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
