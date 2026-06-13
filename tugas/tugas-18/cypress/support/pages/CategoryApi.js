/**
 * ============================================================
 * PAGE OBJECT MODEL - Category API Client
 * ============================================================
 * Aplikasi  : Platzi Fake Store API
 * Base URL  : https://api.escuelajs.co/api/v1
 * Endpoint  : /categories
 * Dibuat    : Ferddy Fauzan Ramadhan
 * ============================================================
 * Semua method request API terpusat di sini (POM for API).
 * Test file hanya memanggil method ini, tidak hardcode cy.request().
 * ============================================================
 */

class CategoryApi {
  // ─── Base Config ──────────────────────────────────────────

  get baseUrl() {
    return 'https://api.escuelajs.co/api/v1';
  }

  get headers() {
    return { 'Content-Type': 'application/json' };
  }

  // ============================================================
  // GET REQUESTS
  // ============================================================

  /**
   * GET /categories
   * Ambil semua kategori
   */
  getAllCategories() {
    return cy.request({
      method: 'GET',
      url: `${this.baseUrl}/categories`,
      headers: this.headers,
    });
  }

  /**
   * GET /categories/{id}
   * Ambil 1 kategori berdasarkan ID
   */
  getCategoryById(id) {
    return cy.request({
      method: 'GET',
      url: `${this.baseUrl}/categories/${id}`,
      headers: this.headers,
      failOnStatusCode: false,
    });
  }

  /**
   * GET /categories/slug/{slug}
   * Ambil kategori berdasarkan slug
   */
  getCategoryBySlug(slug) {
    return cy.request({
      method: 'GET',
      url: `${this.baseUrl}/categories/slug/${slug}`,
      headers: this.headers,
    });
  }

  /**
   * GET /categories/{id}/products
   * Ambil semua produk dalam kategori
   */
  getProductsByCategory(id) {
    return cy.request({
      method: 'GET',
      url: `${this.baseUrl}/categories/${id}/products`,
      headers: this.headers,
    });
  }

  /**
   * GET /categories?limit={limit}&offset={offset}
   * Ambil kategori dengan pagination
   */
  getCategoriesWithPagination(limit, offset) {
    return cy.request({
      method: 'GET',
      url: `${this.baseUrl}/categories`,
      qs: { limit, offset },
      headers: this.headers,
    });
  }

  // ============================================================
  // POST REQUESTS
  // ============================================================

  /**
   * POST /categories
   * Buat kategori baru
   */
  createCategory(payload) {
    return cy.request({
      method: 'POST',
      url: `${this.baseUrl}/categories/`,
      headers: this.headers,
      body: payload,
    });
  }

  /**
   * POST /categories - dengan payload tidak lengkap (negative)
   */
  createCategoryInvalid(payload) {
    return cy.request({
      method: 'POST',
      url: `${this.baseUrl}/categories/`,
      headers: this.headers,
      body: payload,
      failOnStatusCode: false,
    });
  }

  // ============================================================
  // PUT REQUESTS
  // ============================================================

  /**
   * PUT /categories/{id}
   * Update kategori berdasarkan ID
   */
  updateCategory(id, payload) {
    return cy.request({
      method: 'PUT',
      url: `${this.baseUrl}/categories/${id}`,
      headers: this.headers,
      body: payload,
    });
  }

  // ============================================================
  // DELETE REQUESTS
  // ============================================================

  /**
   * DELETE /categories/{id}
   * Hapus kategori berdasarkan ID
   */
  deleteCategory(id) {
    return cy.request({
      method: 'DELETE',
      url: `${this.baseUrl}/categories/${id}`,
      headers: this.headers,
    });
  }
}

export default new CategoryApi();
