📬 Pesaninaja
Aplikasi pesan/notifikasi berbasis web yang dibangun dengan React + Vite + TypeScript, menggunakan Supabase sebagai backend database dan autentikasi.
🌐 Live Demo: pesaninaja.vercel.app
---
🛠️ Tech Stack
React 18 + TypeScript
Vite — build tool
Tailwind CSS + shadcn/ui — UI components
Supabase — database, auth, realtime
TanStack Query — data fetching
React Router v6 — routing
Vercel — deployment
---
📋 Prasyarat
Pastikan sudah terinstall:
Node.js versi 18 ke atas
npm atau bun
Akun Supabase (gratis)
---
🍴 Cara Fork Repository
Fork berguna jika kamu ingin mengembangkan project ini di akun GitHub milikmu sendiri.
1. Fork di GitHub
Buka halaman repo ini: github.com/juztrezky2/pesaninaja
Klik tombol "Fork" di pojok kanan atas
Pilih akun GitHub milikmu sebagai tujuan fork
Tunggu beberapa detik hingga proses selesai
2. Clone Hasil Fork ke Lokal
```bash
# Ganti YOUR_USERNAME dengan username GitHub kamu
git clone https://github.com/YOUR_USERNAME/pesaninaja.git
cd pesaninaja
```
3. Tambahkan Remote Upstream (Opsional)
Agar kamu bisa mengambil update terbaru dari repo asli di kemudian hari:
```bash
git remote add upstream https://github.com/juztrezky2/pesaninaja.git

# Untuk sinkronisasi update dari repo asli:
git fetch upstream
git merge upstream/main
```
> Setelah fork & clone, lanjutkan ke langkah **Install Dependencies** di bawah.
---
🚀 Cara Clone & Setup
> Gunakan bagian ini jika kamu hanya ingin menjalankan project tanpa fork.
1. Clone Repository
```bash
git clone https://github.com/juztrezky2/pesaninaja.git
cd pesaninaja
```
2. Install Dependencies
```bash
npm install
# atau jika menggunakan bun
bun install
```
3. Buat Project Supabase Baru
Buka supabase.com dan login
Klik "New Project"
Isi nama project, password database, dan pilih region (disarankan: Southeast Asia - Singapore)
Tunggu hingga project selesai dibuat (~1–2 menit)
4. Ambil Credentials Supabase
Di dashboard project Supabase kamu:
Buka Settings → API
Catat nilai berikut:
Project URL → contoh: `https://abcdefgh.supabase.co`
Project ID → contoh: `abcdefgh`
anon / public key → string panjang dimulai dengan `eyJhbGci...`
5. Setup Environment Variable
Buat file `.env` di root folder project:
```bash
cp .env.example .env   # jika tersedia
# atau buat manual
```
Isi file `.env` dengan credentials Supabase milikmu:
```env
VITE_SUPABASE_URL=https://PROJECT_ID_KAMU.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=ANON_KEY_KAMU
VITE_SUPABASE_PROJECT_ID=PROJECT_ID_KAMU
```
> ⚠️ **Jangan commit file `.env` ke GitHub!** Pastikan `.env` sudah tercantum di `.gitignore`.
6. Jalankan Database Migrations
Repo ini menyertakan folder `supabase/migrations/` berisi semua skema tabel yang dibutuhkan.
Cara A — Via Supabase Dashboard (termudah):
Di Supabase dashboard, buka SQL Editor
Buka setiap file `.sql` di folder `supabase/migrations/` di repo ini
Copy-paste isinya ke SQL Editor, lalu klik Run (urutkan berdasarkan nama file / timestamp)
Cara B — Via Supabase CLI:
```bash
# Install Supabase CLI
npm install -g supabase

# Login ke Supabase
supabase login

# Link ke project barumu
supabase link --project-ref PROJECT_ID_KAMU

# Push semua migrations
supabase db push
```
7. Jalankan Aplikasi
```bash
npm run dev
# atau
bun dev
```
Buka browser di `http://localhost:8080`
---
📁 Struktur Folder
```
pesaninaja/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── integrations/
│   │   └── supabase/     # Supabase client & type definitions
│   ├── pages/            # Halaman aplikasi
│   └── main.tsx          # Entry point
├── supabase/
│   └── migrations/       # SQL schema migrations
├── .env                  # Environment variables (jangan di-commit!)
└── package.json
```
---
☁️ Deploy ke Vercel
Push kode ke GitHub
Buka vercel.com → New Project → Import repo ini
Di bagian Environment Variables, tambahkan:
Key	Value
`VITE_SUPABASE_URL`	`https://PROJECT_ID.supabase.co`
`VITE_SUPABASE_PUBLISHABLE_KEY`	Anon key Supabase
`VITE_SUPABASE_PROJECT_ID`	Project ID Supabase
Klik Deploy 🎉
---
🔒 Catatan Keamanan
Jangan pernah meng-commit file `.env` ke repository publik
Gunakan anon key (bukan `service_role` key) untuk environment variable di frontend
Aktifkan Row Level Security (RLS) di Supabase untuk melindungi data
---
🤝 Kontribusi
Pull request sangat diterima! Untuk perubahan besar, silakan buka issue terlebih dahulu.
---
📄 Lisensi
MIT License — bebas digunakan dan dimodifikasi.
