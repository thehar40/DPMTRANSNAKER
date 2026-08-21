import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.user.count();
  if (count > 0) {
    console.log("DATABASE OK");
    process.exit(0);
  }
  console.log("DATABASE EMPTY");
  process.exit(1);
}

main()
  .catch((e) => {
    console.error("DATABASE NOT READY:", e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
