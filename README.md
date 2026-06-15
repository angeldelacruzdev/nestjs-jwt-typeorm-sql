# NestJS Auth API

API de autenticación con **NestJS 11**, **JWT**, **Drizzle ORM** y **MariaDB/MySQL**.

## Stack

| Tecnología | Versión |
|---|---|
| NestJS | 11.x |
| Drizzle ORM | 0.45.x |
| Passport (JWT) | 0.7.x |
| MariaDB | latest |
| TypeScript | 5.9.x |
| class-validator | 0.15.x |

## Requisitos

- Node.js >= 22
- Docker Desktop (para el entorno de base de datos)
- npm >= 10

## Instalación

```bash
git clone <repo-url>
cd nestjs-jwt-typeorm-sql
npm install --legacy-peer-deps
```

## Variables de entorno

Copiar `.env.example` a `.env` y ajustar según entorno:

```bash
cp .env.example .env
```

| Variable | Descripción | Default |
|---|---|---|
| `JWT_SECRET` | Secreto para access token | — |
| `JWT_REFRESH_SECRET` | Secreto para refresh token | — |
| `JWT_EXPIRATION_TIME` | Tiempo de expiración (segundos) | 21600 |
| `PORT` | Puerto del servidor | 3000 |
| `MARIADB_HOST` | Host de la base de datos | localhost |
| `MARIADB_PORT` | Puerto de la base de datos | 3306 |
| `MARIADB_USER` | Usuario DB | root |
| `MARIADB_PASSWORD` | Contraseña DB | — |
| `MARIADB_DATABASE` | Nombre de la base de datos | cats_shop |

## Docker (recomendado)

```bash
# Iniciar servicios (MariaDB + API)
docker compose up -d

# Ver logs
docker compose logs -f

# Detener y limpiar volúmenes
docker compose down -v
```

La API estará disponible en `http://localhost:8081`.

## Desarrollo local

```bash
# Asegurarse de que MariaDB esté corriendo (Docker)
docker compose up -d mariadb

# Iniciar en modo watch
npm run start:dev
```

## Migraciones (Drizzle)

```bash
# Generar migración tras cambios en esquema
npm run db:generate

# Aplicar migraciones (requiere DB corriendo en localhost:3306)
npm run db:migrate

# Abrir Drizzle Studio (UI para explorar datos)
npm run db:studio

# Aplicar migraciones dentro del contenedor Docker
docker compose exec -u root -e DRIZZLE_HOST=mariadb nestjs-api npx drizzle-kit migrate
```

## Tests

```bash
# Unit tests
npm test

# En modo watch
npm run test:watch

# Cobertura
npm run test:cov

# E2E
npm run test:e2e
```

## Documentación API (Swagger)

Con la API corriendo, acceder a:

```
http://localhost:8081/api/docs
```

Swagger mostrará todos los endpoints agrupados por etiquetas (Auth, Users). Los endpoints protegidos requieren hacer clic en **Authorize** e ingresar el token JWT con formato `Bearer <token>`.

## Endpoints

### Auth

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | Público | Iniciar sesión |
| POST | `/api/auth/register` | Público | Registrar usuario |
| POST | `/api/auth/logout` | JWT | Cerrar sesión |
| POST | `/api/auth/refresh` | Público | Refrescar tokens |

### Users

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/users` | JWT | Crear usuario |
| GET | `/api/users` | JWT | Listar usuarios |
| GET | `/api/users/:id` | JWT | Obtener usuario |
| PATCH | `/api/users/:id` | JWT | Actualizar usuario |
| DELETE | `/api/users/:id` | JWT | Eliminar usuario |

## Flujo de autenticación

1. **Registro** → `POST /api/auth/register` → recibe `{ access_token, refresh_token }`
2. **Login** → `POST /api/auth/login` → recibe `{ access_token, refresh_token }`
3. **Acceso** → usar `Authorization: Bearer <access_token>` en endpoints protegidos
4. **Refresh** → `POST /api/auth/refresh` con `Authorization: Bearer <refresh_token>` → nuevos tokens
5. **Logout** → `POST /api/auth/logout` → invalida el refresh token

## Estructura del proyecto

```
src/
├── main.ts                  # Punto de entrada + Swagger
├── app.module.ts            # Módulo raíz
├── common/
│   ├── decorators/          # @Public(), @GetCurrentUser(), @GetCurrentUserId()
│   ├── guards/              # AtGuard (JWT global), RtGuard (refresh)
│   ├── hash.service.ts      # HashService (bcrypt)
│   └── common.module.ts     # Módulo global
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts   # Endpoints de autenticación
│   └── auth.service.ts      # Lógica de login, register, refresh, logout
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts  # CRUD de usuarios
│   ├── users.service.ts     # Lógica con Drizzle ORM
│   └── dto/                 # CreateUserDto, UpdateUserDto
├── database/
│   ├── database.module.ts
│   ├── drizzle.module.ts    # Provider de Drizzle
│   ├── drizzle.provider.ts  # Conexión MySQL con drizzle-orm
│   └── schema/
│       └── users.ts         # Esquema de la tabla users
└── dto/
    └── auth.dto.ts          # AuthDto (email, password)
```
