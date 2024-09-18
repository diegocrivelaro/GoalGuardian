import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const goals = pgTable('goals', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  title: text('title').notNull(),
  desiredWeeklyFrequency: integer('desired_weekly_frequency').notNull(),
});

export const goalCompletions = pgTable('goal_completions', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  goalId: serial('goal_id')
    .references(() => goals.id)
    .notNull(),
});
