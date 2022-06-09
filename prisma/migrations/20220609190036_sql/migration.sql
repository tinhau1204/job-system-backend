-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Student', 'Employer');

-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('FullTime', 'PartTime');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'ACCEPT', 'WAITING', 'REFUSE');

-- CreateTable
CREATE TABLE "Permission" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "name" STRING NOT NULL,

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionDetail" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "permissionId" INT8,
    "code" STRING NOT NULL,

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPermission" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "permissionId" INT8,
    "userId" INT8,

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "firstName" STRING NOT NULL,
    "lastName" STRING NOT NULL,
    "email" STRING NOT NULL,
    "password" STRING NOT NULL,
    "phoneNumber" STRING NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'Student',

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "generalInfo" STRING,
    "workingExperience" STRING,
    "wantedJobField" JSONB,
    "jobApplied" JSONB,
    "cv" BYTES[],
    "userId" INT8 NOT NULL,

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employer" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "companyDescription" STRING,
    "companyName" STRING,
    "companyAddress" STRING,
    "userId" INT8 NOT NULL,

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "name" STRING NOT NULL,
    "salary" INT4 NOT NULL,
    "place" STRING NOT NULL,
    "field" STRING NOT NULL,
    "employmentStatus" "EmploymentStatus" NOT NULL,
    "experienceNeeded" INT4 NOT NULL,
    "description" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employerId" INT8,

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobAppliedStatus" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "studentId" INT8,
    "jobId" INT8,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "JobStatus" NOT NULL DEFAULT E'PENDING',

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "PermissionDetail" ADD CONSTRAINT "PermissionDetail_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employer" ADD CONSTRAINT "Employer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobAppliedStatus" ADD CONSTRAINT "JobAppliedStatus_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobAppliedStatus" ADD CONSTRAINT "JobAppliedStatus_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
