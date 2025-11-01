import { type User, type InsertUser, type Booking, type InsertBooking, type WeddingComposer, type InsertWeddingComposer, users, bookings, weddingComposers } from "@shared/schema";
import { randomUUID } from "crypto";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Legacy booking methods (for backwards compatibility)
  getBooking(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingPaymentStatus(id: string, paymentStatus: string, stripeSessionId?: string, stripePaymentIntentId?: string): Promise<Booking | undefined>;
  getAllBookings(): Promise<Booking[]>;
  
  // Wedding Composer methods
  getWeddingComposer(id: string): Promise<WeddingComposer | undefined>;
  getWeddingComposersByUserId(userId: string): Promise<WeddingComposer[]>;
  createWeddingComposer(composer: InsertWeddingComposer): Promise<WeddingComposer>;
  updateWeddingComposer(id: string, updates: Partial<InsertWeddingComposer>): Promise<WeddingComposer | undefined>;
  updateWeddingComposerPaymentStatus(id: string, paymentStatus: string, stripeSessionId?: string, stripePaymentIntentId?: string): Promise<WeddingComposer | undefined>;
  getAllWeddingComposers(): Promise<WeddingComposer[]>;
  getBookedDateTimeSlots(): Promise<Array<{ date: string; timeSlot: string; eventType: string }>>;
  checkDateTimeAvailability(date: string, timeSlot: string, excludeComposerId?: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private bookings: Map<string, Booking>;
  private weddingComposers: Map<string, WeddingComposer>;

  constructor() {
    this.users = new Map();
    this.bookings = new Map();
    this.weddingComposers = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = { 
      ...insertUser,
      displayName: insertUser.displayName ?? null,
      password: insertUser.password ?? null,
      authProvider: insertUser.authProvider ?? "email",
      id,
      createdAt: now,
    };
    this.users.set(id, user);
    return user;
  }

  // Legacy booking methods
  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = {
      ...insertBooking,
      id,
      paymentStatus: "pending",
      stripeSessionId: null,
      stripePaymentIntentId: null,
      createdAt: new Date(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBookingPaymentStatus(
    id: string,
    paymentStatus: string,
    stripeSessionId?: string,
    stripePaymentIntentId?: string
  ): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;

    const updatedBooking: Booking = {
      ...booking,
      paymentStatus,
      stripeSessionId: stripeSessionId ?? booking.stripeSessionId,
      stripePaymentIntentId: stripePaymentIntentId ?? booking.stripePaymentIntentId,
    };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  // Wedding Composer methods
  async getWeddingComposer(id: string): Promise<WeddingComposer | undefined> {
    return this.weddingComposers.get(id);
  }

  async getWeddingComposersByUserId(userId: string): Promise<WeddingComposer[]> {
    return Array.from(this.weddingComposers.values()).filter(
      (composer) => composer.userId === userId
    );
  }

  async createWeddingComposer(insertComposer: InsertWeddingComposer): Promise<WeddingComposer> {
    const id = randomUUID();
    const now = new Date();
    const composer: WeddingComposer = {
      userId: null,
      eventTypeOther: null,
      preferredDate: null,
      backupDate: null,
      timeSlot: null,
      signatureColor: null,
      colorSwatchDecision: null,
      processionalSong: null,
      recessionalSong: null,
      receptionEntranceSong: null,
      cakeCuttingSong: null,
      fatherDaughterDanceSong: null,
      lastDanceSong: null,
      playlistUrl: null,
      grandIntroduction: null,
      fatherDaughterDanceAnnouncement: null,
      toastsSpeechesAnnouncement: null,
      guestCallouts: null,
      vibeCheck: null,
      guestReadingOrSong: null,
      guestReadingOrSongName: null,
      officiantPassage: null,
      includingChild: null,
      petInvolvement: null,
      ceremonySpecialRequests: null,
      walkingDownAisle: null,
      ringBearerFlowerGirl: null,
      ringBearerOrganizer: null,
      honoredGuestEscorts: null,
      brideSideFrontRow: null,
      groomSideFrontRow: null,
      framedPhotos: null,
      specialSeatingNeeds: null,
      processionalSpecialInstructions: null,
      firstDance: null,
      motherSonDance: null,
      specialDances: null,
      toastGivers: null,
      beveragePreferences: null,
      receptionSpecialRequests: null,
      mustHaveShots: null,
      vipList: null,
      groupPhotosRequested: null,
      photographySpecialRequests: null,
      freshFlorals: null,
      guestBook: null,
      cakeKnifeServiceSet: null,
      departureOrganizer: null,
      departureVehicle: null,
      personalTouchesSpecialInstructions: null,
      ...insertComposer,
      id,
      paymentStatus: "pending",
      stripeSessionId: null,
      stripePaymentIntentId: null,
      createdAt: now,
      updatedAt: now,
      lastEditedAt: null,
    };
    this.weddingComposers.set(id, composer);
    return composer;
  }

  async updateWeddingComposer(
    id: string,
    updates: Partial<InsertWeddingComposer>
  ): Promise<WeddingComposer | undefined> {
    const composer = this.weddingComposers.get(id);
    if (!composer) return undefined;

    const updatedComposer: WeddingComposer = {
      ...composer,
      ...updates,
      updatedAt: new Date(),
      lastEditedAt: new Date(),
    };
    this.weddingComposers.set(id, updatedComposer);
    return updatedComposer;
  }

  async updateWeddingComposerPaymentStatus(
    id: string,
    paymentStatus: string,
    stripeSessionId?: string,
    stripePaymentIntentId?: string
  ): Promise<WeddingComposer | undefined> {
    const composer = this.weddingComposers.get(id);
    if (!composer) return undefined;

    const updatedComposer: WeddingComposer = {
      ...composer,
      paymentStatus,
      stripeSessionId: stripeSessionId ?? composer.stripeSessionId,
      stripePaymentIntentId: stripePaymentIntentId ?? composer.stripePaymentIntentId,
      updatedAt: new Date(),
    };
    this.weddingComposers.set(id, updatedComposer);
    return updatedComposer;
  }

  async getAllWeddingComposers(): Promise<WeddingComposer[]> {
    return Array.from(this.weddingComposers.values());
  }

  async getBookedDateTimeSlots(): Promise<Array<{ date: string; timeSlot: string; eventType: string }>> {
    const paidComposers = Array.from(this.weddingComposers.values()).filter(
      (composer) => composer.paymentStatus === 'completed' && composer.preferredDate && composer.timeSlot
    );
    return paidComposers.map(c => ({
      date: c.preferredDate!,
      timeSlot: c.timeSlot!,
      eventType: c.eventType
    }));
  }

  async checkDateTimeAvailability(date: string, timeSlot: string, excludeComposerId?: string): Promise<boolean> {
    const conflict = Array.from(this.weddingComposers.values()).find(
      (composer) =>
        composer.paymentStatus === 'completed' &&
        composer.preferredDate === date &&
        composer.timeSlot === timeSlot &&
        composer.id !== excludeComposerId
    );
    return !conflict; // Returns true if available (no conflict)
  }
}

export class DbStorage implements IStorage {
  private db;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    const sql = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql);
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Legacy booking methods
  async getBooking(id: string): Promise<Booking | undefined> {
    const result = await this.db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    return result[0];
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const result = await this.db.insert(bookings).values(insertBooking).returning();
    return result[0];
  }

  async updateBookingPaymentStatus(
    id: string,
    paymentStatus: string,
    stripeSessionId?: string,
    stripePaymentIntentId?: string
  ): Promise<Booking | undefined> {
    const result = await this.db
      .update(bookings)
      .set({
        paymentStatus,
        stripeSessionId: stripeSessionId ?? undefined,
        stripePaymentIntentId: stripePaymentIntentId ?? undefined,
      })
      .where(eq(bookings.id, id))
      .returning();
    return result[0];
  }

  async getAllBookings(): Promise<Booking[]> {
    return await this.db.select().from(bookings);
  }

  // Wedding Composer methods
  async getWeddingComposer(id: string): Promise<WeddingComposer | undefined> {
    const result = await this.db.select().from(weddingComposers).where(eq(weddingComposers.id, id)).limit(1);
    return result[0];
  }

  async getWeddingComposersByUserId(userId: string): Promise<WeddingComposer[]> {
    return await this.db.select().from(weddingComposers).where(eq(weddingComposers.userId, userId));
  }

  async createWeddingComposer(insertComposer: InsertWeddingComposer): Promise<WeddingComposer> {
    const result = await this.db.insert(weddingComposers).values(insertComposer).returning();
    return result[0];
  }

  async updateWeddingComposer(
    id: string,
    updates: Partial<InsertWeddingComposer>
  ): Promise<WeddingComposer | undefined> {
    const result = await this.db
      .update(weddingComposers)
      .set({
        ...updates,
        updatedAt: new Date(),
        lastEditedAt: new Date(),
      })
      .where(eq(weddingComposers.id, id))
      .returning();
    return result[0];
  }

  async updateWeddingComposerPaymentStatus(
    id: string,
    paymentStatus: string,
    stripeSessionId?: string,
    stripePaymentIntentId?: string
  ): Promise<WeddingComposer | undefined> {
    const result = await this.db
      .update(weddingComposers)
      .set({
        paymentStatus,
        stripeSessionId: stripeSessionId ?? undefined,
        stripePaymentIntentId: stripePaymentIntentId ?? undefined,
        updatedAt: new Date(),
      })
      .where(eq(weddingComposers.id, id))
      .returning();
    return result[0];
  }

  async getAllWeddingComposers(): Promise<WeddingComposer[]> {
    return await this.db.select().from(weddingComposers);
  }

  async getBookedDateTimeSlots(): Promise<Array<{ date: string; timeSlot: string; eventType: string }>> {
    const result = await this.db
      .select({
        date: weddingComposers.preferredDate,
        timeSlot: weddingComposers.timeSlot,
        eventType: weddingComposers.eventType,
      })
      .from(weddingComposers)
      .where(eq(weddingComposers.paymentStatus, 'completed'));
    
    // Filter out null values
    return result.filter(r => r.date && r.timeSlot).map(r => ({
      date: r.date!,
      timeSlot: r.timeSlot!,
      eventType: r.eventType
    }));
  }

  async checkDateTimeAvailability(date: string, timeSlot: string, excludeComposerId?: string): Promise<boolean> {
    const query = this.db
      .select()
      .from(weddingComposers)
      .where(eq(weddingComposers.paymentStatus, 'completed'));
    
    const results = await query;
    
    const conflict = results.find(
      (composer) =>
        composer.preferredDate === date &&
        composer.timeSlot === timeSlot &&
        composer.id !== excludeComposerId
    );
    
    return !conflict; // Returns true if available (no conflict)
  }
}

// Use DbStorage for database persistence
export const storage = new DbStorage();
