# Model Bisnis

API ini merupakan sebuah API ecommerce dimana didalamnya terdapat dua role user yaitu seller dan reguler user. Di API ini hanya terdapat satu seller dan multi reguler user.

Seller memiliki beberapa hak akses seperti :

1. Browse, Read, Edit, Add dan Delete data kategori dan Produk
2. Add data token
3. Browse data order
4. Edit data seller

Reguler User memiliki beberapa hak akses, seperti :

1. Add, Edit data reguler user
2. Add data token
3. Browse, Edit, Add, Delete data cart
4. Browse, Add data order

# Dokumentasi API

## EndPoint : `http://localhost:3000`

### POST /users

**Deskripsi:**
Membuat reguler user baru

**Request:**

- Metode: `POST`
- Endpoint: `/users`
- Tipe Konten: `application/json`

**Contoh Request:**

```json
{
  "name": "example",
  "email": "example@gmail.com",
  "password": "password"
}
```

**Response**

- Success Response Code : 200 OK
- Error Response Code : 400 Bad Request (Data tidak valid atau data yang diperlukan kosong)

### PUT /users/:id

**Deskripsi:**
Update Data Reguler User

**Request:**

- Metode: `PUT`
- Endpoint: `/users/:id`
- Tipe Konten: `application/json`

**Contoh Request:**

```json
{
  "name": "Mr. example"
}
```

**Response**

- Success Response Code : 200 OK
- Error Response Code : 400 Bad Request (Kesalahan dalam input request user ID)
- Error Response Code : 404 Not Found (User ID yang diinputkan tidak ada di dalam database)
- Error Response Code : 401 UnAuthorized (token yang digunakan bukanlah token milik user ID tersebut)

**Authentikasi**

API ini memerlukan autentikasi menggunakan token API. Setiap permintaan harus menyertakan header `Authorization` dengan nilai `Bearer [TOKEN]`

### POST /token

**Deskripsi:**
Membuat Data token baru

**Request:**

- Metode: `POST`
- Endpoint: `/token`
- Tipe Konten: `application/json`

**Contoh Request:**

```json
{
  "email": "example2@gmail.com",
  "password": "password"
}
```

**Response**

- Success Response Code : 200 OK
- Error Response Code : 400 Bad Request (Kesalahan dalam input request user ID)
- Error Response Code : 401 UnAuthorized (Email dan password yang dinputkan harus sudah terdaftar di dalam database)

**Authentikasi**

API ini memerlukan autentikasi menggunakan email dan password yang sudah terdaftar dalam database

### POST /cart

**Deskripsi:**
Membuat Data cart baru

**Request:**

- Metode: `POST`
- Endpoint: `/cart`
- Tipe Konten: `application/json`

**Contoh Request:**

```json
{
  "product_id": 7,
  "quantity": 2
}
```

**Response**

- Success Response Code : 200 OK
- Error Response Code : 400 Bad Request (Data yang diperlukan kosong)
- Error Response Code : 401 UnAuthorized (token yang digunakan tidak memiliki hak untuk mengakses route ini)
- Error Response Code : 404 Not Found (Product ID tidak ditemukan)

**Authentikasi**

API ini memerlukan autentikasi menggunakan token API. Setiap permintaan harus menyertakan header `Authorization` dengan nilai `Bearer [TOKEN]`

### GET /cart

**Deskripsi:**
Browse Data Cart

**Request:**

- Metode: `GET`
- Endpoint: `/cart`
- Tipe Konten: `application/json`

**Response**

- Success Response Code : 200 OK
- Error Response Code : 404 Not Found (Cart kosong)

**Authentikasi**

API ini memerlukan autentikasi menggunakan token API. Setiap permintaan harus menyertakan header `Authorization` dengan nilai `Bearer [TOKEN]`

### PUT /cart/:id

**Deskripsi:**
Update Data Cart

**Request:**

- Metode: `PUT`
- Endpoint: `/cart/:id`
- Tipe Konten: `application/json`

**Contoh Request:**

```json
{
  "quantity": 3
}
```

**Response**

- Success Response Code : 200 OK
- Error Response Code : 400 Bad Request (Request ID yang diinputkan invalid)
- Error Response Code : 401 UnAuthorized (token yang digunakan tidak memiliki hak untuk mengakses route ini)
- Error Response Code : 404 Not Found (Cart ID tidak ditemukan)

**Authentikasi**

