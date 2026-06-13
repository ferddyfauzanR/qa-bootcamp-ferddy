# Quiz 4 — Login Intercept OrangeHRM

> **Framework**: Cypress | **Dibuat oleh**: Ferddy Fauzan Ramadhan

## Deskripsi

Quiz ini merupakan lanjutan dari Quiz 3. Semua test scenario login OrangeHRM
kini dilengkapi dengan `cy.intercept()` — setiap test case memiliki intercept
dengan URL / validasi yang **berbeda-beda**.

---

## Cara Jalankan

```bash
npm install
npm test              # headless (CI)
npm run test:open     # GUI / interactive
npm run test:headless # headless Chrome
```

---

## Test Case (10 TC)

| TC ID      | Skenario                          | Tipe     | Intercept Target                                 |
|------------|-----------------------------------|----------|--------------------------------------------------|
| TC-INT-01  | Login kredensial valid            | Positive | `POST /auth/validate` — spy status 200           |
| TC-INT-02  | Login → Logout → Login kembali    | Positive | `GET /dashboard/index` — verifikasi status 200   |
| TC-INT-03  | Login password salah              | Negative | `POST /auth/validate` — **stub 401**             |
| TC-INT-04  | Login username salah              | Negative | `POST /auth/validate` — validasi request body    |
| TC-INT-05  | Kedua field kosong                | Negative | `POST /auth/validate` — pastikan **tidak** terpanggil |
| TC-INT-06  | Username kosong                   | Negative | `GET /auth/login` — verifikasi tidak redirect    |
| TC-INT-07  | Password kosong                   | Negative | `POST /auth/validate` — pastikan **tidak** terpanggil |
| TC-INT-08  | Username dengan spasi             | Negative | `POST /auth/validate` — validasi body mengandung spasi |
| TC-INT-09  | Field password ter-mask           | UI       | `GET **/*.css` — verifikasi asset CSS            |
| TC-INT-10  | Klik "Forgot your password?"      | UI       | `GET /auth/requestPasswordResetCode` — status 200 |

---

## Struktur Folder

```
quiz-4/
├── cypress/
│   ├── e2e/
│   │   └── login.intercept.cy.js   ← File utama (10 TC + cy.intercept)
│   ├── fixtures/
│   │   └── loginData.json
│   └── support/
│       ├── e2e.js
│       └── pages/
│           └── LoginPage.js
├── cypress.config.js
├── package.json
├── .gitignore
└── README.md
```

---

## Teknik Intercept yang Digunakan

| Teknik                        | Dipakai di     |
|-------------------------------|----------------|
| Spy (amati request/response)  | TC-INT-01, 02, 04, 08, 10 |
| Stub (mock response 401)      | TC-INT-03      |
| Pastikan request tidak terjadi| TC-INT-05, 07  |
| Verifikasi URL tidak redirect | TC-INT-06      |
| Intercept static asset CSS    | TC-INT-09      |
