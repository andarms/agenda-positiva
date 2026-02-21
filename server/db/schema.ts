import { sql } from 'drizzle-orm';
import { sqliteTable, integer, text, uniqueIndex, index } from "drizzle-orm/sqlite-core";


export const people_table = sqliteTable('people', {
  id: integer('id').primaryKey(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  age: integer('age').notNull(),
  phone_number: text('phone_number').unique().notNull(),
  email: text('email').unique(),
  identification_type: text('identification_type').notNull(),
  identification_number: text('identification_number').unique().notNull(),
  date_of_birth: text('date_of_birth').notNull(), // Using text for date storage in SQLite
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const attendance_groups_table = sqliteTable('attendance_groups', {
  id: integer('id').primaryKey(),
  group_leader_id: integer('group_leader_id'), // Optional: who is the main contact (no FK to avoid circular reference)
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});


export const event_table = sqliteTable('events', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  start_date: text('start_date').notNull(), // Using text for date storage in SQLite
  end_date: text('end_date').notNull(), // Using text for date storage in SQLite
  location: text('location').notNull(),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const registration_table = sqliteTable('registrations', {
  id: integer('id').primaryKey(),
  person_id: integer('person_id').notNull().references(() => people_table.id),
  event_id: integer('event_id').notNull().references(() => event_table.id),
  requires_accommodation: integer('requires_accommodation').notNull().default(0), // 0 for no, 1 for yes
  attendance_group_id: integer('attendance_group_id').references(() => attendance_groups_table.id), // Group for this specific registration
  relationship_to_leader: text('relationship_to_leader'), // e.g., "leader", "spouse", "child", "friend", "colleague" for this event
  status: text('status').notNull().default('pending'), // pending, confirmed, cancelled, completed, no_show
  especial_needs: text('especial_needs'), // Any special needs or accommodations required
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// ============================================================================
// indexes
// ============================================================================
export const registrationPersonEventIdx = uniqueIndex('person_event_idx').on(registration_table.person_id, registration_table.event_id);
export const registrationStatusIdx = index('status_idx').on(registration_table.status);
export const registrationEventIdx = index('event_idx').on(registration_table.event_id);
export const registrationGroupIdx = index('group_idx').on(registration_table.attendance_group_id);
export const peopleEmailIdx = uniqueIndex('people_email_idx').on(people_table.email);
export const peoplePhoneIdx = uniqueIndex('people_phone_idx').on(people_table.phone_number);
export const peopleIdNumberIdx = uniqueIndex('people_id_number_idx').on(people_table.identification_number);


// ============================================================================
// Types
// ============================================================================
export type InsertAttendanceGroup = typeof attendance_groups_table.$inferInsert;
export type SelectAttendanceGroup = typeof attendance_groups_table.$inferSelect;

export type InsertPerson = typeof people_table.$inferInsert;
export type SelectPerson = typeof people_table.$inferSelect;

export type InsertRegistration = typeof registration_table.$inferInsert;
export type SelectRegistration = typeof registration_table.$inferSelect;

export type InsertEvent = typeof event_table.$inferInsert;
export type SelectEvent = typeof event_table.$inferSelect;