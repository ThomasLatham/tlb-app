-- CreateTable
CREATE TABLE "QueuedPostNotification" (
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "QueuedPostNotification_userId_postId_key" ON "QueuedPostNotification"("userId", "postId");

-- AddForeignKey
ALTER TABLE "QueuedPostNotification" ADD CONSTRAINT "QueuedPostNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
