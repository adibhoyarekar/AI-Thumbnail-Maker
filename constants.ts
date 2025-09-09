import { ThumbnailStyle, Language, TextTone, TextStyle } from './types';

export const FREE_THUMBNAIL_STYLES: ThumbnailStyle[] = [
  ThumbnailStyle.Default,
  ThumbnailStyle.Gaming,
  ThumbnailStyle.Vlogging,
  ThumbnailStyle.Tech,
  ThumbnailStyle.Music,
  ThumbnailStyle.Fitness,
];

export const PREMIUM_THUMBNAIL_STYLES: ThumbnailStyle[] = [
  ThumbnailStyle.Educational,
  ThumbnailStyle.Minimalist,
  ThumbnailStyle.Lifestyle,
  ThumbnailStyle.Cinematic,
  ThumbnailStyle.Cartoon,
  ThumbnailStyle.Anime,
  ThumbnailStyle.ComicBook,
  ThumbnailStyle.Neon,
  ThumbnailStyle.Luxury,
  ThumbnailStyle.Travel,
  ThumbnailStyle.Action,
  ThumbnailStyle.Abstract,
  ThumbnailStyle.Vintage,
  ThumbnailStyle.SciFi,
];

export const THUMBNAIL_STYLES: ThumbnailStyle[] = [
  ...FREE_THUMBNAIL_STYLES,
  ...PREMIUM_THUMBNAIL_STYLES,
];

export const LANGUAGES: Language[] = [
    Language.English,
    Language.Spanish,
    Language.Hindi,
];

export const TEXT_TONES: TextTone[] = [
    TextTone.Default,
    TextTone.Professional,
    TextTone.Casual,
    TextTone.Humorous,
    TextTone.Urgent,
];

export const TEXT_STYLES: TextStyle[] = [
    TextStyle.Default,
    TextStyle.Question,
    TextStyle.Exclamation,
    TextStyle.List,
];

export interface StylePreset {
  name: string;
  icon: string;
  style: ThumbnailStyle;
  description: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  { name: 'Gaming', icon: '🎮', style: ThumbnailStyle.Gaming, description: 'Bold, neon, and high-energy for gaming content.' },
  { name: 'Movie/Drama', icon: '🎥', style: ThumbnailStyle.Cinematic, description: 'Dark, elegant, and cinematic for reviews or analysis.' },
  { name: 'Education', icon: '📚', style: ThumbnailStyle.Educational, description: 'Clean, bright, and clear for educational videos.' },
  { name: 'Music', icon: '🎤', style: ThumbnailStyle.Music, description: 'Vibrant, glowing, and stylish for music videos or covers.' },
  { name: 'Fitness', icon: '💪', style: ThumbnailStyle.Fitness, description: 'Energetic, bright, and impactful for fitness channels.' },
  { name: 'Tech Review', icon: '⚙️', style: ThumbnailStyle.Tech, description: 'Sleek, modern, and clean for tech content.' },
  { name: 'Travel Vlog', icon: '🌴', style: ThumbnailStyle.Travel, description: 'Vibrant, scenic, and adventurous for travel vlogs.' },
  { name: 'Action Scene', icon: '💥', style: ThumbnailStyle.Action, description: 'Dynamic, explosive, and intense for action-packed videos.' },
  { name: 'Minimalist', icon: '🔳', style: ThumbnailStyle.Minimalist, description: 'Clean, simple, and elegant for a modern look.' },
  { name: 'Abstract', icon: '🌀', style: ThumbnailStyle.Abstract, description: 'Artistic and non-representational for creative videos.' },
  { name: 'Vintage', icon: '🎞️', style: ThumbnailStyle.Vintage, description: 'Retro and classic feel for historical or nostalgic content.' },
  { name: 'Sci-Fi', icon: '🚀', style: ThumbnailStyle.SciFi, description: 'Futuristic and otherworldly for science fiction themes.' },
];

export interface Template {
  id: string;
  name: string;
  imageUrl: string;
  prompt: string;
  style: ThumbnailStyle;
}

