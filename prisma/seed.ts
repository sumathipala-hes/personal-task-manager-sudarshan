import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Sample1 records
  const sample1A = await prisma.sample1.create({
    data: {
      sampleField: "Sample 1A",
      sample2: {
        create: [
          { sampleField: "Sample 2A related to 1A" },
          { sampleField: "Sample 2B related to 1A" },
        ],
      },
    },
  });

  const sample1B = await prisma.sample1.create({
    data: {
      sampleField: "Sample 1B",
      sample2: {
        create: [{ sampleField: "Sample 2C related to 1B" }],
      },
    },
  });

  console.log({ sample1A, sample1B });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
