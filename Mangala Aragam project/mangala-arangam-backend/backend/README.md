# Mangala Arangam — Backend

Spring Boot 3 / Java 17 REST API for the Mangala Arangam wedding hall
booking platform: JWT auth, role-based authorization (customer / owner /
admin), date-wise hall availability, the full booking → payment lifecycle,
reviews, wishlist, complaints, and admin approvals.

> **Note on this sandbox:** this code was written and structurally checked
> here, but the build environment has no access to Maven Central, so `mvn
> compile` could not be run in this chat. Build it locally where you have
> normal internet access — the steps below are standard Spring Boot.

## 1. Prerequisites

- Java 17+
- Maven 3.9+
- MySQL 8+

## 2. Database setup

Easiest: just start the app — `spring.jpa.hibernate.ddl-auto=update` and
`createDatabaseIfNotExist=true` will create the `mangala_arangam` schema and
tables automatically on first run.

If you'd rather set it up by hand first:

```bash
mysql -u root -p < ../database/schema.sql
mysql -u root -p < ../database/data.sql   # optional sample accounts + 1 hall
```

## 3. Backend configuration

Configuration lives in `src/main/resources/application.yml` and reads from
environment variables (with sane local defaults):

| Variable | Default | Purpose |
|---|---|---|
| `DB_USERNAME` | `root` | MySQL username |
| `DB_PASSWORD` | `root` | MySQL password |
| `JWT_SECRET` | (dev placeholder) | HMAC signing key — **set a real 32+ byte random secret in production** |
| `JWT_EXPIRATION_MS` | `86400000` (24h) | Token lifetime |
| `CORS_ORIGINS` | `http://localhost:5173` | Comma-separated allowed frontend origins |

Example `.env` / shell exports:

```bash
export DB_USERNAME=root
export DB_PASSWORD=your_mysql_password
export JWT_SECRET=$(openssl rand -base64 48)
export CORS_ORIGINS=http://localhost:5173
```

## 4. Run the backend

```bash
cd backend
mvn spring-boot:run
```

The API starts on `http://localhost:8080`.

To build a runnable jar instead:

```bash
mvn clean package
java -jar target/mangala-arangam-backend.jar
```

## 5. Sample accounts

If you loaded `database/data.sql`:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@mangalaarangam.in` | `Admin@123` |
| Owner | `owner@mangalaarangam.in` | `Owner@123` |
| Customer | `customer@mangalaarangam.in` | `Customer@123` |

Admin accounts cannot be self-registered through `/api/auth/register` (by
design — see `AuthService`) — create additional admins directly in the
database or promote a user's `role` column.

## 6. API overview

```
POST   /api/auth/register              Register (role: ROLE_CUSTOMER or ROLE_OWNER)
POST   /api/auth/login                 Returns a JWT

GET    /api/halls                      Public search (location, minPrice, maxPrice,
                                        minCapacity, minRating, facilities, date)
GET    /api/halls/{id}                 Hall details
POST   /api/halls                      [OWNER] Create hall (goes in as PENDING approval)
PUT    /api/halls/{id}                 [OWNER/ADMIN] Update hall
DELETE /api/halls/{id}                 [OWNER/ADMIN] Delete hall

GET    /api/halls/{id}/availability?start=...&end=...   Date-wise calendar
POST   /api/halls/{id}/availability    [OWNER] Block / unblock / maintenance a date
PUT    /api/halls/{id}/availability    [OWNER] Same as above

POST   /api/bookings                   [CUSTOMER] Send a booking request
GET    /api/bookings/my                [CUSTOMER] My bookings
GET    /api/owner/bookings             [OWNER] Requests for my halls
PUT    /api/bookings/{id}/approve      [OWNER] Approve -> CONFIRMED, date -> BOOKED
PUT    /api/bookings/{id}/reject       [OWNER] Reject -> REJECTED, date -> AVAILABLE
PUT    /api/bookings/{id}/cancel       [CUSTOMER/ADMIN] Cancel, date -> AVAILABLE

POST   /api/payments                   [CUSTOMER] Pay for a CONFIRMED booking
GET    /api/payments                   My payments (customer) or my halls' payments (owner)

POST   /api/reviews                    [CUSTOMER] Review after a COMPLETED booking
GET    /api/halls/{id}/reviews         Public reviews for a hall
GET    /api/owner/reviews              [OWNER] Reviews across my halls

POST   /api/wishlist                   [CUSTOMER] Add a hall
GET    /api/wishlist                   [CUSTOMER] My wishlist
DELETE /api/wishlist/{id}              [CUSTOMER] Remove

POST   /api/complaints                 [CUSTOMER] File a complaint
GET    /api/complaints/my              [CUSTOMER] My complaints

GET    /api/owner/dashboard            [OWNER] Stats: halls, pending requests, revenue…
GET    /api/owner/halls                [OWNER] My halls

GET    /api/admin/dashboard            [ADMIN] Platform-wide stats
GET    /api/admin/users                [ADMIN] All customers
GET    /api/admin/owners               [ADMIN] All owners
PUT    /api/admin/users/{id}/status    [ADMIN] Activate/deactivate a user
GET    /api/admin/halls                [ADMIN] All halls (any approval status)
PUT    /api/admin/halls/{id}/approve   [ADMIN] Approve a hall (goes public)
PUT    /api/admin/halls/{id}/reject    [ADMIN] Reject a hall
DELETE /api/admin/halls/{id}           [ADMIN] Delete a hall
GET    /api/admin/bookings             [ADMIN] All bookings
GET    /api/admin/complaints           [ADMIN] All complaints
PUT    /api/admin/complaints/{id}      [ADMIN] Update status / resolution notes
```

All protected endpoints expect `Authorization: Bearer <token>`.

## 7. Booking logic implemented (matches the original spec)

1. Customer selects a hall and date.
2. `BookingService.createBooking` checks `HallAvailability` for that date via
   `AvailabilityService.getEffectiveStatus` — a date with no explicit record
   defaults to `AVAILABLE`.
3. If available, a `Booking` is created with status `PENDING` and the date is
   flipped to `BOOKING_PENDING` — this is what stops a second customer from
   requesting the same date while the owner is deciding.
4. Owner sees the request under `GET /api/owner/bookings`.
5. `PUT /api/bookings/{id}/approve` → booking `CONFIRMED`, date `BOOKED`.
6. `PUT /api/bookings/{id}/reject` → booking `REJECTED`, date back to `AVAILABLE`.
7. `POST /api/payments` is only accepted for `CONFIRMED` bookings; on success
   the payment is marked `PAID`.
8. `PUT /api/bookings/{id}/cancel` (customer or admin) frees the date back to
   `AVAILABLE` regardless of which stage it was cancelled from.

Owners cannot set `BOOKED` / `BOOKING_PENDING` directly through the
availability endpoint — those two statuses are only ever set by the booking
workflow itself, so the calendar can't drift out of sync with real bookings.
Owners can still block a date (`UNAVAILABLE`), mark `MAINTENANCE`, or reopen
a date to `AVAILABLE`.

## 8. What's not wired up yet

- Real payment gateway integration (currently simulates a successful charge).
- Image upload endpoint (hall image URLs are accepted as strings — wire up
  multipart upload + storage, e.g. S3 or local disk under
  `app.uploads.directory`, when ready).
- Email/SMS delivery for notifications (in-app `Notification` rows are
  created; no external delivery yet).
- Automatic transition of `CONFIRMED` → `COMPLETED` after the event date
  passes (currently manual / would be a scheduled job).