export const TEMPLATE_LIBRARY: Template[] = [
  {
    id: 'gaming-1',
    name: 'Neon Gaming Showdown',
    imageUrl: 'https://i.ytimg.com/vi/S8DmHPs1d-M/maxresdefault.jpg',
    style: ThumbnailStyle.Gaming,
    prompt: `Create a vibrant 16:9 YouTube thumbnail for a video titled "[VIDEO_TITLE]". The style is 'Neon Gaming'. A central, dynamic character in futuristic armor holds a glowing weapon. The background is a dark, abstract digital landscape with neon grids and particle effects. The text "[THUMBNAIL_TEXT]" should be in a bold, futuristic font with a bright neon glow, positioned for maximum impact. The color palette should be electric blues, purples, and pinks.`,
  },
  {
    id: 'finance-1',
    name: 'Stock Market Growth',
    imageUrl: 'https://i.ytimg.com/vi/YfC6ab-bN_c/maxresdefault.jpg',
    style: ThumbnailStyle.Minimalist,
    prompt: `Create a clean, professional 16:9 YouTube thumbnail for a finance video titled "[VIDEO_TITLE]". The style is 'Minimalist & Tech'. It should feature a stylized, glowing green stock market chart with a strong upward trend on a dark, sleek background. The text "[THUMBNAIL_TEXT]" should be in a modern, sans-serif font, placed clearly in the upper part of the thumbnail. Use a color palette of green, white, and dark gray.`,
  },
  {
    id: 'podcast-1',
    name: 'Modern Podcast Interview',
    imageUrl: 'https://i.ytimg.com/vi/uFLOe_20i9Q/maxresdefault.jpg',
    style: ThumbnailStyle.Lifestyle,
    prompt: `Create a modern, engaging 16:9 YouTube thumbnail for a podcast episode titled "[VIDEO_TITLE]". The style is 'Lifestyle & Clean'. The image should feature a split screen with professional, illustrated headshots of two people in conversation. The background is a simple, modern studio setting with a soft color gradient. The podcast title or episode number is prominent. The text "[THUMBNAIL_TEXT]" is overlaid in a stylish, readable font.`,
  },
  {
    id: 'tutorial-1',
    name: 'Coding Tutorial',
    imageUrl: 'https://i.ytimg.com/vi/PkZNo7MFNFg/maxresdefault.jpg',
    style: ThumbnailStyle.Tech,
    prompt: `Create a clear and informative 16:9 YouTube thumbnail for a coding tutorial titled "[VIDEO_TITLE]". The style is 'Tech & Educational'. The background should be a stylized, dark-themed code editor with glowing syntax highlighting. A large, prominent logo of the programming language (e.g., Python, JavaScript) should be visible. The text "[THUMBNAIL_TEXT]" must be very clear, in a clean, sans-serif font, perhaps with a background shape to make it pop.`,
  },
   {
    id: 'travel-1',
    name: 'Adventure Travel Vlog',
    imageUrl: 'https://i.ytimg.com/vi/v7pldt_k_RU/maxresdefault.jpg',
    style: ThumbnailStyle.Travel,
    prompt: `Create a stunning, vibrant 16:9 YouTube thumbnail for a travel vlog titled "[VIDEO_TITLE]". The style is 'Travel & Adventure'. The image should be a breathtaking, hyper-realistic landscape of a tropical beach or a mountain peak at sunset. The colors should be highly saturated and warm. The text "[THUMBNAIL_TEXT]" should be in a fun, handwritten-style font, integrated naturally into the scene.`,
  },
  {
    id: 'fitness-1',
    name: 'High-Intensity Workout',
    imageUrl: 'https://i.ytimg.com/vi/UItWltVZZmE/maxresdefault.jpg',
    style: ThumbnailStyle.Fitness,
    prompt: `Create a high-energy, motivational 16:9 YouTube thumbnail for a fitness video titled "[VIDEO_TITLE]". The style is 'High-Action Fitness'. It should feature a dynamic, athletic person in mid-workout, with a focus on muscle definition and motion. The background should be a modern gym with dramatic lighting. The text "[THUMBNAIL_TEXT]" should be bold, impactful, and slightly distressed, using colors like bright orange or yellow to convey energy.`,
  },
];