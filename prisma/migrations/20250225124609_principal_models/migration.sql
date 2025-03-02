-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'STUDENT', 'TEACHER');

-- CreateTable
CREATE TABLE "User" (
    "id_user" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "resetToken" VARCHAR(255),
    "tokenExpiration" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id_user_role" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "user_role" "Role" NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id_user_role")
);

-- CreateTable
CREATE TABLE "Log" (
    "id_log" TEXT NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id_log")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
