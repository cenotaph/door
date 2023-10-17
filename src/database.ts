import { PrismaClient, Nfc } from '@prisma/client'

const prisma = new PrismaClient()

export const checkTag = async (tag: string): Promise<boolean> => {
  const theTag = await prisma.nfc.findUnique({ where: { tag: tag }, include: { user: true } })
  if (!theTag) return false
  else return theTag.active
}

export const insertNewTag = async (tag: string): Promise<Nfc> => {
  return await prisma.nfc.create({
    data: {
      tag: tag,
      active: true
    }
  })
}
