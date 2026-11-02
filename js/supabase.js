// ===== Supabase bağlantısı =====
// Publishable key tarayıcıda kullanılmak için tasarlandı; burada durmasında sakınca yok.
// Secret key'i ASLA buraya yazma.
const SUPABASE_URL = 'https://vwtporujbmfpksbakbvz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PSKAJPmlN3y-XCs4dZ-TtA_n5n6eQZw';

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);