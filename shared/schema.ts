import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password"),
  authProvider: text("auth_provider").notNull().default("email"), // email, google, facebook
  displayName: text("display_name"),
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
  eventTypeOther: text("event_type_other"),
  
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
  unityCandle: boolean("unity_candle").default(false),
  sandCeremony: boolean("sand_ceremony").default(false),
  handfasting: boolean("handfasting").default(false),
  guestReadingOrSong: text("guest_reading_or_song"),
  guestReadingOrSongName: text("guest_reading_or_song_name"),
  officiantPassage: text("officiant_passage"),
  includingChild: text("including_child"),
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
  photographyStyle: text("photography_style"),
  mustHaveShots: text("must_have_shots"),
  vipList: text("vip_list"),
  groupPhotosRequested: text("group_photos_requested"),
  photographySpecialRequests: text("photography_special_requests"),
  
  // Block 10: Photo Projection
  photoProjectionPreferences: text("photo_projection_preferences"),
  
  // Block 11: Special Personal Touches
  freshFlorals: text("fresh_florals"),
  guestBook: text("guest_book"),
  cakeKnifeServiceSet: text("cake_knife_service_set"),
  departureOrganizer: text("departure_organizer"),
  departureVehicle: text("departure_vehicle"),
  personalTouchesSpecialInstructions: text("personal_touches_special_instructions"),
  
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
  
  // Block 13: Contact & Payment
  customerName: text("customer_name").notNull(),
  customerName2: text("customer_name_2"),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  smsConsent: boolean("sms_consent").default(false),
  mailingAddress: text("mailing_address"),
  
  // Pricing & Add-ons
  basePackagePrice: integer("base_package_price").notNull(),
  photoBookAddon: boolean("photo_book_addon").default(false),
  photoBookQuantity: integer("photo_book_quantity").default(1),
  extraTimeAddon: boolean("extra_time_addon").default(false),
  byobBarAddon: boolean("byob_bar_addon").default(false),
  rehearsalAddon: boolean("rehearsal_addon").default(false),
  totalPrice: integer("total_price").notNull(),
  
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
