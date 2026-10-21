import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
await prisma.user.deleteMany({ where: { email: 'roundtrip@test.local' } })
const u = await prisma.user.create({
  data: { email: 'roundtrip@test.local', name: 'rt', passwordHash: 'x:'.repeat(8) },
})
const p = await prisma.progress.create({
  data: { userId: u.id, completedLessons: ['a'], exerciseResults: { 'a:e1': { passed: true, attempts: 1, hintsUsed: 0, ts: Date.now() } } },
})
await prisma.xpEvent.create({ data: { userId: u.id, id: 'xp:a:e1:pass', amount: 20, reason: 'exerciseFirstTry', ts: new Date() } })
const back = await prisma.progress.findUnique({
  where: { userId: u.id },
  include: { user: { include: { xpEvents: true } } },
})
console.log(JSON.stringify({ ok: !!back, lessons: back?.completedLessons, events: back?.user.xpEvents.length }))
await prisma.user.delete({ where: { id: u.id } }).catch(() => undefined)
const gone = await prisma.user.findUnique({ where: { email: 'roundtrip@test.local' } })
console.log(JSON.stringify({ deleted: gone === null }))
process.exit(0)
