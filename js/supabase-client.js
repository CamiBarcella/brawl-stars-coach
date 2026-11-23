// Cliente Supabase y helpers. Requiere:
// - js/supabase-config.js (define window.SUPABASE_URL y window.SUPABASE_ANON_KEY)
// - CDN de @supabase/supabase-js v2 cargado antes de este archivo.

(function () {
  const url = window.SUPABASE_URL;
  const key = window.SUPABASE_ANON_KEY;
  const configured =
    typeof url === "string" &&
    typeof key === "string" &&
    url.startsWith("https://") &&
    !url.includes("YOUR_PROJECT") &&
    key &&
    !key.includes("YOUR_SUPABASE_ANON_KEY");

  const client = configured && window.supabase ? window.supabase.createClient(url, key) : null;

  function notConfiguredResult() {
    return { data: null, error: new Error("Supabase no está configurado. Edita js/supabase-config.js y ejecuta supabase/schema.sql.") };
  }

  async function getSession() {
    if (!client) return { data: { session: null }, error: null };
    return client.auth.getSession();
  }

  async function getUser() {
    const { data } = await getSession();
    return data?.session?.user || null;
  }

  function onAuthChange(callback) {
    if (!client) return { data: { subscription: { unsubscribe() {} } } };
    return client.auth.onAuthStateChange((_event, session) => callback(session?.user || null, session));
  }

  async function signUp({ email, password, username }) {
    if (!client) return notConfiguredResult();
    return client.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split("@")[0],
          display_name: username || email.split("@")[0]
        }
      }
    });
  }

  async function signIn({ email, password }) {
    if (!client) return notConfiguredResult();
    return client.auth.signInWithPassword({ email, password });
  }

  async function signOut() {
    if (!client) return notConfiguredResult();
    return client.auth.signOut();
  }

  async function getProfile(userId) {
    if (!client) return notConfiguredResult();
    return client.from("profiles").select("*").eq("id", userId).maybeSingle();
  }

  async function upsertProfile(profile) {
    if (!client) return notConfiguredResult();
    return client.from("profiles").upsert(profile, { onConflict: "id" }).select().maybeSingle();
  }

  async function getCourseProgress(userId) {
    if (!client) return notConfiguredResult();
    return client.from("course_progress").select("*").eq("user_id", userId);
  }

  async function upsertLessonProgress(row) {
    if (!client) return notConfiguredResult();
    return client.from("course_progress").upsert(row, { onConflict: "user_id,lesson_id" }).select().maybeSingle();
  }

  async function saveQuizAttempt(attempt) {
    if (!client) return notConfiguredResult();
    return client.from("quiz_attempts").insert(attempt).select().maybeSingle();
  }

  async function getQuizAttempts(userId) {
    if (!client) return notConfiguredResult();
    return client.from("quiz_attempts").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(20);
  }

  async function getBrawlerStats(userId) {
    if (!client) return notConfiguredResult();
    return client.from("user_brawler_stats").select("*").eq("user_id", userId).order("updated_at", { ascending: false });
  }

  async function addBrawlerStat(row) {
    if (!client) return notConfiguredResult();
    return client.from("user_brawler_stats").insert(row).select().maybeSingle();
  }

  async function deleteBrawlerStat(id, userId) {
    if (!client) return notConfiguredResult();
    return client.from("user_brawler_stats").delete().eq("id", id).eq("user_id", userId);
  }

  window.BSAuth = {
    client,
    configured,
    getSession,
    getUser,
    onAuthChange,
    signUp,
    signIn,
    signOut,
    getProfile,
    upsertProfile,
    getCourseProgress,
    upsertLessonProgress,
    saveQuizAttempt,
    getQuizAttempts,
    getBrawlerStats,
    addBrawlerStat,
    deleteBrawlerStat
  };
})();