API ini memerlukan autentikasi menggunakan token API. Setiap permintaan harus menyertakan header `Authorization` dengan nilai `Bearer [TOKEN]`

### DELETE /cart/:id

**Deskripsi:**
Hapus Data Cart

**Request:**

- Metode: `DELETE`
- Endpoint: `/cart/:id`
- Tipe Konten: `application/json`

**Response**

- Success Response Code : 200 OK
- Error Response Code : 400 Bad Request (Request ID yang diinputkan invalid)
- Error Response Code : 401 UnAuthorized (token yang digunakan tidak memiliki hak untuk mengakses route ini)
- Error Response Code : 404 Not Found (Cart ID tidak ditemukan)

**Authentikasi**

API ini memerlukan autentikasi menggunakan token API. Setiap permintaan harus menyertakan header `Authorization` dengan nilai `Bearer [TOKEN]`

### POST /orders

**Deskripsi:**
Membuat Order Baru

**Request:**

- Metode: `POST`
- Endpoint: `/orders`
- Tipe Konten: `application/json`

**Response**

- Success Response Code : 200 OK
- Error Response Code : 401 UnAuthorized (token yang digunakan tidak memiliki hak untuk mengakses route ini)
- Error Response Code : 404 Not Found (Cart kosong)

**Authentikasi**

API ini memerlukan autentikasi menggunakan token API. Setiap permintaan harus menyertakan header `Authorization` dengan nilai `Bearer [TOKEN]`

### GET /orders

**Deskripsi:**
Read data order

**Request:**

- Metode: `GET`
- Endpoint: `/orders`
- Tipe Konten: `application/json`

**Response**

- Success Response Code : 200 OK
- Error Response Code : 401 UnAuthorized (token yang digunakan tidak memiliki hak untuk mengakses route ini)
- Error Response Code : 404 Not Found (Order is empty)

**Authentikasi**

API ini memerlukan autentikasi menggunakan token API. Setiap permintaan harus menyertakan header `Authorization` dengan nilai `Bearer [TOKEN]`

### POST /orders/pay

**Deskripsi:**
Mengirim data payment

**Request:**

- Metode: `POST`
- Endpoint: `/orders/pay`
- Tipe Konten: `application/json`

**Contoh Request**

```json
{
  "amount": 684,
  "cardNumber": "4012888888881881",
  "cvv": 201,
  "expiryMonth": "02",
  "expiryYear": "2024"
}
```

**Response**

- Success Response Code : 200 OK
- Error Response Code : 400 Bad Request (Data tidak valid)
- Error Response Code : 401 UnAuthorized (token yang digunakan tidak memiliki hak untuk mengakses route ini)

**Authentikasi**

API ini memerlukan autentikasi menggunakan token API. Setiap permintaan harus menyertakan header `Authorization` dengan nilai `Bearer [TOKEN]`

### GET /admin/orders

**Deskripsi:**
Browse Data Order

**Request:**

- Metode: `GET`
- Endpoint: `/admin/orders`
- Tipe Konten: `application/json`

**Response**

- Success Response Code : 200 OK
- Error Response Code : 404 Not Found (Order is empty)

**Authentikasi**

API ini memerlukan autentikasi menggunakan token API. Setiap permintaan harus menyertakan header `Authorization` dengan nilai `Bearer [TOKEN]`

### POST /category

**Deskripsi:**
Membuat Category Baru

**Request:**

- Metode: `POST`
- Endpoint: `/category`
- Tipe Konten: `application/json`

**Contoh Request**

```json
{
  "name": "Chair"
}
```

**Response**

- Success Response Code : 200 OK
- Error Response Code : 400 Bad Request (Data tidak valid atau data yang diperlukan kosong)
- Error Response Code : 401 UnAuthorized (token yang digunakan tidak memiliki hak untuk mengakses route ini)

**Authentikasi**

API ini memerlukan autentikasi menggunakan token API. Setiap permintaan harus menyertakan header `Authorization` dengan nilai `Bearer [TOKEN]`

### GET /category

**Deskripsi:**
Browse Data Category

**Request:**

- Metode: `GET`
- Endpoint: `/category`
- Tipe Konten: `application/json`

**Response**

- Success Response Code : 200 OK
- Error Response Code : 404 Not Found (Data Category is empty)

**Authentikasi**

API ini memerlukan autentikasi menggunakan token API. Setiap permintaan harus menyertakan header `Authorization` dengan nilai `Bearer [TOKEN]`

### PUT /category/:id

