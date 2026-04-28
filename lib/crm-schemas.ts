import { z } from 'zod';

// Bu dosya @studio/shared/types.ts'teki submit schema'larının kopyasıdır.
// Template standalone olduğu için monorepo paketine bağlanmıyor; elle senkronla.
// Hem client bileşenler (AppointmentForm, Contact) hem API route'lar buradan import eder.

export const TimeSlotSchema = z.enum(['morning', 'noon', 'afternoon', 'evening']);
export type TimeSlot = z.infer<typeof TimeSlotSchema>;

// --- Lead (iletişim formu) ---
export const LeadSubmitSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(50).optional(),
  message: z.string().trim().min(5).max(4000),
});
export type LeadSubmit = z.infer<typeof LeadSubmitSchema>;

// --- Appointment (randevu formu) ---
// --- Admin-side schemas (PATCH + note endpoints) ---

export const LeadStatusSchema = z.enum(['new', 'contacted', 'qualified', 'closed']);
export type LeadStatus = z.infer<typeof LeadStatusSchema>;

export const AppointmentStatusSchema = z.enum([
  'requested',
  'confirmed',
  'completed',
  'cancelled',
  'no-show',
]);
export type AppointmentStatus = z.infer<typeof AppointmentStatusSchema>;

export const LeadUpdateSchema = z
  .object({
    status: LeadStatusSchema.optional(),
    notes: z.string().trim().max(4000).nullable().optional(),
  })
  .refine(
    (data) => data.status !== undefined || data.notes !== undefined,
    { message: 'En az bir alan değiştirilmeli (status veya notes)' }
  );
export type LeadUpdate = z.infer<typeof LeadUpdateSchema>;

export const AppointmentUpdateSchema = z
  .object({
    status: AppointmentStatusSchema.optional(),
    notes: z.string().trim().max(4000).nullable().optional(),
  })
  .refine(
    (data) => data.status !== undefined || data.notes !== undefined,
    { message: 'En az bir alan değiştirilmeli (status veya notes)' }
  );
export type AppointmentUpdate = z.infer<typeof AppointmentUpdateSchema>;

export const NoteBodySchema = z.object({
  body: z.string().trim().min(1).max(2000),
});
export type NoteBody = z.infer<typeof NoteBodySchema>;

export const AppointmentSubmitSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200).optional(),
  phone: z.string().trim().min(7).max(50),
  service: z.string().trim().max(120).optional(),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Tarih YYYY-MM-DD formatında olmalı')
    .refine((val) => {
      // Bugün ≤ tarih ≤ bugün+60 gün (string karşılaştırması; TZ edge case minimize).
      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      now.setDate(now.getDate() + 60);
      const maxStr = now.toISOString().slice(0, 10);
      return val >= todayStr && val <= maxStr;
    }, 'Tarih bugünden önce veya 60 günden sonra olamaz'),
  preferredTime: TimeSlotSchema,
  notes: z.string().trim().max(2000).optional(),
});
export type AppointmentSubmit = z.infer<typeof AppointmentSubmitSchema>;
