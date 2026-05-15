import { amazonFirstPurchase } from './amazon-first-purchase';

export type LocalProjectBlock = {
  id: string;
  type: 'hero' | 'text' | 'image' | 'quote' | 'cards' | 'timeline' | 'before-after';
  contentEn: any;
  contentAr: any;
};

export type LocalProject = {
  slug: string;
  projectType: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  impactEn: string;
  impactAr: string;
  year: string;
  thumbnailUrl?: string;
  blocks: LocalProjectBlock[];
};

export const localProjects: LocalProject[] = [
  amazonFirstPurchase,
];
