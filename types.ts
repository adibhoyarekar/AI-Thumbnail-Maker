
export interface User {
  id: string; // Unique identifier from the database
  name: string; // Full Name
  username: string;
  email: string;
  plan: 'Free' | 'Premium';
  password?: string; // Only used in the mock DB, should not be exposed to client state
  profilePhoto?: string;
  role?: 'YouTuber' | 'Gamer' | 'Educator' | 'Vlogger';
  preferredLanguage?: Language;
}

export interface BrandKit {
  brandName: string;
  slogan: string;
  primaryColor: string;
  secondaryColor: string;
  fontPreference: string;
}

export enum ThumbnailStyle {
  // Free
  Default = 'Default',
  Gaming = 'Gaming',
  Vlogging = 'Vlogging',
  Tech = 'Tech',
  Music = 'Music',
  Fitness = 'Fitness',
  // Premium
  Educational = 'Educational',
  Minimalist = 'Minimalist',
  Lifestyle = 'Lifestyle',
  Cinematic = 'Cinematic',
  Cartoon = 'Cartoon',
  Anime = 'Anime',
  ComicBook = 'Comic Book',
  Neon = 'Neon Glow',
  Luxury = 'Luxury & Elegant',
  Travel = 'Travel & Adventure',
  Action = 'High-Action',
  Abstract = 'Abstract',
  Vintage = 'Vintage',
  SciFi = 'Sci-Fi',
}

export enum Language {
    English = 'English',
    Spanish = 'Spanish',
    Hindi = 'Hindi',
}

export enum TextTone {
    Default = 'Catchy',
    Professional = 'Professional',
    Casual = 'Casual',
    Humorous = 'Humorous',
    Urgent = 'Urgent',
}

export enum TextStyle {
    Default = 'Statement',
    Question = 'Question',
    Exclamation = 'Exclamation',
    List = 'List',
}


export interface FormData {
  prompt: string;
  thumbnailText: string;
  style: ThumbnailStyle;
  language: Language;
  audience: string;
  textTone: TextTone;
  textStyle: TextStyle;
  detailedPrompt: string;
}

export interface HistoryItem {
    prompt: string;
    imageUrls: string[];
    timestamp: string;
}

export interface BulkInputItem {
  title: string;
  style: string;
}

export interface BulkResult {
  title: string;
  style: string;
  suggestion: string;
}

export interface CTRScoreResult {
  score: number;
  feedback: string[];
}

export interface AITemplateIdea {
  name: string;
  description: string;
  prompt: string;
}

export interface SignUpData {
    fullName: string;
    username: string;
    email: string;
    profilePhoto?: string;
    role?: 'YouTuber' | 'Gamer' | 'Educator' | 'Vlogger';
    preferredLanguage?: Language;
}

export interface SignUpDataWithPassword extends SignUpData {
    password: string;
}