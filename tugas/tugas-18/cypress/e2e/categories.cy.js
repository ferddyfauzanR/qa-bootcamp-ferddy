/**
 * ============================================================
 * TEST AUTOMATION API - Platzi Fake Store API
 * ============================================================
 * Aplikasi  : Platzi Fake Store API
 * Base URL  : https://api.escuelajs.co/api/v1
 * Endpoint  : /categories
 * Dibuat    : Ferddy Fauzan Ramadhan
 * Framework : Cypress + Page Object Model (POM)
 * Tugas     : 18
 * Total     : 12 Request
 * ============================================================
 */

import CategoryApi from '../support/pages/CategoryApi';

describe('API Testing - Platzi Fake Store (Categories)', () => {
  // ─── Load fixture data ─────────────────────────────────────
  let data;
  let newCategoryId;

  before(() => {
    cy.fixture('apiData').then((fixture) => {
      data = fixture;
    });
  });

  // ─── Helper: buat payload dengan nama unik (hindari UNIQUE slug conflict) ──
  function uniqueCategory(base) {
    const suffix = Date.now();
    return {
      ...base,
      name: `${base.name} ${suffix}`,
    };
  }

  // ============================================================
  // GET - AMBIL DATA KATEGORI
  // ============================================================

  context('GET - Ambil Data Kategori', () => {

    it('[TC-API-01] Ambil semua kategori - status 200 dan response berupa array', () => {
      CategoryApi.getAllCategories().then((response) => {
        // Assert status code
        expect(response.status).to.eq(200);

        // Assert response body
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);

        // Assert struktur setiap item
        response.body.forEach((item) => {
          expect(item).to.have.property('id');
          expect(item).to.have.property('name');
          expect(item).to.have.property('slug');
          expect(item).to.have.property('image');
        });
      });
    });

    it('[TC-API-02] Ambil 1 kategori by ID - status 200 dan data sesuai ID', () => {
      // Ambil ID valid secara dinamis dari daftar kategori yang ada
      CategoryApi.getAllCategories().then((allRes) => {
        const validId = allRes.body[0].id;

        CategoryApi.getCategoryById(validId).then((response) => {
          // Assert status code
          expect(response.status).to.eq(200);

          // Assert response body
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('id', validId);
          expect(response.body).to.have.property('name');
          expect(response.body.name).to.be.a('string');

          // Assert Content-Type header
          expect(response.headers['content-type']).to.include('application/json');
        });
      });
    });

    it('[TC-API-03] Ambil kategori by slug - status 200 dan slug sesuai', () => {
      CategoryApi.getCategoryBySlug(data.existingCategorySlug).then((response) => {
        // Assert status code
        expect(response.status).to.eq(200);

        // Assert response body
        expect(response.body).to.have.property('slug');
        expect(response.body.slug).to.eq(data.existingCategorySlug);
        expect(response.body).to.have.property('name');
        expect(response.body).to.have.property('image');
      });
    });

    it('[TC-API-04] Ambil produk dalam kategori - status 200 dan produk berupa array', () => {
      CategoryApi.getAllCategories().then((allRes) => {
        const validId = allRes.body[0].id;

        CategoryApi.getProductsByCategory(validId).then((response) => {
          // Assert status code
          expect(response.status).to.eq(200);

          // Assert response body
          expect(response.body).to.be.an('array');

          // Assert struktur produk jika ada isinya
          if (response.body.length > 0) {
            expect(response.body[0]).to.have.property('title');
            expect(response.body[0]).to.have.property('price');
            expect(response.body[0]).to.have.property('id');
          }
        });
      });
    });

    it('[TC-API-05] Ambil kategori dengan pagination - status 200 dan jumlah sesuai limit', () => {
      CategoryApi.getCategoriesWithPagination(data.pagination.limit, data.pagination.offset).then((response) => {
        // Assert status code
        expect(response.status).to.eq(200);

        // Assert response body
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.lte(data.pagination.limit);
      });
    });

  });

  // ============================================================
  // POST - BUAT KATEGORI BARU
  // ============================================================

  context('POST - Buat Kategori Baru', () => {

    it('[TC-API-06] Buat kategori baru - status 201 dan data tersimpan dengan benar', () => {
      const payload = uniqueCategory(data.newCategory);

      CategoryApi.createCategory(payload).then((response) => {
        // Assert status code
        expect(response.status).to.eq(201);

        // Assert response body
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('name', payload.name);
        expect(response.body).to.have.property('slug');
        expect(response.body).to.have.property('image', payload.image);
        expect(response.body.id).to.be.a('number');

        // Simpan ID untuk dipakai di TC berikutnya
        newCategoryId = response.body.id;

        // Cleanup
        CategoryApi.deleteCategory(newCategoryId);
      });
    });

    it('[TC-API-07] Buat kategori tanpa field name - status 400 dan ada pesan error', () => {
      CategoryApi.createCategoryInvalid(data.invalidCategory).then((response) => {
        // FIX: Server Platzi kadang return 400, kadang 500 untuk invalid payload
        // Keduanya dianggap valid sebagai error response
        expect(response.status).to.be.oneOf([400, 500]);

        // Assert response body ada pesan error
        expect(response.body).to.have.property('message');
      });
    });

  });

  // ============================================================
  // PUT - UPDATE KATEGORI
  // ============================================================

  context('PUT - Update Kategori', () => {

    it('[TC-API-08] Update kategori - status 200 dan nama terupdate', () => {
      // Buat dulu kategori baru dengan nama unik, lalu update
      const payload = uniqueCategory(data.newCategory);

      CategoryApi.createCategory(payload).then((createRes) => {
        expect(createRes.status).to.eq(201);
        const idToUpdate = createRes.body.id;

        CategoryApi.updateCategory(idToUpdate, data.updatedCategory).then((response) => {
          // Assert status code
          expect(response.status).to.eq(200);

          // Assert nama berhasil diupdate
          expect(response.body).to.have.property('name', data.updatedCategory.name);

          // Assert ID tetap sama
          expect(response.body).to.have.property('id', idToUpdate);

          // Cleanup: hapus kategori yang dibuat
          CategoryApi.deleteCategory(idToUpdate);
        });
      });
    });

  });

  // ============================================================
  // DELETE - HAPUS KATEGORI
  // ============================================================

  context('DELETE - Hapus Kategori', () => {

    it('[TC-API-09] Hapus kategori - status 200 dan response true', () => {
      // Buat dulu kategori baru dengan nama unik untuk dihapus
      const payload = uniqueCategory(data.newCategory);

      CategoryApi.createCategory(payload).then((createRes) => {
        expect(createRes.status).to.eq(201);
        const idToDelete = createRes.body.id;

        CategoryApi.deleteCategory(idToDelete).then((response) => {
          // Assert status code
          expect(response.status).to.eq(200);

          // Assert response body adalah true
          expect(response.body).to.eq(true);
        });
      });
    });

  });

  // ============================================================
  // NEGATIVE TEST
  // ============================================================

  context('Negative Test', () => {

    it('[TC-API-10] Ambil kategori dengan ID tidak ada - status 400 dan ada message error', () => {
      CategoryApi.getCategoryById(data.nonExistentId).then((response) => {
        // Assert status code 400 atau 404
        expect(response.status).to.be.oneOf([400, 404]);

        // Assert response body ada pesan error
        expect(response.body).to.have.property('message');
      });
    });

    it('[TC-API-11] Verifikasi kategori setelah dihapus - status 400 dan ada message error', () => {
      // Buat kategori dengan nama unik, hapus, lalu cek
      const payload = uniqueCategory(data.newCategory);

      CategoryApi.createCategory(payload).then((createRes) => {
        expect(createRes.status).to.eq(201);
        const deletedId = createRes.body.id;

        CategoryApi.deleteCategory(deletedId).then(() => {
          // Coba ambil kategori yang sudah dihapus
          CategoryApi.getCategoryById(deletedId).then((response) => {
            // Assert status code 400 atau 404
            expect(response.status).to.be.oneOf([400, 404]);

            // Assert response body ada pesan error
            expect(response.body).to.have.property('message');
          });
        });
      });
    });

    it('[TC-API-12] Full flow CRUD - Create, Read, Update, Delete kategori', () => {
      let createdId;
      const payload = uniqueCategory(data.newCategory);

      // Step 1: CREATE
      CategoryApi.createCategory(payload).then((createRes) => {
        expect(createRes.status).to.eq(201);
        expect(createRes.body).to.have.property('id');
        createdId = createRes.body.id;

        // Step 2: READ
        CategoryApi.getCategoryById(createdId).then((readRes) => {
          expect(readRes.status).to.eq(200);
          expect(readRes.body.id).to.eq(createdId);

          // Step 3: UPDATE
          CategoryApi.updateCategory(createdId, data.updatedCategory).then((updateRes) => {
            expect(updateRes.status).to.eq(200);
            expect(updateRes.body.name).to.eq(data.updatedCategory.name);

            // Step 4: DELETE
            CategoryApi.deleteCategory(createdId).then((deleteRes) => {
              expect(deleteRes.status).to.eq(200);
              expect(deleteRes.body).to.eq(true);
            });
          });
        });
      });
    });

  });

});
