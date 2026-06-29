// Cliente Supabase compartido por game.html y dashboard.html.
// La anon/publishable key está pensada para ser pública: el acceso real
// se controla con Row Level Security (ver SQL en el plan del proyecto).
const SUPABASE_URL = 'https://csrxhpsdibsxhbywposc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_iaSQyvifzRP0CWOWWIUEXA_jXY9tr5M';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function sbSignUp(email, password, alias) {
  return sb.auth.signUp({ email, password, options: { data: { alias } } });
}

async function sbSignIn(email, password) {
  return sb.auth.signInWithPassword({ email, password });
}

async function sbSignOut() {
  return sb.auth.signOut();
}

async function sbGetSession() {
  const { data } = await sb.auth.getSession();
  return data.session;
}

async function fetchSave(userId) {
  const { data, error } = await sb.from('saves').select('data').eq('user_id', userId).maybeSingle();
  if (error || !data) return null;
  return data.data;
}

async function upsertSave(userId, saveData) {
  return sb.from('saves').upsert({ user_id: userId, data: saveData, updated_at: new Date().toISOString() });
}

async function fetchProfile(userId) {
  const { data, error } = await sb.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) return null;
  return data;
}

async function upsertProfile(userId, profile) {
  return sb.from('profiles').upsert({ id: userId, updated_at: new Date().toISOString(), ...profile });
}

async function fetchLeaderboard(limit = 10) {
  const { data, error } = await sb.from('profiles').select('alias,level,honor,coins,race_wins').order('honor', { ascending: false }).limit(limit);
  if (error) return [];
  return data;
}
