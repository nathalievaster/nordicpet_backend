import prisma from './client.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  try {
    // Hashar lösenordet
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    // Upsert för att uppdatera admin-användaren om den redan finns, annars skapa en ny
    const admin = await prisma.user.upsert({
      // Leta efter användaren baserat på email
      where: { email: process.env.ADMIN_EMAIL },
      // Om användaren finns görs inga ändringar
      update: {},
      // Om användaren inte finns, skapa en ny med angivna detaljer
      create: {
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin'
      }
    });

    console.log('Admin user ensured:', admin.email);
  } catch (err) {
    console.error('Error creating admin user:', err);
  }
}

main()
// Fångar eventuella fel från main-funktionen
  .catch(console.error)
  // Stänger Prisma-klienten när scriptet är klart
  .finally(async () => prisma.$disconnect());