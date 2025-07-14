# Intern Test Aksamedia Fullstack

Repositori ini dibuat untuk keperluan tes internship fullstack di Aksamedia.

## Catatan
Jika menemukan bug, silakan buat **issue** atau **pull request** langsung di repository ini. Karena project ini dikerjakan dalam waktu sehari, harap maklum jika masih ada kekurangan.

## Struktur Project
- `backend/` : Source code backend (Laravel)
- `frontend/` : Source code frontend (React + Vite)

## Cara Menjalankan

### Backend
1. Masuk folder backend:  
   `cd backend`
2. Copy `.env.example` ke `.env` lalu sesuaikan.
3. Install dependencies:  
   `composer install`  
   `npm install`
4. Jalankan migrasi database (jika perlu):  
   `php artisan migrate`
5. Jalankan backend:  
   `php artisan serve`

### Frontend
1. Masuk folder frontend:  
   `cd frontend`
2. Copy `.env.example` ke `.env` lalu sesuaikan.
3. Install dependencies:  
   `npm install`
4. Jalankan frontend:  
   `npm run dev`

## Teknologi
- Backend: Laravel
- Frontend: React + Vite
- Deployment demo: Vercel  
  [https://intern-test-aksamedia-fullstack.vercel.app](https://intern-test-aksamedia-fullstack.vercel.app)

---

Terima kasih sudah berkunjung ke repository ini! 🚀  
Jika ingin berdiskusi atau memberi masukan, jangan ragu menggunakan fitur issue/pull request.