**Deskripsi:**
Update Data Category

**Request:**

- Metode: `PUT`
- Endpoint: `/category/:id`
- Tipe Konten: `application/json`

**Contoh Request**

```json
{
  "name": "Chair updated"
}
```

**Response**

- Success Response Code : 200 OK
- Error Response Code : 400 Bad Request (Data tidak valid)
- Error Response Code : 404 Not Found (Data Category is empty)

**Authentikasi**

API ini memerlukan autentikasi menggunakan token API. Setiap permintaan harus menyertakan header `Authorization` dengan nilai `Bearer [TOKEN]`

### DELETE /category/:id

**Deskripsi:**
Hapus Data Category

**Request:**

- Metode: `DELETE`
- Endpoint: `/category/:id`
- Tipe Konten: `application/json`

**Response**

- Success Response Code : 200 OK
- Error Response Code : 400 Bad Request (Data tidak valid)
- Error Response Code : 404 Not Found (Data Category is empty)

**Authentikasi**

API ini memerlukan autentikasi menggunakan token API. Setiap permintaan harus menyertakan header `Authorization` dengan nilai `Bearer [TOKEN]`

### POST /products

**Deskripsi:**
Tambah Data Product

**Request:**

- Metode: `POST`
- Endpoint: `/products`
- Tipe Konten: `application/json`

**Contoh Request**

```json
{
  "category_id": 4,
  "name": "contoh 1",
  "description": "deskripsi 1",
  "price": 100
}
```

**Response**

- Success Response Code : 200 OK
- Error Response Code : 400 Bad Request (Data tidak valid)
- Error Response Code : 404 Not Found (Data Category Not Found)

**Authentikasi**

API ini memerlukan autentikasi menggunakan token API. Setiap permintaan harus menyertakan header `Authorization` dengan nilai `Bearer [TOKEN]`

### GET /products/search

**Deskripsi:**
Browse Data Products

**Request:**

- Metode: `GET`
- Endpoint: `/products/search`
- Tipe Konten: `application/json`

**Response**

- Success Response Code : 200 OK
- Error Response Code : 404 Not Found (Data Product Not Found)

**Authentikasi**

API ini memerlukan autentikasi menggunakan token API. Setiap permintaan harus menyertakan header `Authorization` dengan nilai `Bearer [TOKEN]`

### GET /products

**Deskripsi:**
Browse Data Products

**Request:**

- Metode: `GET`
- Endpoint: `/products`
- Tipe Konten: `application/json`

**Response**

- Success Response Code : 200 OK
- Error Response Code : 404 Not Found (Data Product Empty)

**Authentikasi**

API ini memerlukan autentikasi menggunakan token API. Setiap permintaan harus menyertakan header `Authorization` dengan nilai `Bearer [TOKEN]`

### GET /products/:id

**Deskripsi:**
Read Data Products

**Request:**

- Metode: `GET`
- Endpoint: `/products/:id`
- Tipe Konten: `application/json`

**Response**

- Success Response Code : 200 OK
- Error Response Code : 404 Not Found (Data Product Not Found)

**Authentikasi**

API ini memerlukan autentikasi menggunakan token API. Setiap permintaan harus menyertakan header `Authorization` dengan nilai `Bearer [TOKEN]`

### PUT /products/:id

**Deskripsi:**
Update Data Products

**Request:**

- Metode: `PUT`
- Endpoint: `/products/:id`
- Tipe Konten: `application/json`

**Contoh Request**

```json
{
  "name": "contoh 1 updated"
}
```

**Response**

- Success Response Code : 200 OK
- Error Response Code : 400 Bad Request (Data tidak valid)
- Error Response Code : 404 Not Found (Data Product Not Found)

**Authentikasi**

API ini memerlukan autentikasi menggunakan token API. Setiap permintaan harus menyertakan header `Authorization` dengan nilai `Bearer [TOKEN]`

### DELETE /products/:id

**Deskripsi:**
Delete Data Products

**Request:**

- Metode: `DELETE`
- Endpoint: `/products/:id`
- Tipe Konten: `application/json`

**Response**

- Success Response Code : 200 OK
- Error Response Code : 400 Bad Request (Data tidak valid)
- Error Response Code : 404 Not Found (Data Product Not Found)

**Authentikasi**

API ini memerlukan autentikasi menggunakan token API. Setiap permintaan harus menyertakan header `Authorization` dengan nilai `Bearer [TOKEN]`
