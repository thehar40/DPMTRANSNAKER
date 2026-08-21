import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Memeriksa tabel Tutorial juga agar database lama otomatis disinkronkan
  // ketika fitur Tutorial ditambahkan.
  await prisma.tutorial.count();
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
    // Kode 2 berarti tabel/skema belum tersedia; start.bat akan menjalankan db push.
    process.exit(2);
  })
  .finally(() => prisma.$disconnect());
