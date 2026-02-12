-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationCareerMapping" (
    "id" TEXT NOT NULL,
    "educationLevel" "EducationLevel" NOT NULL,
    "domainId" TEXT NOT NULL,

    CONSTRAINT "EducationCareerMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerRole" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "difficultyLevel" TEXT NOT NULL,
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "demand" TEXT,
    "estimatedDuration" TEXT,
    "minEducation" "EducationLevel" NOT NULL,
    "domainId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleSkill" (
    "roleId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "orderIndex" INTEGER,

    CONSTRAINT "RoleSkill_pkey" PRIMARY KEY ("roleId","skillId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Domain_name_key" ON "Domain"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EducationCareerMapping_educationLevel_domainId_key" ON "EducationCareerMapping"("educationLevel", "domainId");

-- AddForeignKey
ALTER TABLE "EducationCareerMapping" ADD CONSTRAINT "EducationCareerMapping_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerRole" ADD CONSTRAINT "CareerRole_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleSkill" ADD CONSTRAINT "RoleSkill_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "CareerRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleSkill" ADD CONSTRAINT "RoleSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
