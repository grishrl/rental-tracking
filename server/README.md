# Rental Server - TypeScript Backend

A flexible, database-agnostic Node.js/Express backend built with TypeScript, featuring a clean architecture with models, repositories, and services.

## Architecture Overview

### Models (`src/models/`)
- **BaseEntity**: Common interface for all entities (id, createdAt, updatedAt)
- **Rental**: Property rental model with full property details
- **User**: User model supporting tenants, landlords, and admins

### Repository Pattern (`src/repositories/`)
- **IRepository**: Generic repository interface for CRUD operations
- **BaseRepository**: Abstract base class for all repositories
- **InMemoryRepository**: In-memory implementation (current default)
- **PostgreSQLRepository**: Example PostgreSQL implementation (template)

### Services (`src/services/`)
- **RentalService**: Business logic for rental operations
- **UserService**: Business logic for user operations

### Configuration (`src/config/`)
- **DatabaseConfig**: Configuration for different database types
- **DatabaseFactory**: Factory pattern for creating repositories

### Dependency Injection (`src/container/`)
- **Container**: Simple DI container for managing services and repositories

## Database Abstraction

The system is designed to easily switch between different databases:

### Current: In-Memory (Development)
```typescript
const config: DatabaseConfig = { type: 'memory' };
```

### MongoDB (Future)
```typescript
const config: DatabaseConfig = {
  type: 'mongodb',
  connectionString: 'mongodb://localhost:27017/rental-db'
};
```

### PostgreSQL (Future)
```typescript
const config: DatabaseConfig = {
  type: 'postgresql',
  host: 'localhost',
  port: 5432,
  database: 'rental_db',
  username: 'user',
  password: 'password'
};
```

## API Endpoints

### Rentals
- `GET /api/rentals` - Get all available rentals (supports filtering)
- `GET /api/rentals/:id` - Get rental by ID
- `POST /api/rentals` - Create new rental
- `PUT /api/rentals/:id` - Update rental
- `DELETE /api/rentals/:id` - Delete rental

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user

### Search Parameters
The `/api/rentals` endpoint supports filtering:
- `location` - Filter by location
- `minPrice` & `maxPrice` - Price range filter
- `bedrooms` - Filter by number of bedrooms
- `bathrooms` - Filter by number of bathrooms
- `amenities` - Filter by amenities (array)

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm run build:watch` - Compile TypeScript in watch mode
- `npm start` - Start production server (requires build first)

## Adding New Database Support

To add support for a new database:

1. **Create Repository Implementation**
   ```typescript
   export class YourDBRepository<T extends BaseEntity> extends BaseRepository<T> {
     // Implement all abstract methods
   }
   ```

2. **Create Repository Factory**
   ```typescript
   export class YourDBRepositoryFactory implements IRepositoryFactory {
     createRentalRepository(): IRentalRepository { /* ... */ }
     createUserRepository(): IUserRepository { /* ... */ }
   }
   ```

3. **Update DatabaseFactory**
   ```typescript
   case 'yourdb':
     return new YourDBRepositoryFactory(config);
   ```

4. **Update Container Configuration**
   ```typescript
   const databaseConfig: DatabaseConfig = { type: 'yourdb' };
   ```

## Benefits of This Architecture

1. **Database Agnostic**: Easy to switch between databases
2. **Separation of Concerns**: Models, repositories, and services are separate
3. **Type Safety**: Full TypeScript support throughout
4. **Testable**: Each layer can be unit tested independently
5. **Scalable**: Easy to add new features and models
6. **Maintainable**: Clear structure and dependency injection