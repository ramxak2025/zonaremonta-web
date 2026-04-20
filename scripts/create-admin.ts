// Одноразовое создание директора. Запуск:
//   cd apps/api && pnpm tsx ../../scripts/create-admin.ts director@05auto.ru "StrongPassword123!" "Имя Директора"
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const [email, password, fullName] = process.argv.slice(2);
if (!email || !password) {
  console.error('Usage: tsx create-admin.ts <email> <password> [fullName]');
  process.exit(1);
}

const prisma = new PrismaClient();
const run = async () => {
  const hash = await argon2.hash(password, { type: argon2.argon2id });
  const user = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash: hash, role: 'DIRECTOR' },
    create: { email: email.toLowerCase(), passwordHash: hash, role: 'DIRECTOR' },
  });
  console.log(`✅ directоr создан: ${user.email}, id=${user.id}. 2FA настроится при первом входе.`);
};
run().finally(() => prisma.$disconnect());
