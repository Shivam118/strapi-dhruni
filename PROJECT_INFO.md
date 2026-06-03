# Dhruni Realty — Strapi Backend: Complete Project Reference

> **Purpose:** Full technical reference for the Next.js frontend team. Covers all content types, API endpoints, response shapes, relations, and configuration details.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Scripts & Deployment](#2-scripts--deployment)
3. [Dependencies](#3-dependencies)
4. [Environment Variables](#4-environment-variables)
5. [Server & API Configuration](#5-server--api-configuration)
6. [Database](#6-database)
7. [Plugins & Media](#7-plugins--media)
8. [Content Types](#8-content-types)
   - [Properties](#81-properties-collection-type)
   - [Blog](#82-blog-collection-type)
   - [Amenity](#83-amenity-collection-type)
   - [PropertyType](#84-propertytype-collection-type)
   - [PropertyCity](#85-propertycity-collection-type)
   - [PropertyTown](#86-propertytown-collection-type)
   - [HomePage (Single)](#87-homepage-single-type)
   - [WebConfig (Single)](#88-webconfig-single-type)
   - [SEO Component](#89-seo-component)
9. [Relationship Map](#9-relationship-map)
10. [API Endpoints & Query Patterns](#10-api-endpoints--query-patterns)
11. [Response Format](#11-response-format)
12. [Authentication](#12-authentication)
13. [Frontend Integration Notes](#13-frontend-integration-notes)

---

## 1. Project Overview

| Property | Value |
|----------|-------|
| **Project Name** | Dhruni Realty |
| **Strapi Version** | 4.19.0 |
| **Node Version** | >=18 <=20 |
| **Database** | PostgreSQL (hosted on Supabase) |
| **Media Storage** | Cloudinary |
| **Default API Port** | 1337 |
| **Content Types** | 6 Collection Types + 2 Single Types |
| **Rich Text Editor** | CKEditor + Tiptap |
| **i18n** | Enabled (English only, extensible) |

---

## 2. Scripts & Deployment

```bash
npm run dev      # Development mode with hot reload
npm run build    # Build admin panel + backend
npm start        # Production mode

# Or with yarn
yarn develop
yarn build
yarn start
```

---

## 3. Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@strapi/strapi` | 4.19.0 | Core framework |
| `@strapi/plugin-users-permissions` | 4.19.0 | JWT auth, roles, permissions |
| `@strapi/plugin-i18n` | 4.19.0 | Internationalization |
| `@strapi/plugin-cloud` | 4.19.0 | Cloud deployment |
| `@strapi/provider-upload-cloudinary` | 5.46.1 | Cloudinary media upload |
| `@strapi/provider-upload-aws-s3` | 4.20.1 | S3 (available, not active) |
| `@ckeditor/strapi-plugin-ckeditor` | 0.0.10 | Rich text editor (CKEditor) |
| `strapi-tiptap-editor` | 0.9.12 | Rich text editor (Tiptap) |
| `pg` | 8.8.0 | PostgreSQL driver |
| `docx` | 9.6.1 | Document generation utility |

---

## 4. Environment Variables

Create a `.env` file in the project root with these variables:

```env
# Server
HOST=0.0.0.0
PORT=1337
APP_KEYS="key1,key2,key3,key4"

# Security / Secrets
API_TOKEN_SALT=
ADMIN_JWT_SECRET=
TRANSFER_TOKEN_SALT=
JWT_SECRET=

# Cloudinary (Media Storage)
CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=

# Database (PostgreSQL / Supabase)
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
DATABASE_HOST=
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_SSL=false
```

**Frontend `.env` variables you will need:**
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337   # or your deployed URL
NEXT_PUBLIC_STRAPI_API_TOKEN=                  # Create in Strapi Admin > Settings > API Tokens
```

---

## 5. Server & API Configuration

**Default base URL:** `http://localhost:1337`

**API Pagination defaults:**
```
defaultLimit: 25
maxLimit:     100
withCount:    true   ← total count is always included
```

**CORS:** Enabled (configure allowed origins in `config/middlewares.js`)

**Webhooks:** `WEBHOOKS_POPULATE_RELATIONS=false` (relations not auto-populated in webhooks)

---

## 6. Database

- **Engine:** PostgreSQL
- **Host:** Supabase pooler (`aws-1-ap-southeast-1.pooler.supabase.com:6543`)
- **Pool:** min 2, max 10 connections
- **SSL:** Disabled by default (set `DATABASE_SSL=true` for production)

---

## 7. Plugins & Media

### Cloudinary (Active Upload Provider)

All media (images, videos, documents) is stored in **Cloudinary**.

- Media URL example: `https://res.cloudinary.com/{cloud_name}/image/upload/...`
- Supported types: images, videos, audio, documents

### Rich Text

Two editors are installed:
- **CKEditor** (`@ckeditor/strapi-plugin-ckeditor`) — used for `description` (Properties) and `content` (Blog)
- **Tiptap** (`strapi-tiptap-editor`) — alternative editor

The output is **HTML string** stored in the database. Render it with `dangerouslySetInnerHTML` or a sanitized HTML renderer on the frontend.

---

## 8. Content Types

### 8.1 Properties (Collection Type)

**API slug:** `property`  
**Endpoint:** `/api/properties`  
**Draft & Publish:** Yes  

#### Schema

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | ✓ | Property name |
| `slug` | uid | ✓ | Auto-generated from `title`; use for SEO URLs |
| `price` | biginteger | ✓ | Stored as integer (paise/smallest unit or full INR) |
| `location` | text | ✓ | Free-text location description |
| `image` | media (single) | ✓ | Cover image — images/videos only |
| `imageGallery` | media (multiple) | ✓ | Gallery — images/videos only |
| `areaNumber` | string | | Area/zone designation |
| `size` | string | ✓ | e.g. "1200 sq.ft" |
| `description` | richtext | | HTML from CKEditor |
| `latitude` | float | | GPS latitude |
| `longitude` | float | | GPS longitude |
| `BHK` | integer | ✓ | Min: 1, Default: 3 |
| `builtYear` | integer | | Year of construction |
| `status` | enumeration | ✓ | See values below |
| `exclusive` | boolean | | Marks as exclusive listing |
| `SEO` | component (repeatable) | | SEO meta tags array |
| `metaDescription` | text | | SEO meta description (max 160 chars) |

#### `status` Enum Values

```
Coming Soon | Delivered | Launched | Nearing Possession |
New Launched | Ready to Move | Resale | Under Construction
```

#### Relations

| Field | Relation | Target |
|-------|----------|--------|
| `builder` | manyToOne | `users-permissions.user` |
| `amenities` | oneToMany | `api::amenity.amenity` |
| `property_town` | manyToOne | `api::property-town.property-town` |
| `property_type` | oneToOne | `api::property-type.property-type` |
| `property_city` | manyToOne | `api::property-city.property-city` |

#### Recommended populate for full data

```
/api/properties?populate=image,imageGallery,property_city,property_town,property_type,amenities,SEO,builder
```

---

### 8.2 Blog (Collection Type)

**API slug:** `blog`  
**Endpoint:** `/api/blogs`  
**Draft & Publish:** Yes  

#### Schema

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | | Blog title |
| `slug` | uid | | Auto-generated from `title` |
| `image` | media (single) | | Featured image — images, files, videos, audios |
| `authorName` | string | ✓ | Author display name |
| `authorEmail` | email | ✓ | Author email |
| `caption` | string | | Short excerpt / subtitle |
| `content` | richtext | ✓ | HTML body from CKEditor |
| `metaTitle` | string | | SEO meta title (max 60 chars) |
| `metaDescription` | text | | SEO meta description (max 160 chars) |
| `tags` | json | | Array of tag strings |
| `category` | enumeration | | See values below |
| `ogImage` | media (single) | | Open Graph image — images, files, videos, audios |

#### `category` Enum Values

```
Market Insights | Buyer's Guide | Destinations | Investment | Lifestyle
```

#### Relations
None

---

### 8.3 Amenity (Collection Type)

**API slug:** `amenity`  
**Endpoint:** `/api/amenities`  
**Draft & Publish:** Yes  

#### Schema

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `amenity` | string | | Amenity name (e.g. "Swimming Pool") |
| `iconId` | uid | ✓ | Auto-generated from `amenity`; use to map icons on frontend |

#### Relations
- Used by `Properties` via `oneToMany` relation

---

### 8.4 PropertyType (Collection Type)

**API slug:** `property-type`  
**Endpoint:** `/api/property-types`  
**Draft & Publish:** Yes  

#### Schema

| Field | Type | Notes |
|-------|------|-------|
| `type` | string | e.g. "Apartment", "Villa", "Commercial" |
| `slug` | uid | Auto-generated from `type` |

---

### 8.5 PropertyCity (Collection Type)

**API slug:** `property-city`  
**Endpoint:** `/api/property-cities`  
**Draft & Publish:** Yes  

#### Schema

| Field | Type | Notes |
|-------|------|-------|
| `city` | string | City name |
| `slug` | uid | Auto-generated from `city` |
| `metaTitle` | string | SEO meta title (max 60 chars) |
| `metaDescription` | text | SEO meta description (max 160 chars) |
| `heroImage` | media (single) | Hero/banner image for city page |

#### Relations

| Field | Relation | Target |
|-------|----------|--------|
| `property_towns` | oneToMany | `api::property-town.property-town` |
| `properties` | oneToMany | `api::property.property` |

---

### 8.6 PropertyTown (Collection Type)

**API slug:** `property-town`  
**Endpoint:** `/api/property-towns`  
**Draft & Publish:** Yes  

#### Schema

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `town` | string | | Town / locality name |
| `slug` | uid | ✓ | Auto-generated from `town` |
| `metaTitle` | string | | SEO meta title (max 60 chars) |
| `metaDescription` | text | | SEO meta description (max 160 chars) |
| `seo` | component (repeatable) | | SEO meta tags array |

#### Relations

| Field | Relation | Target |
|-------|----------|--------|
| `property_city` | manyToOne | `api::property-city.property-city` |
| `properties` | oneToMany | `api::property.property` |

---

### 8.7 HomePage (Single Type)

**API slug:** `home-page`  
**Endpoint:** `/api/home-page`  
**Draft & Publish:** Yes  

#### Schema

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `carousel` | media (multiple) | ✓ | Hero carousel images/videos |
| `builderLogo` | media (multiple) | ✓ | Builder/partner logos |
| `content` | richtext | | Additional homepage text |
| `SEO` | component (repeatable) | | SEO meta tags array |
| `metaTitle` | string | | SEO meta title (max 60 chars) |
| `metaDescription` | text | | SEO meta description (max 160 chars) |

#### Recommended populate

```
/api/home-page?populate=carousel,builderLogo,SEO
```

---

### 8.8 WebConfig (Single Type)

**API slug:** `web-config`  
**Endpoint:** `/api/web-config`  
**Draft & Publish:** Yes  

#### Schema

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `title` | string | ✓ | | Website title for `<title>` tag |
| `linkedin` | string | | `https://www.linkedin.com/` | LinkedIn profile URL |
| `twitter` | string | | `https://www.x.com/` | Twitter/X profile URL |
| `instagram` | string | | `https://www.instagram.com/` | Instagram profile URL |
| `facebook` | string | | `https://www.facebook.com/` | Facebook profile URL |
| `youtube` | string | | `https://www.youtube.com/` | YouTube channel URL |
| `whatsapp` | string | | | WhatsApp contact number/link |
| `AboutPageSEO` | component (repeatable) | | | SEO meta tags for the About page |
| `AboutPageSEOMeta` | component (repeatable) | | | Additional SEO meta for the About page |

---

### 8.9 SEO Component

**Component name:** `seo.seo`  
**Type:** Repeatable component  
**Used by:** Properties  

#### Schema

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Meta tag name, e.g. `og:title`, `description` |
| `content` | string | Meta tag content value |

#### Usage on frontend

```jsx
property.SEO?.forEach(({ name, content }) => {
  // render <meta name={name} content={content} />
})
```

---

## 9. Relationship Map

```
PropertyCity
    │
    │ oneToMany
    ▼
PropertyTown ──── manyToOne ──── PropertyCity
    │
    │ oneToMany
    ▼
Property ──── manyToOne  ──── PropertyCity
    │
    ├── oneToOne  ──── PropertyType
    ├── oneToMany ──── Amenity
    └── manyToOne ──── users-permissions.User  (builder)
```

---

## 10. API Endpoints & Query Patterns

**Base URL:** `http://localhost:1337/api`

### All Content Types

| Resource | List | Single | Create | Update | Delete |
|----------|------|--------|--------|--------|--------|
| Properties | `GET /properties` | `GET /properties/:id` | `POST /properties` | `PUT /properties/:id` | `DELETE /properties/:id` |
| Blogs | `GET /blogs` | `GET /blogs/:id` | `POST /blogs` | `PUT /blogs/:id` | `DELETE /blogs/:id` |
| Amenities | `GET /amenities` | `GET /amenities/:id` | — | — | — |
| Property Types | `GET /property-types` | `GET /property-types/:id` | — | — | — |
| Property Cities | `GET /property-cities` | `GET /property-cities/:id` | — | — | — |
| Property Towns | `GET /property-towns` | `GET /property-towns/:id` | — | — | — |
| Home Page | `GET /home-page` | — | — | `PUT /home-page` | — |
| Web Config | `GET /web-config` | — | — | `PUT /web-config` | — |

### Useful Query Parameters

```
# Populate relations
?populate=image,imageGallery,property_city,property_town,property_type,amenities,SEO

# Populate all (use sparingly — expensive)
?populate=*

# Deep populate nested relations
?populate[property_city][populate][property_towns]=true

# Pagination
?pagination[page]=1&pagination[pageSize]=12

# Filtering
?filters[status][$eq]=Ready+to+Move
?filters[property_city][slug][$eq]=mumbai
?filters[BHK][$gte]=2
?filters[price][$lte]=10000000

# Sorting
?sort[0]=price:asc
?sort[0]=createdAt:desc

# Filter by slug (for dynamic routes)
?filters[slug][$eq]=my-property-slug&populate=*

# Combine
?filters[status][$eq]=Launched
  &filters[property_city][slug][$eq]=pune
  &pagination[pageSize]=9
  &sort[0]=createdAt:desc
  &populate=image,property_city,property_town,property_type
```

### Example: Fetch a property by slug (Next.js)

```typescript
const res = await fetch(
  `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/properties?filters[slug][$eq]=${slug}&populate=*`,
  {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
    next: { revalidate: 60 }, // ISR
  }
)
const { data } = await res.json()
const property = data[0]
```

---

## 11. Response Format

### List Endpoint

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Skyline Heights",
        "slug": "skyline-heights",
        "price": 8500000,
        "status": "Ready to Move",
        "BHK": 3,
        "exclusive": true,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-02-01T08:00:00.000Z",
        "publishedAt": "2024-01-16T00:00:00.000Z",
        "image": {
          "data": {
            "id": 5,
            "attributes": {
              "url": "https://res.cloudinary.com/.../image.jpg",
              "width": 1280,
              "height": 720,
              "alternativeText": "...",
              "formats": {
                "thumbnail": { "url": "..." },
                "small": { "url": "..." },
                "medium": { "url": "..." },
                "large": { "url": "..." }
              }
            }
          }
        },
        "property_city": {
          "data": {
            "id": 2,
            "attributes": { "city": "Pune", "slug": "pune" }
          }
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 4,
      "total": 100
    }
  }
}
```

### Single Type Endpoint (e.g., `/api/home-page`)

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "content": "<p>...</p>",
      "carousel": { "data": [ ... ] },
      "builderLogo": { "data": [ ... ] }
    }
  },
  "meta": {}
}
```

### Media Field Shape

```typescript
type StrapiMedia = {
  data: {
    id: number
    attributes: {
      url: string            // Full Cloudinary URL
      alternativeText: string | null
      width: number
      height: number
      mime: string           // "image/jpeg", "video/mp4", etc.
      formats: {
        thumbnail?: { url: string; width: number; height: number }
        small?: { url: string; width: number; height: number }
        medium?: { url: string; width: number; height: number }
        large?: { url: string; width: number; height: number }
      }
    }
  } | null
}
```

---

## 12. Authentication

**Plugin:** `@strapi/plugin-users-permissions`

### Login

```
POST /api/auth/local
Body: { "identifier": "user@email.com", "password": "..." }

Response:
{
  "jwt": "eyJ...",
  "user": { "id": 1, "username": "...", "email": "..." }
}
```

### Authenticated Request

```
GET /api/properties
Authorization: Bearer <JWT>
```

### API Token (for server-side Next.js calls)

Generate in: **Strapi Admin → Settings → API Tokens**  
Types available: Read-only, Full Access, Custom  
Pass as: `Authorization: Bearer <API_TOKEN>`

---

## 13. Frontend Integration Notes

### TypeScript Types (minimal)

```typescript
// Utility
type StrapiData<T> = { data: { id: number; attributes: T } | null }
type StrapiList<T> = { data: { id: number; attributes: T }[]; meta: { pagination: Pagination } }
type Pagination = { page: number; pageSize: number; pageCount: number; total: number }

// Content types
type Property = {
  title: string
  slug: string
  price: number
  location: string
  size: string
  BHK: number
  status: 'Coming Soon' | 'Delivered' | 'Launched' | 'Nearing Possession' | 'New Launched' | 'Ready to Move' | 'Resale' | 'Under Construction'
  exclusive: boolean
  description: string     // HTML string
  latitude: number | null
  longitude: number | null
  builtYear: number | null
  areaNumber: string | null
  image: StrapiData<MediaAttributes>
  imageGallery: { data: { id: number; attributes: MediaAttributes }[] }
  property_city: StrapiData<PropertyCity>
  property_town: StrapiData<PropertyTown>
  property_type: StrapiData<PropertyType>
  amenities: { data: { id: number; attributes: Amenity }[] }
  SEO: { name: string; content: string }[]
  metaDescription: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

type Blog = {
  title: string
  slug: string
  authorName: string
  authorEmail: string
  caption: string | null
  content: string   // HTML string
  image: StrapiData<MediaAttributes>   // single image
  ogImage: StrapiData<MediaAttributes>
  metaTitle: string | null
  metaDescription: string | null
  tags: string[] | null
  category: 'Market Insights' | "Buyer's Guide" | 'Destinations' | 'Investment' | 'Lifestyle' | null
  createdAt: string
  publishedAt: string | null
}

type MediaAttributes = {
  url: string
  alternativeText: string | null
  width: number
  height: number
  mime: string
  formats: Record<'thumbnail' | 'small' | 'medium' | 'large', { url: string; width: number; height: number } | undefined>
}

type PropertyType = { type: string; slug: string }
type Amenity = { amenity: string; iconId: string }
type WebConfig = {
  title: string
  linkedin: string
  twitter: string
  instagram: string
  facebook: string
  youtube: string
  whatsapp: string | null
  AboutPageSEO: { name: string; content: string }[]
  AboutPageSEOMeta: { name: string; content: string }[]
}
type HomePage = {
  carousel: { data: { id: number; attributes: MediaAttributes }[] }
  builderLogo: { data: { id: number; attributes: MediaAttributes }[] }
  content: string
  SEO: { name: string; content: string }[]
  metaTitle: string | null
  metaDescription: string | null
}
type PropertyCity = {
  city: string
  slug: string
  metaTitle: string | null
  metaDescription: string | null
  heroImage: StrapiData<MediaAttributes>
}
type PropertyTown = {
  town: string
  slug: string
  metaTitle: string | null
  metaDescription: string | null
  seo: { name: string; content: string }[]
}
```

### Performance Tips

1. **Use ISR (Incremental Static Regeneration):** Properties and blogs rarely change — use `next: { revalidate: 60 }` for listing pages and `revalidate: 300` for detail pages.

2. **Selective `populate`:** Never use `populate=*` in production. Specify only the fields you need to reduce payload size.

3. **Use Cloudinary's responsive formats:** Prefer `attributes.formats.medium.url` for listings and `attributes.formats.large.url` for detail pages. Fall back to `attributes.url` if a format doesn't exist.

4. **next/image with Cloudinary:** Add `res.cloudinary.com` to `next.config.js` `images.domains` or `images.remotePatterns`.

5. **Pagination for property listings:** Use `pagination[pageSize]=9` or `12` for grid layouts; never load all records.

6. **Filter published only:** Published content is returned by default. Don't add `filters[publishedAt][$notNull]=true` unless you specifically need to override this.

7. **Rich Text rendering:** Use `react-html-parser` or `html-react-parser` with DOMPurify sanitization, or render in a sandboxed component with `dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}`.

8. **Map integration:** Properties have `latitude` and `longitude` fields — use with Leaflet or Google Maps for property location display.

9. **Amenity icons:** Map `amenity.iconId` to your local icon set on the frontend (the slug-format ID lets you do `icon-swimming-pool`, etc.).

10. **Web Config:** Fetch once at the root layout level and pass via context/props — it holds the site title and social media links.

### next.config.js additions

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
}
module.exports = nextConfig
```

---

*Generated from Strapi backend codebase — `/Users/shivamsharma/Desktop/strapi-dhruni`*
