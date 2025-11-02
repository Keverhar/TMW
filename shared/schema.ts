import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password"),
  authProvider: text("auth_provider").notNull().default("email"), // email, google, facebook
  
  // Account Information
  title: text("title"), // None, Mr., Dr., Ms., Mrs.
  firstName: text("first_name"),
  middleName: text("middle_name"),
  lastName: text("last_name"),
  suffix: text("suffix"), // None, Jr., Sr., II, III, IV
  displayName: text("display_name"),
  alternateEmail: text("alternate_email"),
  primaryPhone: text("primary_phone"),
  alternatePhone: text("alternate_phone"),
  
  // Address
  street: text("street"),
  aptNumber: text("apt_number"),
  city: text("city"),
  state: text("state"),
  zip: text("zip"),
  
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const weddingComposers = pgTable("wedding_composers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  
  // Block 1: Event Type
  eventType: text("event_type").notNull(),
  
  // Block 2: Date & Time
  preferredDate: text("preferred_date"),
  backupDate: text("backup_date"),
  timeSlot: text("time_slot"),
  
  // Block 3: Signature Color
  signatureColor: text("signature_color"),
  colorSwatchDecision: text("color_swatch_decision"),
  
  // Block 4: Music Selection
  processionalSong: text("processional_song"),
  recessionalSong: text("recessional_song"),
  receptionEntranceSong: text("reception_entrance_song"),
  cakeCuttingSong: text("cake_cutting_song"),
  fatherDaughterDanceSong: text("father_daughter_dance_song"),
  lastDanceSong: text("last_dance_song"),
  playlistUrl: text("playlist_url"),
  musicCompletionStatus: text("music_completion_status"),
  
  // Block 5: Announcements & Special Moments
  grandIntroduction: text("grand_introduction"),
  fatherDaughterDanceAnnouncement: text("father_daughter_dance_announcement"),
  toastsSpeechesAnnouncement: text("toasts_speeches_announcement"),
  guestCallouts: text("guest_callouts"),
  vibeCheck: text("vibe_check"),
  announcementsCompletionStatus: text("announcements_completion_status"),
  
  // Block 6: Ceremony Preferences
  ceremonyScript: text("ceremony_script").notNull(),
  vowChoices: text("vow_choices"),
  unityCandle: boolean("unity_candle").default(false),
  sandCeremony: boolean("sand_ceremony").default(false),
  handfasting: boolean("handfasting").default(false),
  guestReadingOrSongChoice: text("guest_reading_or_song_choice").default("no"),
  guestReadingOrSong: text("guest_reading_or_song"),
  guestReadingOrSongName: text("guest_reading_or_song_name"),
  officiantPassageChoice: text("officiant_passage_choice").default("no"),
  officiantPassage: text("officiant_passage"),
  includingChildChoice: text("including_child_choice").default("no"),
  includingChild: text("including_child"),
  childrenOrganizer: text("children_organizer"),
  petInvolvementChoice: text("pet_involvement_choice").default("no"),
  petPolicyAccepted: boolean("pet_policy_accepted").default(false),
  petInvolvement: text("pet_involvement"),
  ceremonySpecialRequests: text("ceremony_special_requests"),
  
  // Block 7: Processional & Seating
  walkingDownAisle: text("walking_down_aisle"),
  escortName: text("escort_name"),
  ringBearerIncluded: text("ring_bearer_included"),
  ringBearerFlowerGirl: text("ring_bearer_flower_girl"),
  ringBearerOrganizer: text("ring_bearer_organizer"),
  honoredGuestEscorts: text("honored_guest_escorts"),
  honoredGuestEscortsNA: boolean("honored_guest_escorts_na").default(false),
  brideSideFrontRow: text("bride_side_front_row"),
  brideSideFrontRowNA: boolean("bride_side_front_row_na").default(false),
  groomSideFrontRow: text("groom_side_front_row"),
  groomSideFrontRowNA: boolean("groom_side_front_row_na").default(false),
  framedPhotos: text("framed_photos"),
  framedPhotosNA: boolean("framed_photos_na").default(false),
  specialSeatingNeeds: text("special_seating_needs"),
  specialSeatingNeedsNA: boolean("special_seating_needs_na").default(false),
  processionalSpecialInstructions: text("processional_special_instructions"),
  processionalSpecialInstructionsNA: boolean("processional_special_instructions_na").default(false),
  processionalCompletionStatus: text("processional_completion_status"),
  
  // Block 8: Reception Preferences
  firstDance: text("first_dance"),
  firstDanceNA: boolean("first_dance_na").default(false),
  motherSonDance: text("mother_son_dance"),
  motherSonDanceNA: boolean("mother_son_dance_na").default(false),
  specialDances: text("special_dances"),
  specialDancesNA: boolean("special_dances_na").default(false),
  toastGivers: text("toast_givers"),
  toastGiversNA: boolean("toast_givers_na").default(false),
  beveragePreferences: text("beverage_preferences"),
  receptionSpecialRequests: text("reception_special_requests"),
  receptionSpecialRequestsNA: boolean("reception_special_requests_na").default(false),
  receptionCompletionStatus: text("reception_completion_status"),
  
  // Block 9: Photography Preferences
  mustHaveShots: text("must_have_shots"),
  mustHaveShotsNA: boolean("must_have_shots_na").default(false),
  vipList: text("vip_list"),
  vipListNA: boolean("vip_list_na").default(false),
  groupPhotosRequested: text("group_photos_requested"),
  groupPhotosRequestedNA: boolean("group_photos_requested_na").default(false),
  photographySpecialRequests: text("photography_special_requests"),
  photographySpecialRequestsNA: boolean("photography_special_requests_na").default(false),
  photographyCompletionStatus: text("photography_completion_status"),
  
  // Block 10: Memory Wall
  slideshowPhotos: text("slideshow_photos"), // JSON array of file metadata
  slideshowPhotosNA: boolean("slideshow_photos_na").default(false),
  engagementPhotos: text("engagement_photos"), // JSON array of file metadata
  engagementPhotosNA: boolean("engagement_photos_na").default(false),
  slideshowCompletionStatus: text("slideshow_completion_status"),
  
  // Block 11: Special Personal Touches
  freshFlorals: text("fresh_florals"),
  freshFloralsNA: boolean("fresh_florals_na").default(false),
  guestBookChoice: text("guest_book_choice").default("yes"),
  guestBook: text("guest_book"), // Details/comments
  cakeKnifeChoice: text("cake_knife_choice").default("no"),
  cakeKnifeServiceSet: text("cake_knife_service_set"), // Details/comments
  departureOrganizer: text("departure_organizer"),
  departureOrganizerTBD: boolean("departure_organizer_tbd").default(false),
  departureVehicleChoice: text("departure_vehicle_choice"),
  departureVehicle: text("departure_vehicle"), // Details if choice is yes
  personalTouchesSpecialInstructions: text("personal_touches_special_instructions"),
  personalTouchesSpecialInstructionsNA: boolean("personal_touches_special_instructions_na").default(false),
  personalTouchesCompletionStatus: text("personal_touches_completion_status"),
  
  // Block 12: Evite & Save-the-Date
  eviteDesignStyle: text("evite_design_style"),
  eviteHeaderText: text("evite_header_text"),
  eviteBodyText: text("evite_body_text"),
  eviteRsvpOption: text("evite_rsvp_option"),
  eviteRsvpCustomLink: text("evite_rsvp_custom_link"),
  eviteDesignNoSpecialRequests: boolean("evite_design_no_special_requests").default(false),
  eviteWordingNoSpecialRequests: boolean("evite_wording_no_special_requests").default(false),
  eviteRsvpNoSpecialRequests: boolean("evite_rsvp_no_special_requests").default(false),
  eviteCompletionStatus: text("evite_completion_status"),
  
  // Block 13: Contact & Payment - Couple Information
  person1Role: text("person1_role").notNull(), // Bride, Groom, Wife, Husband, Spouse, Partner, Other
  person1FullName: text("person1_full_name").notNull(),
  person1Pronouns: text("person1_pronouns"), // Optional: He/Him/His, She/Her/Hers, They/Them/Theirs, Prefer not to say
  person1Email: text("person1_email").notNull(),
  person1Phone: text("person1_phone").notNull(),
  person1AlternatePhone: text("person1_alternate_phone"), // Optional
  
  person2Role: text("person2_role").notNull(), // Bride, Groom, Wife, Husband, Spouse, Partner, Other
  person2FullName: text("person2_full_name").notNull(),
  person2Pronouns: text("person2_pronouns"), // Optional: He/Him/His, She/Her/Hers, They/Them/Theirs, Prefer not to say
  person2Email: text("person2_email"), // Optional
  person2Phone: text("person2_phone"), // Optional
  
  smsConsent: boolean("sms_consent").default(false),
  mailingAddress: text("mailing_address"),
  paymentMethod: text("payment_method").default("credit_card"),
  
  // Legacy columns (nullable for backward compatibility)
  customerName: text("customer_name"),
  customerName2: text("customer_name_2"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  
  // Pricing & Add-ons
  basePackagePrice: integer("base_package_price"),
  photoBookAddon: boolean("photo_book_addon").default(false),
  photoBookQuantity: integer("photo_book_quantity").default(1),
  photoBookPrice: integer("photo_book_price").default(30000), // Price per book in cents
  extraTimeAddon: boolean("extra_time_addon").default(false),
  extraTimePrice: integer("extra_time_price").default(100000), // Price in cents
  byobBarAddon: boolean("byob_bar_addon").default(false),
  byobBarPrice: integer("byob_bar_price").default(40000), // Price in cents
  rehearsalAddon: boolean("rehearsal_addon").default(false),
  rehearsalPrice: integer("rehearsal_price").default(15000), // Price in cents
  achDiscountAmount: integer("ach_discount_amount").default(10000), // ACH discount in cents
  affirmDiscountAmount: integer("affirm_discount_amount").default(5000), // Affirm discount in cents
  appliedDiscountAmount: integer("applied_discount_amount").default(0), // Actual discount applied and stored (one per account)
  totalPrice: integer("total_price"),
  amountPaid: integer("amount_paid").notNull().default(0),
  
  // Payment & Status
  paymentStatus: text("payment_status").notNull().default("pending"),
  stripeSessionId: text("stripe_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  termsAccepted: boolean("terms_accepted").default(false),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastEditedAt: timestamp("last_edited_at"),
});

export const insertWeddingComposerSchema = createInsertSchema(weddingComposers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  paymentStatus: true,
  stripeSessionId: true,
  stripePaymentIntentId: true,
});

