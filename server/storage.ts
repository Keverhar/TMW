import { type User, type InsertUser, type Booking, type InsertBooking, type WeddingComposer, type InsertWeddingComposer } from "@shared/schema";
import { randomUUID } from "crypto";

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
  createWeddingComposer(composer: InsertWeddingComposer): Promise<WeddingComposer>;
  updateWeddingComposer(id: string, updates: Partial<InsertWeddingComposer>): Promise<WeddingComposer | undefined>;
  updateWeddingComposerPaymentStatus(id: string, paymentStatus: string, stripeSessionId?: string, stripePaymentIntentId?: string): Promise<WeddingComposer | undefined>;
  getAllWeddingComposers(): Promise<WeddingComposer[]>;
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

  async createWeddingComposer(insertComposer: InsertWeddingComposer): Promise<WeddingComposer> {
    const id = randomUUID();
    const now = new Date();
    const composer: WeddingComposer = {
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
      horsDoeuvresPreferences: null,
      sendOffStyle: null,
      receptionSpecialRequests: null,
      photographyStyle: null,
      mustHaveShots: null,
      vipList: null,
      groupPhotosRequested: null,
      photographySpecialRequests: null,
      photoProjectionPreferences: null,
      freshFlorals: null,
      guestBook: null,
      cakeKnifeServiceSet: null,
      departureOrganizer: null,
      departureVehicle: null,
      personalTouchesSpecialInstructions: null,
      ...insertComposer,
      customerName2: insertComposer.customerName2 ?? null,
      customerPhone: insertComposer.customerPhone ?? null,
      mailingAddress: insertComposer.mailingAddress ?? null,
      unityCandle: insertComposer.unityCandle ?? null,
      sandCeremony: insertComposer.sandCeremony ?? null,
      handfasting: insertComposer.handfasting ?? null,
      smsConsent: insertComposer.smsConsent ?? null,
      photoBookAddon: insertComposer.photoBookAddon ?? null,
      extraTimeAddon: insertComposer.extraTimeAddon ?? null,
      byobBarAddon: insertComposer.byobBarAddon ?? null,
      rehearsalAddon: insertComposer.rehearsalAddon ?? null,
      termsAccepted: insertComposer.termsAccepted ?? null,
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
}

export const storage = new MemStorage();
