-- CreateTable
CREATE TABLE "User_Name" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_Name_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post_Table" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Post_Table_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Name_email_key" ON "User_Name"("email");

-- AddForeignKey
ALTER TABLE "Post_Table" ADD CONSTRAINT "Post_Table_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User_Name"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
