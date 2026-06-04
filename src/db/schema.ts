import { pgTable, text, timestamp, integer, uuid, primaryKey, boolean } from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';

// =========================================================================
// 1. AUTH.JS CORE TABLES (Core User & Authentication Management)
// =========================================================================

export const users = pgTable('user', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique().notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  password: text('password'), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  })
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// =========================================================================
// 2. EXERCISE TRACKING TABLES (Workout Routines, Exercises & Logging Metrics)
// =========================================================================

export const workouts = pgTable('workout', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),                 // e.g., "AI Push Day Optimization", "Legs Focus"
  scheduledDate: timestamp('scheduled_date').notNull(),
  isCompleted: boolean('is_completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const exercises = pgTable('exercise', {
  id: uuid('id').primaryKey().defaultRandom(),
  workoutId: uuid('workout_id')
    .notNull()
    .references(() => workouts.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),                 // e.g., "Incline Dumbbell Press"
  targetMuscle: text('target_muscle').notNull(),  // e.g., "Chest"
  order: integer('order').notNull(),             // Sequence position for rendering inside list views
});

export const setLogs = pgTable('set_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  exerciseId: uuid('exercise_id')
    .notNull()
    .references(() => exercises.id, { onDelete: 'cascade' }),
  setNumber: integer('set_number').notNull(),
  weight: integer('weight').notNull(),           // Numeric pound or kilogram resistance value
  reps: integer('reps').notNull(),
  rpe: integer('rpe'),                           // Rate of Perceived Exertion metric (scale 1-10)
  isCompleted: boolean('is_completed').default(false).notNull(),
});

// =========================================================================
// 3. AI CHAT HISTORY TABLES (Conversational Logs with Groq Coach)
// =========================================================================

export const chatMessages = pgTable('chat_message', {
  id: uuid('id').primaryKey().defaultRandom(),
  // Swapped back to userId so our API route can save messages directly to the user
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  // Updated to 'assistant' to match Vercel AI SDK standards
  role: text('role').$type<'user' | 'assistant' | 'system'>().notNull(), 
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});


// =========================================================================
// 4. USER SETTINGS TABLE
// =========================================================================


export const userSettings = pgTable("user_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().unique(), // Unique so one user = one settings profile
  age: integer("age"),
  weight: integer("weight"), // in lbs or kg
  targetWeight: integer("target_weight"),
  height: text("height"),
  gender: text("gender"),
  goal: text("goal"), // e.g., "Build Muscle", "Lose Fat"
  activityLevel: text("activity_level"),
  equipment: text("equipment"), // e.g., "Full Gym", "Dumbbells only"
  dietaryRestrictions: text("dietary_restrictions"),
  medicalLimitations: text("medical_limitations"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});