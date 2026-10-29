# RoboKreasi — Platform Web Pembelajaran Robotika Edukatif

RoboKreasi adalah platform pembelajaran robotika edukatif berbahasa Indonesia berbasis web untuk siswa jenjang SD–SMP. Platform ini memadukan pemrograman visual (*block coding* berbasis Google Blockly), simulator virtual robot interaktif, dan materi pembelajaran berbasis proyek.

---

## 🛠️ Stack Teknologi

- **Backend:** Laravel 11 / 13 (PHP 8.3 / 8.4)
- **Frontend:** React + TypeScript, Inertia.js, Vite, Tailwind CSS
- **Block Coding:** Google Blockly
- **Database:** MySQL 8.0+

---

## 🚀 Panduan Instalasi & Setup Lokal

### 1. Prasyarat Sistem
- PHP >= 8.3 (dengan ekstensi `pdo_mysql`, `pdo_sqlite`, `mbstring`, `json`, `intl`)
- Composer
- Node.js >= 20 & npm
- MySQL Server 8.0+ (misal via Herd, Laragon, atau XAMPP)

### 2. Kloning & Pengaturan Branch
```bash
git clone https://github.com/rifareza09/Robonusa.git
cd Robonusa
git checkout feature/backend-database
```

### 3. Konfigurasi Environment (`.env`)
Salin file `.env.example` ke `.env` jika belum ada:
```bash
cp .env.example .env
```
Sesuaikan konfigurasi database MySQL:
```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=robokreasi
DB_USERNAME=root
DB_PASSWORD=
```

Pastikan database `robokreasi` telah dibuat di MySQL:
```sql
CREATE DATABASE IF NOT EXISTS robokreasi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Instalasi Dependensi & Kunci Aplikasi
```bash
composer install
npm install
php artisan key:generate
```

### 5. Menjalankan Migrasi & Seeder Database
Jalankan migrasi untuk membuat seluruh tabel platform:
```bash
php artisan migrate
```

Jalankan seeder untuk mengisi data platform awal (kategori, metadata blok, proyek contoh, panduan interaktif):
```bash
php artisan db:seed
```

> **Catatan Idempotensi Seeder:**  
> Seluruh seeder (`BlockCategorySeeder`, `BlockDefinitionSeeder`, `ExampleProjectSeeder`, `GuideSeeder`) menggunakan pola `updateOrCreate`. Perintah `php artisan db:seed` dapat dijalankan berulang kali tanpa risiko duplikasi data.

### 6. Menjalankan Server Pengembangan
```bash
# Terminal 1: Backend Laravel
php artisan serve

# Terminal 2: Vite Dev Server
npm run dev
```
Buka browser pada: `http://127.0.0.1:8000/robokreasi`

---

## 🗄️ Skema Database Platform

Platform menggunakan 5 tabel utama:

1. **`block_categories`**
   - Mengelompokkan blok berdasarkan fungsionalitas (*Kejadian*, *Gerakan*, *Kontrol*, *Operator*, *Variabel*, *Sensor*, *Tampilan*, *Suara*).
   - Kolom: `id`, `name`, `slug` (unik), `description`, `color_hex`, `sort_order`, `is_active`, `timestamps`.

2. **`block_definitions`**
   - Menyimpan metadata definisi blok yang digunakan oleh Blockly di frontend.
   - Kolom: `id`, `block_category_id` (FK cascade ke `block_categories`), `block_type` (unik), `display_name`, `description`, `block_shape`, `parameter_schema` (JSON), `sort_order`, `is_active`, `timestamps`.

3. **`example_projects`**
   - Proyek contoh bawaan platform untuk dipelajari siswa.
   - Kolom: `id`, `name`, `slug` (unik), `description`, `difficulty` (`pemula`, `menengah`, `mahir`), `thumbnail`, `workspace_json` (JSON serialisasi Blockly), `sort_order`, `is_active`, `timestamps`.

4. **`guides`**
   - Modul panduan interaktif onboarding.
   - Kolom: `id`, `title`, `description`, `is_active`, `timestamps`.

5. **`guide_steps`**
   - Langkah-langkah detail onboarding yang ditargetkan ke elemen UI frontend.
   - Kolom: `id`, `guide_id` (FK cascade ke `guides`), `step_number`, `title`, `instruction`, `target_element`, `timestamps`.

---

## 📡 Kontrak Integrasi Frontend (Developer A & Developer B)

### A. Integrasi Halaman Workspace via Inertia.js

- **Route:** `GET /robokreasi`
- **Halaman Inertia:** `RoboKreasi/Workspace`
- **Props yang diterima Frontend:**

