# file-uploader


model User{
  id Int @id @default(autoincrement())
  username  String @db.VarChar(255) @unique
  password  String @db.VarChar(255)
  folderKey Folder @relation(fields:[folderId] , references:[id])
  folderId Int @unique
}

model Folder{
  id Int @id @default(autoincrement())
  name String @db.VarChar(255)
  parentFolder Folder? @relation("ParentFolderRelation" , fields:[parentFolderId] , references:[id])
  parentFolderId Int?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user User
  file File?
}

model File{
  id Int @id @default(autoincrement())
  name String @db.VarChar(255)
  size Int
  url String @db.VarChar(255)
  parentFolder Folder @relation(fields:[parentFolderId] , references:[id])
  parentFolderId Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}