# Tugas Akhir QA Bootcamp - OrangeHRM Automation

Automasi pengujian fitur **Login**, **Directory**, dan **Recruitment** pada website [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com) menggunakan **Cypress** dengan format **Page Object Model (POM)** dan **Intercept**.

---

## 📁 Struktur Project

```
tugas-akhir/
├── cypress/
│   ├── e2e/
│   │   ├── login/
│   │   │   └── login.cy.js          # 8 Test Case Login
│   │   ├── directory/
│   │   │   └── directory.cy.js      # 8 Test Case Directory
│   │   └── recruitment/
│   │       └── recruitment.cy.js    # 8 Test Case Recruitment
│   ├── fixtures/
│   │   └── users.json               # Data test (username & password)
│   └── support/
│       ├── pages/
│       │   ├── LoginPage.js         # POM - Login
│       │   ├── DirectoryPage.js     # POM - Directory
│       │   └── RecruitmentPage.js   # POM - Recruitment
│       ├── commands.js              # Custom Cypress commands
│       └── e2e.js                   # Support entry point
├── cypress.config.js
├── package.json
└── README.md
```

---

## 🧪 Daftar Test Case

### Feature: Login (8 TC)
| No | Test Case | Keterangan |
|----|-----------|------------|
| TC-L01 | Login berhasil dengan kredensial valid | Intercept POST + verifikasi URL dashboard |
| TC-L02 | Login gagal dengan username salah | Intercept + verifikasi error message |
| TC-L03 | Login gagal dengan password salah | Intercept + verifikasi error message |
| TC-L04 | Validasi field kosong (username & password) | Verifikasi pesan "Required" |
| TC-L05 | Username kosong, password terisi | Verifikasi pesan "Required" di username |
| TC-L06 | Username terisi, password kosong | Verifikasi pesan "Required" di password |
| TC-L07 | Elemen UI halaman login tampil dengan benar | Verifikasi logo, title, input, button |
| TC-L08 | Klik Forgot Password redirect ke halaman reset | Verifikasi URL & halaman reset |

### Feature: Directory (8 TC)
| No | Test Case | Keterangan |
|----|-----------|------------|
| TC-D01 | Halaman Directory berhasil dibuka | Intercept GET + verifikasi kartu karyawan |
| TC-D02 | Pencarian berhasil berdasarkan nama valid | Intercept + verifikasi hasil |
| TC-D03 | Pencarian nama tidak ada → No Records | Intercept + verifikasi no record |
| TC-D04 | Reset filter pencarian berfungsi | Verifikasi input kembali kosong |
| TC-D05 | Kartu karyawan menampilkan info lengkap | Verifikasi nama & jabatan di card |
| TC-D06 | Intercept validasi response API search | Verifikasi status code & content-type |
| TC-D07 | Menu Directory accessible dari sidebar | Verifikasi klik sidebar → URL directory |
| TC-D08 | Search tanpa filter tampilkan semua karyawan | Intercept + verifikasi data tampil |

### Feature: Recruitment (8 TC)
| No | Test Case | Keterangan |
|----|-----------|------------|
| TC-R01 | Halaman Recruitment berhasil dibuka | Intercept GET + verifikasi tabel |
| TC-R02 | Tombol Add Vacancy buka form tambah | Intercept GET + verifikasi URL |
| TC-R03 | Form Add Vacancy validasi field wajib | Verifikasi pesan "Required" |
| TC-R04 | Pencarian vacancy berdasarkan nama | Intercept + verifikasi hasil |
| TC-R05 | Pencarian nama tidak ada → No Records | Intercept + verifikasi no record |
| TC-R06 | Reset filter pencarian berfungsi | Verifikasi input kembali kosong |
| TC-R07 | Cancel pada form Add Vacancy kembali ke list | Verifikasi redirect ke viewRecruitment |
| TC-R08 | Menu Recruitment accessible dari sidebar | Verifikasi klik sidebar → URL recruitment |

---

## 🚀 Cara Menjalankan

### Install dependencies
```bash
npm install
```

### Jalankan semua test (headless)
```bash
npm run cy:run
```

### Buka Cypress UI
```bash
npm run cy:open
```

### Jalankan per fitur
```bash
npm run cy:run:login
npm run cy:run:directory
npm run cy:run:recruitment
```

---

## 🌐 Website yang Diuji

- **URL**: https://opensource-demo.orangehrmlive.com
- **Username**: Admin
- **Password**: admin123

---

## 🛠 Tech Stack

- **Framework**: Cypress v13
- **Pattern**: Page Object Model (POM)
- **Technique**: `cy.intercept()` untuk validasi API request/response
- **Language**: JavaScript (ES6+)