| Nama Prop | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `blockCategories` | `Array<BlockCategory>` | Daftar kategori blok aktif terurut |
| `blockDefinitions`| `Array<BlockDefinition>` | Seluruh metadata blok aktif |
| `exampleProjects` | `Array<ExampleProject>` | Proyek contoh beserta `workspace_json` |
| `guides` | `Array<Guide>` | Panduan onboarding beserta `steps` terurut |

---

### B. Endpoint REST API JSON

Backend juga menyediakan endpoint JSON mandiri dengan format respons seragam:

#### 1. Kategori Blok
- **URL:** `GET /api/robokreasi/categories`
- **Query Params:**
  - `include_blocks` (opsional, boolean: `true`/`false`): Jika `true`, menyertakan relasi blok di tiap kategori.
- **Respons (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Kejadian",
      "slug": "kejadian",
      "description": "Blok pemantik awal jalannya instruksi program robot.",
      "color_hex": "#FFBF00",
      "sort_order": 1
    }
  ]
}
```

#### 2. Definisi Blok
- **URL:** `GET /api/robokreasi/blocks`
- **Query Params:**
  - `category` (opsional): Filter berdasarkan ID atau slug kategori (contoh: `?category=gerakan`).
- **Respons (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "block_category_id": 2,
      "block_type": "motion_forward",
      "display_name": "Maju [langkah] langkah",
      "description": "Menggerakkan robot ke arah depan sejumlah langkah.",
      "block_shape": "statement",
      "parameter_schema": {
        "steps": { "type": "number", "default": 1, "min": 1, "max": 100 }
      },
      "sort_order": 1
    }
  ]
}
```

#### 3. Proyek Contoh
- **URL Daftar:** `GET /api/robokreasi/example-projects`
- **Query Params:**
  - `difficulty` (opsional: `pemula`, `menengah`, `mahir` atau `beginner`, `intermediate`, `advanced`)
  - `include_workspace` (opsional, boolean, default: `true`)
- **URL Detail Proyek:** `GET /api/robokreasi/example-projects/{slug}`
  - Contoh: `GET /api/robokreasi/example-projects/robot-pemilih-jalur`
- **Respons (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Robot Pemilih Jalur",
    "slug": "robot-pemilih-jalur",
    "description": "Robot yang dapat memilih jalur berdasarkan pembacaan sensor garis...",
    "difficulty": "pemula",
    "thumbnail": null,
    "workspace_json": {
      "blocks": {
        "languageVersion": 0,
        "blocks": [...]
      }
    },
    "sort_order": 1
  }
}
```

#### 4. Panduan Interaktif Onboarding
- **URL Daftar:** `GET /api/robokreasi/guides`
- **URL Detail:** `GET /api/robokreasi/guides/{id}`
- **Respons (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Panduan Dasar Pemula RoboKreasi",
      "description": "Pelajari antarmuka workspace, blok kode, dan cara menjalankan robot virtual.",
      "steps": [
        {
          "id": 1,
          "step_number": 1,
          "title": "Area Kategori Blok",
          "instruction": "Di sisi kiri terdapat palet kategori seperti Kejadian, Gerakan, dan Sensor...",
          "target_element": "#blockly-toolbox"
        }
      ]
    }
  ]
}
```

---

## 🧪 Pengujian Otomatis (Automated Testing)

Platform dilengkapi suite pengujian otomatis menggunakan **Pest PHP**:

```bash
php artisan test
```

Cakupan pengujian meliputi:
1. `RoboKreasiWorkspaceTest`: Memverifikasi render Inertia dan integritas 4 props utama.
2. `BlockCategoryApiTest`: Memverifikasi endpoint kategori dan eager loading blok.
3. `BlockDefinitionApiTest`: Memverifikasi endpoint blok dan filter kategori.
4. `ExampleProjectApiTest`: Memverifikasi listing proyek, detail proyek, filter tingkat kesulitan, dan validasi slug.
5. `GuideApiTest`: Memverifikasi onboarding guide dan urutan langkah (*step_number*).
6. `DatabaseSeederTest`: Memverifikasi idempotensi seeder (bebas duplikasi saat dijalankan berulang) dan integritas relasi Eloquent (`hasMany`, `belongsTo`, array casts).

---

## 📌 Catatan Koordinasi Git & Tim

Sesuai aturan kerja paralel:
- Seluruh pekerjaan backend berada di branch `feature/backend-database`.
- Kepemilikan file backend:
  - `app/Models/*`
  - `app/Http/Controllers/*`
  - `database/migrations/*`
  - `database/seeders/*`
  - `tests/*`
- File frontend inti milik Developer A tidak diubah sembarangan tanpa koordinasi.