export type InsertWeddingComposer = z.infer<typeof insertWeddingComposerSchema>;
export type WeddingComposer = typeof weddingComposers.$inferSelect;

// Keep the old bookings table for backwards compatibility during migration
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  weddingType: text("wedding_type").notNull(),
  weddingDate: text("wedding_date").notNull(),
  weddingTime: text("wedding_time").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  ceremonyScript: text("ceremony_script").notNull(),
  vows: text("vows").notNull(),
  music: text("music").array().notNull(),
  color: text("color").notNull(),
  cakeTopper: text("cake_topper").notNull(),
  totalPrice: integer("total_price").notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
  stripeSessionId: text("stripe_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  paymentStatus: true,
  stripeSessionId: true,
  stripePaymentIntentId: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// Admin tables for audit logging, payment tracking, and ceremony management
export const adminActions = pgTable("admin_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").notNull(),
  entityType: text("entity_type").notNull(), // booking, payment, ceremony, user
  entityId: varchar("entity_id").notNull(),
  action: text("action").notNull(), // create, update, delete, cancel, refund, capture
  payloadSnapshot: text("payload_snapshot"), // JSON snapshot of changes
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminActionSchema = createInsertSchema(adminActions).omit({
  id: true,
  createdAt: true,
});

export type InsertAdminAction = z.infer<typeof insertAdminActionSchema>;
export type AdminAction = typeof adminActions.$inferSelect;

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  composerId: varchar("composer_id").notNull(),
  amount: integer("amount").notNull(), // Amount in cents
  currency: text("currency").notNull().default("usd"),
  paymentMethod: text("payment_method").notNull(), // credit_card, ach, affirm, paypal, venmo, manual
  status: text("status").notNull().default("pending"), // pending, processing, captured, failed, refunded
  source: text("source").notNull().default("stripe"), // stripe, manual
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  refundedAmount: integer("refunded_amount").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  capturedAt: timestamp("captured_at"),
  refundedAt: timestamp("refunded_at"),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

export const ceremonyRuns = pgTable("ceremony_runs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  composerId: varchar("composer_id").notNull(),
  status: text("status").notNull().default("scheduled"), // scheduled, in_progress, completed, cancelled
  officiantId: varchar("officiant_id"),
  checklistData: text("checklist_data"), // JSON of checklist items
  scheduledAt: timestamp("scheduled_at"),
  actualStartAt: timestamp("actual_start_at"),
  actualEndAt: timestamp("actual_end_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCeremonyRunSchema = createInsertSchema(ceremonyRuns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCeremonyRun = z.infer<typeof insertCeremonyRunSchema>;
export type CeremonyRun = typeof ceremonyRuns.$inferSelect;
