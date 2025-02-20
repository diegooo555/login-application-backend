CREATE TYPE user_role AS ENUM ('ADMIN', 'USER');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');

CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_role user_role DEFAULT 'USER' NOT NULL,
    status user_status DEFAULT 'ACTIVE' NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMP NULL,
    last_login TIMESTAMP NULL
);

-- Crear un trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_updated_at
BEFORE UPDATE ON "User"
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
