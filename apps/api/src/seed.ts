import mongoose from 'mongoose';
import { config } from './config/env';
import { connectDatabase } from './config/database';
import { auth } from './auth/auth';
import { University } from './models/University';
import { Department } from './models/Department';
import { Course } from './models/Course';
import { Teacher } from './models/Teacher';
import { UserProfile } from './models/UserProfile';

const seedDatabase = async () => {
  console.log(`[Seed] Connecting to MongoDB at ${config.mongodbUri}...`);
  await connectDatabase();

  const db = mongoose.connection.db;
  if (!db) {
    console.error(`[Seed] Database connection unavailable.`);
    process.exit(1);
  }

  console.log(`[Seed] Dropping old database & indexes for a completely clean setup...`);
  try {
    await db.dropDatabase();
    console.log(`[Seed] Database dropped successfully.`);
  } catch (err) {
    console.warn(`[Seed] Notice:`, err);
  }

  console.log(`[Seed] Creating Academic Taxonomy (University, Department, Courses, Teachers)...`);
  const uni = await University.create({
    name: 'State University of Technology',
    code: 'SUT',
    domains: ['@university.edu', '@student.university.edu'],
    logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=120&q=80',
  });

  const cse = await Department.create({
    name: 'Computer Science & Engineering',
    code: 'CSE',
    universityId: uni._id,
  });

  await Department.create({
    name: 'Electrical & Electronic Engineering',
    code: 'EEE',
    universityId: uni._id,
  });

  await Course.create([
    {
      title: 'Data Structures & Algorithms II',
      code: 'CSE 2103',
      departmentId: cse._id,
      description: 'Advanced graph algorithms, dynamic programming, NP-completeness, and greedy strategy.',
      pantryHealthScore: 0,
    },
    {
      title: 'Database Management Systems',
      code: 'CSE 3101',
      departmentId: cse._id,
      description: 'Relational algebra, SQL normalization, indexing, transaction processing, and concurrency control.',
      pantryHealthScore: 0,
    },
    {
      title: 'Theory of Computation',
      code: 'CSE 3205',
      departmentId: cse._id,
      description: 'Automata theory, regular expressions, context-free grammars, Turing machines, and decidability.',
      pantryHealthScore: 0,
    },
  ]);

  await Teacher.create([
    {
      name: 'Dr. Alan Turing',
      title: 'Professor & Head',
      departmentId: cse._id,
      email: 'turing@university.edu',
    },
    {
      name: 'Dr. Grace Hopper',
      title: 'Associate Professor',
      departmentId: cse._id,
      email: 'hopper@university.edu',
    },
  ]);

  console.log(`[Seed] Creating Demo Account 1: Admin Account (admin@university.edu)...`);
  const adminAuth = await auth.api.signUpEmail({
    body: {
      name: 'Charity Admin',
      email: 'admin@university.edu',
      password: 'password123',
    },
  });

  await UserProfile.create({
    userId: adminAuth.user.id,
    email: 'admin@university.edu',
    name: 'Charity Admin',
    role: 'ADMIN',
    verificationStatus: 'VERIFIED',
    universityId: uni._id,
    departmentId: cse._id,
    charityPoints: 500,
    bio: 'System Administrator & Moderation Lead for Peer\'s Charity.',
  });

  console.log(`[Seed] Creating Demo Account 2: Nayem User Account (nayem@student.university.edu)...`);
  const nayemAuth = await auth.api.signUpEmail({
    body: {
      name: 'Nayem',
      email: 'nayem@student.university.edu',
      password: 'password123',
    },
  });

  await UserProfile.create({
    userId: nayemAuth.user.id,
    email: 'nayem@student.university.edu',
    name: 'Nayem',
    role: 'STUDENT',
    verificationStatus: 'VERIFIED',
    universityId: uni._id,
    departmentId: cse._id,
    semester: 'Level 3 / Term 2',
    studentIdNumber: '2024-CSE-042',
    charityPoints: 0,
    bio: 'Academic Benefactor & Computer Science Student.',
  });

  console.log(`\n=============================================================`);
  console.log(`[Seed] ✅ Database successfully reset and seeded!`);
  console.log(`-------------------------------------------------------------`);
  console.log(`🔑 ADMIN ACCOUNT:`);
  console.log(`   Email:    admin@university.edu`);
  console.log(`   Password: password123`);
  console.log(`   Role:     ADMIN`);
  console.log(`-------------------------------------------------------------`);
  console.log(`👤 USER ACCOUNT (Nayem):`);
  console.log(`   Email:    nayem@student.university.edu`);
  console.log(`   Password: password123`);
  console.log(`   Role:     STUDENT`);
  console.log(`=============================================================\n`);

  await mongoose.disconnect();
  process.exit(0);
};

seedDatabase().catch((err) => {
  console.error(`[Seed] Error seeding database:`, err);
  process.exit(1);
});
