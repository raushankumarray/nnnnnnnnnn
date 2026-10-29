import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// Use defensive check and fallback to ensure PlaceHolderImages is never undefined
export const PlaceHolderImages: ImagePlaceholder[] = (data as any)?.placeholderImages || [];
