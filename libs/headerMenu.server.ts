import { getDb } from "@/libs/mongodb";
import type { Menu } from "@/libs/models/menu";
import type { MenuItem } from "@/types/menu";
import { cache } from "react";

function toMenuItem(menu: Menu): MenuItem {
  return {
    title: menu.title,
    // expose optional Arabic title so the UI can switch based on language
    titleAr: menu.titleAr,
    path: menu.path,
    dropdown: menu.dropdown?.map(toMenuItem),
    text: menu.text,
    imageUrl: menu.imageUrl ?? null,
    imageUrlMobile: menu.imageUrlMobile ?? null,
    showbutton: menu.showbutton,
    megamenu: menu.megamenu,
    megamenutwocolumn: menu.megamenutwocolumn,
    bottommenu: menu.bottommenu?.map(toMenuItem),
  };
}

/**
 * Server-side menu fetch (best practice): renders menu in initial HTML to avoid layout shift.
 * Returns `null` if DB is unavailable or no enabled menus exist.
 */
export const getHeaderMenuItems = cache(async (): Promise<MenuItem[] | null> => {
  try {
    const db = await getDb();
    const collection = db.collection<Menu>("headerMenu");

    const menus = await collection
      .find({ enabled: { $ne: false } })
      .sort({ order: 1 })
      .toArray();

    if (!menus || menus.length === 0) return null;
    return menus.map(toMenuItem);
  } catch {
    return null;
  }
});

