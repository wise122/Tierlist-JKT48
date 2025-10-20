<div align="center">
  <h1 style="font-size: 3em">🎌 Tierlist JKT48</h1>
</div>

<div align="center">
  <h2>Tierlist JKT48 Web Application</h2>
  <p>
    Tierlist JKT48 adalah proyek berbasis web yang memungkinkan penggemar JKT48 untuk membuat peringkat anggota/setlist favorit mereka dengan mudah dan interaktif. Terinspirasi oleh alat pemeringkat seperti <a href="https://tiermaker.com/">TierMaker</a> dan <a href="https://jkt48membersorter.vercel.app">JKT48 Member Sorter</a>, proyek ini bertujuan untuk memberikan pengalaman yang menyenangkan bagi para penggemar dalam menyusun tier list mereka sendiri.
  </p>
</div>

## ✨ Fitur Utama

<div>
  <ul>
    <li>🖼️ <strong>Antarmuka Interaktif:</strong> Seret dan lepas gambar anggota/setlist JKT48 untuk menyusun peringkat sesuai keinginan Anda.</li>
    <li>📝 <strong>Kustomisasi Label Tier:</strong> Ubah nama setiap tier sesuai preferensi pribadi Anda.</li>
    <li>📤 <strong>Ekspor dan Bagikan:</strong> Simpan tier list Anda sebagai gambar</li>
    <li>🔄 <strong>Pembaruan Berkala:</strong> Daftar anggota diperbarui secara rutin untuk mencerminkan perubahan terbaru dalam formasi JKT48.</li>
  </ul>
</div>

## 🚀 Cara Menggunakan

<div>
  <ol>
    <li>Kunjungi <strong>Halaman Proyek:</strong> <a href="https://tierlist-member-jkt-48.vercel.app">Tierlist Member JKT48</a></li>
    <li>Susun Tier List: Seret gambar anggota/setlist ke tier yang diinginkan.</li>
    <li>Kustomisasi: Ubah nama tier sesuai keinginan Anda.</li>
    <li>Simpan atau Bagikan: Ekspor tier list Anda sebagai gambar atau Screenshot untuk hasil lebih baik, lalu bagikan!</li>
  </ol>
</div>

## 🛠️ Teknologi yang Digunakan

<div>
  <ul>
    <li><strong>HTML5 & CSS3:</strong> Struktur dan desain halaman.</li>
    <li><strong>JavaScript:</strong> Logika interaktif untuk drag-and-drop dan penyimpanan data.</li>
    <li><strong>TierMaker API:</strong> Untuk inspirasi dan referensi dalam pembuatan tier list.</li>
  </ul>
</div>

## 🤝 Kontribusi

<div>
  <p>
    Kontribusi sangat diterima! Jika Anda memiliki ide, saran, atau ingin menambahkan fitur baru, silakan fork repositori ini dan ajukan pull request.

  Note: Bila ada kesalahan nama, foto, generasi member, atau setlist silahkan hubungi saya di <a href="https://x.com/criscrosbre">https://x.com/criscrosbre</a>
  </p>
</div>

## 📄 Lisensi

<div>
  <p>
    Proyek ini dilisensikan di bawah <a href="https://github.com/MrcellSbst/Tierlist-JKT48/blob/main/LICENSE">MIT License</a>.
  </p>
</div>

# JKT48 This or That Game

## Environment Setup

### Local Development
1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Get your Supabase credentials:
   - Go to your Supabase project dashboard
   - Click on Settings -> API
   - Copy the following values:
     - Project URL (from "Project Configuration")
     - anon/public key (from "Project API keys")
     - service_role key (Optional, from "Project API keys")

3. Update `.env.local` with your actual credentials

### Vercel Deployment
1. Go to your Vercel project dashboard
2. Navigate to Settings -> Environment Variables
3. Add the following environment variables:
   - `REACT_APP_SUPABASE_URL`: Your Supabase project URL
   - `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anon/public key
4. Deploy your project

⚠️ IMPORTANT: 
- Never commit `.env.local` to version control
- Always use Vercel's Environment Variables for production deployments
- Keep your Supabase keys secure and rotate them if they ever get exposed
