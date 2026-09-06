import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';
import { connectDatabase } from '../config/database.js';
import { auth } from '../auth/auth.js';
import { University } from '../models/University.js';
import { Department } from '../models/Department.js';
import { Course } from '../models/Course.js';
import { Teacher } from '../models/Teacher.js';
import { UserProfile } from '../models/UserProfile.js';
import { Resource } from '../models/Resource.js';
import { Rating } from '../models/Rating.js';
import { Review } from '../models/Review.js';
import { Bookmark } from '../models/Bookmark.js';
import { Download } from '../models/Download.js';
import { QualityScoreService } from '../services/QualityScoreService.js';

export const seedDemoDatabase = async () => {
  console.log(`\n=============================================================`);
  console.log(`🚀 PEER'S CHARITY — COMPREHENSIVE DEMO SEEDER`);
  console.log(`=============================================================`);
  console.log(`[Seed] Connecting to MongoDB at ${config.mongodbUri}...`);
  await connectDatabase();

  const db = mongoose.connection.db;
  if (!db) {
    console.error(`[Seed] ❌ Database connection unavailable.`);
    process.exit(1);
  }

  // ---------------------------------------------------------
  // Phase 1: Database Teardown (Safe Collection Reset)
  // ---------------------------------------------------------
  console.log(`\n[Phase 1] 🧹 Safely cleaning existing collections (preserving indexes)...`);
  await Promise.all([
    Resource.deleteMany({}),
    Review.deleteMany({}),
    Rating.deleteMany({}),
    Bookmark.deleteMany({}),
    Download.deleteMany({}),
    UserProfile.deleteMany({}),
    Course.deleteMany({}),
    Department.deleteMany({}),
    University.deleteMany({}),
    Teacher.deleteMany({}),
  ]);

  // Clean Better Auth collections if present
  try {
    await db.collection('user').deleteMany({});
    await db.collection('account').deleteMany({});
    await db.collection('session').deleteMany({});
    await db.collection('verification').deleteMany({});
  } catch (err) {
    // Better Auth collections may not exist yet
  }
  console.log(`[Phase 1] ✅ Collections safely emptied.`);

  // ---------------------------------------------------------
  // Phase 1: Seed Academic Taxonomy (BAUST)
  // ---------------------------------------------------------
  console.log(`\n[Phase 1] 🏛️ Seeding BAUST Academic Taxonomy (University, Departments, Courses)...`);
  const uni = await University.create({
    name: 'Bangladesh Army University of Science and Technology',
    code: 'BAUST',
    domains: ['@baust.edu.bd', '@student.baust.edu.bd', '@demo.com'],
    logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=120&q=80',
  });

  const cse = await Department.create({
    name: 'Computer Science & Engineering',
    code: 'CSE',
    universityId: uni._id,
  });

  const eee = await Department.create({
    name: 'Electrical & Electronic Engineering',
    code: 'EEE',
    universityId: uni._id,
  });

  const [cse2103, cse2104, cse2105, cse2106, eee1201, math2101] = await Course.create([
    {
      title: 'Database Systems',
      code: 'CSE 2103',
      departmentId: cse._id,
      description: 'Relational algebra, SQL normalization, indexing, transaction processing, and concurrency control.',
      pantryHealthScore: 85,
    },
    {
      title: 'Database Sessional',
      code: 'CSE 2104',
      departmentId: cse._id,
      description: 'Hands-on database laboratory with SQL DDL/DML, complex joins, views, triggers, and procedures.',
      pantryHealthScore: 80,
    },
    {
      title: 'Object Oriented Programming',
      code: 'CSE 2105',
      departmentId: cse._id,
      description: 'C++ object-oriented design, polymorphism, templates, memory management, and design patterns.',
      pantryHealthScore: 90,
    },
    {
      title: 'OOP Sessional',
      code: 'CSE 2106',
      departmentId: cse._id,
      description: 'Practical software engineering laboratory in C++ applying OOP principles to term projects.',
      pantryHealthScore: 88,
    },
    {
      title: 'Basic Electrical Engineering',
      code: 'EEE 1201',
      departmentId: eee._id,
      description: 'DC circuit analysis, AC circuits, sinusoidal steady-state, and operational amplifiers.',
      pantryHealthScore: 75,
    },
    {
      title: 'Mathematics III (Differential Equations)',
      code: 'MATH 2101',
      departmentId: cse._id,
      description: 'Ordinary differential equations, series solutions, Laplace transforms, and boundary value problems.',
      pantryHealthScore: 70,
    },
  ]);

  const [turing, hopper] = await Teacher.create([
    {
      name: 'Dr. Alan Turing',
      title: 'Professor & Head',
      departmentId: cse._id,
      email: 'turing@baust.edu.bd',
    },
    {
      name: 'Dr. Grace Hopper',
      title: 'Associate Professor',
      departmentId: cse._id,
      email: 'hopper@baust.edu.bd',
    },
  ]);

  // ---------------------------------------------------------
  // Phase 1: Seed Demo Users
  // ---------------------------------------------------------
  console.log(`\n[Phase 1] 👤 Seeding Demo Users with hashed credentials...`);
  const standardPassword = 'DemoPassword123!';
  const bcryptHash = await bcrypt.hash(standardPassword, 10);

  const demoUsersConfig = [
    {
      email: 'admin@demo.com',
      name: 'System Administrator',
      role: 'ADMIN' as const,
      charityPoints: 500,
      bio: 'System Administrator & Moderation Lead for Peer\'s Charity at BAUST.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      semester: 'Faculty / Admin',
      studentIdNumber: 'EMP-BAUST-001',
    },
    {
      email: 'top.contributor@demo.com',
      name: 'Sarah Ahmed',
      role: 'STUDENT' as const,
      charityPoints: 420,
      bio: 'CSE 11th Batch • Top Philanthropist • Handwritten notes & BCNF slides curator.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      semester: 'Level 2 / Term 1',
      studentIdNumber: '2024-CSE-007',
    },
    {
      email: 'student@demo.com',
      name: 'Tanvir Hasan',
      role: 'STUDENT' as const,
      charityPoints: 60,
      bio: 'CSE 12th Batch • Constant learner & academic resource explorer.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      semester: 'Level 2 / Term 1',
      studentIdNumber: '2024-CSE-042',
    },
    {
      email: 'moderator@demo.com',
      name: 'Nafis Iqbal',
      role: 'MODERATOR' as const,
      charityPoints: 180,
      bio: 'Charity Police Moderator • Ensuring verified solutions and clean notes.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      semester: 'Level 3 / Term 2',
      studentIdNumber: '2023-CSE-019',
    },
  ];

  const createdUsers: Record<string, { id: string; name: string; email: string; role: string }> = {};

  for (const u of demoUsersConfig) {
    let userId = `user_${u.email.split('@')[0].replace('.', '_')}`;

    // Attempt Better Auth signup for direct credential authentication
    try {
      const authRes = await auth.api.signUpEmail({
        body: {
          name: u.name,
          email: u.email,
          password: standardPassword,
        },
      });
      if (authRes && authRes.user) {
        userId = authRes.user.id;
      }
    } catch (e: any) {
      // Fallback: manually insert into Better Auth collections if signUpEmail fails
      await db.collection('user').insertOne({
        _id: userId as any,
        id: userId,
        name: u.name,
        email: u.email,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await db.collection('account').insertOne({
        _id: new mongoose.Types.ObjectId() as any,
        userId: userId,
        accountId: userId,
        providerId: 'credential',
        password: bcryptHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Create corresponding UserProfile document
    await UserProfile.create({
      userId,
      email: u.email,
      name: u.name,
      role: u.role,
      verificationStatus: 'VERIFIED',
      universityId: uni._id,
      departmentId: cse._id,
      charityPoints: u.charityPoints,
      bio: u.bio,
      avatarUrl: u.avatarUrl,
      semester: u.semester,
      studentIdNumber: u.studentIdNumber,
    });

    createdUsers[u.email] = {
      id: userId,
      name: u.name,
      email: u.email,
      role: u.role,
    };
  }
  console.log(`[Phase 1] ✅ 4 Demo Users created.`);

  // ---------------------------------------------------------
  // Phase 2: Seed the 3-Tier Taxonomy (8 Demo Files)
  // ---------------------------------------------------------
  console.log(`\n[Phase 2] 📚 Seeding 3-Tier Academic Taxonomy (8 Demo Items)...`);
  const topContributorId = createdUsers['top.contributor@demo.com'].id;
  const studentId = createdUsers['student@demo.com'].id;
  const adminId = createdUsers['admin@demo.com'].id;
  const moderatorId = createdUsers['moderator@demo.com'].id;

  // Item A: Question - CSE 2103 Final
  const itemA = await Resource.create({
    title: 'CSE 2103: Database Systems - Fall 2023 Semester Final Paper',
    description: 'Official BAUST final exam question paper for CSE 2103 covering ER diagrams, relational algebra, SQL queries, and BCNF normalization.',
    uploaderId: topContributorId,
    universityId: uni._id,
    departmentId: cse._id,
    courseId: cse2103._id,
    semester: 'Level 2 / Term 1',
    teacherId: turing._id,
    academicMetadata: {
      section: 'question',
      semester: 'L-2 T-1',
      batch: '11',
      examType: 'FINAL',
    },
    resourceType: 'Previous Exam Questions',
    topics: ['Database Systems', 'SQL', 'Normalization', 'ER Diagrams'],
    tags: ['Exam', 'Final', 'Fall23', 'Batch11'],
    fileUrl: 'https://utfs.io/f/demo-cse2103-final-2023.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 2450000,
    status: 'PUBLISHED',
    qualityScore: 78,
    stats: { viewsCount: 140, downloadsCount: 45, ratingsCount: 2, averageRating: 4.5, bookmarksCount: 12 },
  });

  // Item B: Question - CSE 2105 Mid
  const itemB = await Resource.create({
    title: 'CSE 2105: Object Oriented Programming - Spring 2024 Mid-Term Paper',
    description: 'Mid-term exam paper on OOP fundamentals: polymorphism, abstract classes, operator overloading, and exception handling in C++.',
    uploaderId: studentId,
    universityId: uni._id,
    departmentId: cse._id,
    courseId: cse2105._id,
    semester: 'Level 2 / Term 1',
    teacherId: hopper._id,
    academicMetadata: {
      section: 'question',
      semester: 'L-2 T-1',
      batch: '12',
      examType: 'MID',
    },
    resourceType: 'Previous Exam Questions',
    topics: ['OOP', 'C++', 'Polymorphism', 'Operator Overloading'],
    tags: ['MidTerm', 'Spring24', 'Batch12'],
    fileUrl: 'https://utfs.io/f/demo-cse2105-mid-2024.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 1820000,
    status: 'PUBLISHED',
    qualityScore: 72,
    stats: { viewsCount: 95, downloadsCount: 28, ratingsCount: 1, averageRating: 4.0, bookmarksCount: 8 },
  });

  // Item C: Question - EEE 1201 CT
  const itemC = await Resource.create({
    title: 'EEE 1201: Class Test 02 - AC Circuit Analysis & Thevenin Theorem',
    description: 'Class test paper covering sinusoidal steady-state analysis, mesh/nodal analysis, and Thevenin/Norton equivalent circuits.',
    uploaderId: moderatorId,
    universityId: uni._id,
    departmentId: eee._id,
    courseId: eee1201._id,
    semester: 'Level 1 / Term 2',
    academicMetadata: {
      section: 'question',
      semester: 'L-1 T-2',
      batch: '12',
      examType: 'CT',
    },
    resourceType: 'Previous Exam Questions',
    topics: ['Circuit Analysis', 'AC Circuits', 'Thevenin Theorem'],
    tags: ['CT', 'ClassTest', 'Batch12', 'EEE'],
    fileUrl: 'https://utfs.io/f/demo-eee1201-ct02.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 980000,
    status: 'PUBLISHED',
    qualityScore: 70,
    stats: { viewsCount: 75, downloadsCount: 19, ratingsCount: 1, averageRating: 4.0, bookmarksCount: 5 },
  });

  // Item D: Course Material - CSE 2103 Slides
  const itemD = await Resource.create({
    title: 'Normalization (1NF to BCNF) Lecture Slides',
    description: 'Complete lecture slide deck explaining functional dependencies, lossless decomposition, dependency preservation, 1NF, 2NF, 3NF, and BCNF with solved examples.',
    uploaderId: topContributorId,
    universityId: uni._id,
    departmentId: cse._id,
    courseId: cse2103._id,
    semester: 'Level 2 / Term 1',
    teacherId: turing._id,
    academicMetadata: {
      section: 'course_material',
      semester: 'L-2 T-1',
      batch: '11',
      materialType: 'SLIDES',
    },
    resourceType: 'Presentations',
    topics: ['Normalization', 'BCNF', 'Database Design', 'Functional Dependencies'],
    tags: ['Slides', 'Lecture', 'BCNF', 'Batch11'],
    fileUrl: 'https://utfs.io/f/demo-db-normalization-slides.pptx',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    sizeBytes: 5200000,
    status: 'PUBLISHED',
    qualityScore: 92,
    stats: { viewsCount: 240, downloadsCount: 78, ratingsCount: 3, averageRating: 4.8, bookmarksCount: 28 },
  });

  // Item E: Course Material - CSE 2105 Notes
  const itemE = await Resource.create({
    title: 'C++ Pointers and Memory Management Cheat Sheet',
    description: 'Comprehensive handwritten study notes covering pointer arithmetic, dynamic memory allocation (new/delete), smart pointers (unique/shared/weak), and avoiding memory leaks.',
    uploaderId: topContributorId,
    universityId: uni._id,
    departmentId: cse._id,
    courseId: cse2105._id,
    semester: 'Level 2 / Term 1',
    teacherId: hopper._id,
    academicMetadata: {
      section: 'course_material',
      semester: 'L-2 T-1',
      batch: '12',
      materialType: 'HAND_NOTE',
    },
    resourceType: 'Lecture Notes',
    topics: ['C++', 'Pointers', 'Smart Pointers', 'Memory Management'],
    tags: ['Notes', 'CheatSheet', 'HandNotes', 'Batch12'],
    fileUrl: 'https://utfs.io/f/demo-cpp-memory-cheatsheet.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 3100000,
    status: 'PUBLISHED',
    qualityScore: 96,
    stats: { viewsCount: 350, downloadsCount: 112, ratingsCount: 3, averageRating: 5.0, bookmarksCount: 42 },
  });

  // Item F: Course Material - MATH 2101 External Link
  const itemF = await Resource.create({
    title: 'Ordinary Differential Equations & Laplace Transforms - Complete Video Playlist',
    description: 'Curated video lecture series covering first-order ODEs, second-order linear differential equations with constant coefficients, and Laplace transforms for engineering applications.',
    uploaderId: adminId,
    universityId: uni._id,
    departmentId: cse._id,
    courseId: math2101._id,
    semester: 'Level 2 / Term 1',
    academicMetadata: {
      section: 'course_material',
      semester: 'L-2 T-1',
      batch: '11',
      materialType: 'EXTERNAL_LINK',
      externalLink: 'https://www.youtube.com/watch?v=mock-math-video',
    },
    resourceType: 'Tutorials',
    topics: ['Differential Equations', 'Laplace Transform', 'Calculus', 'Engineering Math'],
    tags: ['Video', 'YouTube', 'ExternalLink', 'Math'],
    fileUrl: 'https://www.youtube.com/watch?v=mock-math-video',
    mimeType: 'application/link',
    sizeBytes: 0,
    status: 'PUBLISHED',
    qualityScore: 84,
    stats: { viewsCount: 160, downloadsCount: 52, ratingsCount: 2, averageRating: 4.5, bookmarksCount: 18 },
  });

  // Item G: Sessional - CSE 2104 Lab 04
  const itemG = await Resource.create({
    title: 'Lab 04: Advanced SQL Joins and Subqueries Lab Manual & Solutions',
    description: 'Complete lab report including schema setup, queries with INNER/LEFT/FULL joins, correlated subqueries, and output screenshots.',
    uploaderId: topContributorId,
    universityId: uni._id,
    departmentId: cse._id,
    courseId: cse2104._id,
    semester: 'Level 2 / Term 1',
    teacherId: turing._id,
    academicMetadata: {
      section: 'sessional',
      batch: '11',
      labNumber: 'Lab 04',
      topic: 'Advanced SQL Joins and Subqueries',
    },
    resourceType: 'Lab Reports',
    topics: ['SQL Joins', 'Subqueries', 'Database Lab', 'Oracle'],
    tags: ['Lab04', 'Sessional', 'Manual', 'Batch11'],
    fileUrl: 'https://utfs.io/f/demo-cse2104-lab04.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 4100000,
    status: 'PUBLISHED',
    qualityScore: 88,
    stats: { viewsCount: 180, downloadsCount: 54, ratingsCount: 2, averageRating: 4.5, bookmarksCount: 19 },
  });

  // Item H: Sessional - CSE 2106 Term Project
  const itemH = await Resource.create({
    title: 'Term Project: Library Management System - Full C++ Source Code',
    description: 'Production-ready C++ semester project implementing book issuance, user accounts, file persistence, OOP principles, and clean modular architecture.',
    uploaderId: topContributorId,
    universityId: uni._id,
    departmentId: cse._id,
    courseId: cse2106._id,
    semester: 'Level 2 / Term 1',
    teacherId: hopper._id,
    academicMetadata: {
      section: 'sessional',
      batch: '12',
      labNumber: 'Project',
      topic: 'Library Management System - Full C++ Source Code',
    },
    resourceType: 'Lab Reports',
    topics: ['C++ Project', 'OOP Design', 'Library System', 'File Handling'],
    tags: ['Project', 'SourceCode', 'C++', 'Batch12'],
    fileUrl: 'https://utfs.io/f/demo-cse2106-oop-project.zip',
    mimeType: 'application/zip',
    sizeBytes: 7800000,
    status: 'PUBLISHED',
    qualityScore: 90,
    stats: { viewsCount: 210, downloadsCount: 65, ratingsCount: 2, averageRating: 4.5, bookmarksCount: 22 },
  });

  console.log(`[Phase 2] ✅ 8 Academic Taxonomy Items created.`);

  // ---------------------------------------------------------
  // Phase 3: Seed Engagement (Ratings, Reviews, Bookmarks, Bayesian Quality Score)
  // ---------------------------------------------------------
  console.log(`\n[Phase 3] 💬 Seeding Ratings, Reviews, Bookmarks, and calculating Bayesian RQS...`);

  // Ratings on Top Contributor's Items
  await Rating.create([
    { resourceId: itemD._id, userId: studentId, stars: 5 },
    { resourceId: itemD._id, userId: moderatorId, stars: 4 },
    { resourceId: itemD._id, userId: adminId, stars: 5 },

    { resourceId: itemE._id, userId: studentId, stars: 5 },
    { resourceId: itemE._id, userId: moderatorId, stars: 5 },
    { resourceId: itemE._id, userId: adminId, stars: 5 },

    { resourceId: itemG._id, userId: studentId, stars: 5 },
    { resourceId: itemG._id, userId: adminId, stars: 4 },

    { resourceId: itemH._id, userId: moderatorId, stars: 5 },
    { resourceId: itemH._id, userId: adminId, stars: 4 },
  ]);

  // Reviews on Top Contributor's Items
  await Review.create([
    {
      resourceId: itemD._id,
      userId: studentId,
      userName: 'Tanvir Hasan',
      content: 'This saved me during the midterm! The BCNF decomposition examples are crystal clear.',
    },
    {
      resourceId: itemE._id,
      userId: moderatorId,
      userName: 'Nafis Iqbal',
      content: 'Super detailed cheat sheet on smart pointers and memory leaks. Exactly what our batch needed.',
    },
    {
      resourceId: itemG._id,
      userId: studentId,
      userName: 'Tanvir Hasan',
      content: 'Lab report solutions are 100% accurate. Code ran directly on the university server.',
    },
    {
      resourceId: itemH._id,
      userId: adminId,
      userName: 'System Administrator',
      content: 'Clean architecture and exceptional OOP decomposition. Exemplary term project contribution.',
    },
  ]);

  // Bookmarks for student@demo.com
  await Bookmark.create([
    { userId: studentId, resourceId: itemD._id },
    { userId: studentId, resourceId: itemE._id },
    { userId: studentId, resourceId: itemG._id },
  ]);

  // Downloads for student@demo.com
  await Download.create([
    { userId: studentId, resourceId: itemD._id },
    { userId: studentId, resourceId: itemE._id },
    { userId: studentId, resourceId: itemG._id },
    { userId: studentId, resourceId: itemA._id },
  ]);

  // Recalculate precise Bayesian RQS on all items using QualityScoreService
  const allItems = [itemA, itemB, itemC, itemD, itemE, itemF, itemG, itemH];
  for (const item of allItems) {
    const ratings = await Rating.find({ resourceId: item._id });
    const count = ratings.length;
    const avg = count > 0 ? ratings.reduce((sum, r) => sum + r.stars, 0) / count : item.stats.averageRating;
    const rqs = QualityScoreService.calculateRQS({
      averageRating: avg,
      ratingsCount: count,
      downloadsCount: item.stats.downloadsCount,
      bookmarksCount: item.stats.bookmarksCount,
    });
    item.qualityScore = rqs;
    item.stats.ratingsCount = count;
    item.stats.averageRating = parseFloat(avg.toFixed(1));
    await item.save();
  }

  console.log(`[Phase 3] ✅ Engagement records & Bayesian RQS successfully populated.`);

  // ---------------------------------------------------------
  // Phase 4: CLI Formatting & Standings Summary
  // ---------------------------------------------------------
  console.log(`\n=============================================================`);
  console.log(`🎉 DEMO SEED COMPLETED SUCCESSFULLY!`);
  console.log(`=============================================================`);
  console.log(`🔑 DEMO ACCOUNTS (Password: ${standardPassword}):`);
  console.log(`-------------------------------------------------------------`);
  console.log(`1. Admin:           admin@demo.com           (Role: ADMIN, Points: 500)`);
  console.log(`2. Top Contributor: top.contributor@demo.com (Role: STUDENT, Points: 420, Rank #1)`);
  console.log(`3. Moderator:       moderator@demo.com       (Role: MODERATOR, Points: 180)`);
  console.log(`4. Student:         student@demo.com         (Role: STUDENT, Points: 60)`);
  console.log(`-------------------------------------------------------------`);
  console.log(`🏛️ ACADEMIC TAXONOMY SEEDED:`);
  console.log(`   University:  BAUST (Bangladesh Army University of Science and Technology)`);
  console.log(`   Departments: CSE (Computer Science & Eng), EEE (Electrical & Electronic Eng)`);
  console.log(`   Courses:     6 Courses (CSE 2103, CSE 2104, CSE 2105, CSE 2106, EEE 1201, MATH 2101)`);
  console.log(`-------------------------------------------------------------`);
  console.log(`📚 3-TIER RESOURCES (8 Items):`);
  console.log(`   📝 Questions: 3 Items (CSE 2103 Final, CSE 2105 Mid, EEE 1201 CT)`);
  console.log(`   📖 Materials: 3 Items (Normalization Slides, C++ Notes, Math Video Link)`);
  console.log(`   🔬 Sessional: 2 Items (CSE 2104 Lab 04 Manual, CSE 2106 OOP Project Code)`);
  console.log(`-------------------------------------------------------------`);
  console.log(`⭐ ENGAGEMENT & LEADERBOARD:`);
  console.log(`   Top Contributor RQS: Item E (C++ Pointers): 90+ RQS`);
  console.log(`   Bookmarks:           3 items saved in student@demo.com's Treasure Vault`);
  console.log(`   Reviews:             4 verified reviews attached`);
  console.log(`=============================================================\n`);

  await mongoose.disconnect();
};

// Allow CLI execution directly
if (process.argv[1] && process.argv[1].includes('seed-demo')) {
  seedDemoDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Seed Error]:', err);
      process.exit(1);
    });
}
