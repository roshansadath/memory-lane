import { prisma } from './prisma';

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Ensure a slug is unique for a user
 */
export async function ensureUniqueSlug(
  baseSlug: string,
  userId: string,
  excludeId?: string
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingLane = await prisma.memoryLane.findFirst({
      where: {
        slug,
        userId,
        ...(excludeId && { id: { not: excludeId } }),
      } as Record<string, unknown>,
    });

    if (!existingLane) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

/**
 * Generate a unique slug for a memory lane
 */
export async function generateUniqueSlug(
  title: string,
  userId: string,
  excludeId?: string
): Promise<string> {
  const baseSlug = generateSlug(title);
  return ensureUniqueSlug(baseSlug, userId, excludeId);
}
