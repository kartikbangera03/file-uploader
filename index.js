const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient();

async function main() {
    const allUsers = await prisma.user.findMany()
    console.log(allUsers)
    const allFolders =  await prisma.folder.findMany();
    console.log(allFolders);
    // const result = await prisma.user.deleteMany({})
    // const result2 = await prisma.folder.deleteMany({})
    // console.log(result)
    
    const newallUsers = await prisma.user.findMany()
    console.log(newallUsers)
    const newallFolders =  await prisma.folder.findMany();
    console.log(newallFolders);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })