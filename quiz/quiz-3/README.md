# Quiz 3 - Test Automation Login OrangeHRM

> **Framework**: Cypress | **Dibuat oleh**: Ferddy Fauzan Ramadhan

## Cara Jalankan

```bash
npm install
npm test          # headless
npm run test:open # GUI
```

## Test Case (11 TC)

| TC ID | Skenario | Tipe |
|-------|----------|------|
| TC-LOG-01 | Login kredensial valid | Positive |
| TC-LOG-02 | Login → Logout → Login lagi | Positive |
| TC-LOG-03 | Password salah | Negative |
| TC-LOG-04 | Username salah | Negative |
| TC-LOG-05 | Kedua field kosong | Negative |
| TC-LOG-06 | Username kosong | Negative |
| TC-LOG-07 | Password kosong | Negative |
| TC-LOG-08 | Username dengan spasi | Negative |
| TC-LOG-09 | Username huruf kecil | Negative |
| TC-LOG-10 | Password field ter-mask | UI |
| TC-LOG-11 | Forgot password link | UI |
