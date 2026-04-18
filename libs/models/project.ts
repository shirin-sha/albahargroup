/** Image archive item (MongoDB may still return legacy fields until saved again). */
export interface Project {
  _id?: string;
  /** English title (may be empty if only Arabic is provided). */
  title: string;
  /** English description (may be empty if only Arabic is provided). */
  description: string;
  /** Arabic title (optional; used on /ar with fallback to `title`). */
  titleAr?: string;
  /** Arabic description (optional; used on /ar with fallback to `description`). */
  descriptionAr?: string;
  image: string;
}
