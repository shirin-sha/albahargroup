import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/libs/mongodb";
import { revalidateTag } from "next/cache";
import { CacheTags } from "@/libs/cacheTags";

type BrandItem = {
  src: string;
  width: number;
  height: number;
  alt: string;
  category: string;
  loading: "lazy" | "eager";
};

type SectionDoc = {
  sectionId: string;
  enabled?: boolean;
  order?: number;
  en?: Record<string, any>;
  ar?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
};

const DEFAULT_BRAND: BrandItem = {
  src: "",
  width: 200,
  height: 120,
  alt: "",
  category: "",
  loading: "lazy",
};

const normalizeBrand = (brand: any): BrandItem => ({
  src: typeof brand?.src === "string" ? brand.src : "",
  width: typeof brand?.width === "number" ? brand.width : 200,
  height: typeof brand?.height === "number" ? brand.height : 120,
  alt: typeof brand?.alt === "string" ? brand.alt : "",
  category: typeof brand?.category === "string" ? brand.category : "",
  loading: brand?.loading === "eager" ? "eager" : "lazy",
});

async function getPartnershipsSection() {
  const db = await getDb();
  const collection = db.collection<SectionDoc>("partnershipsPageSections");
  return { collection };
}

export async function GET() {
  try {
    const { collection } = await getPartnershipsSection();
    const section = await collection.findOne({ sectionId: "partnerships" });
    const enList = Array.isArray(section?.en?.imageList) ? section?.en?.imageList : [];
    const arList = Array.isArray(section?.ar?.imageList) ? section?.ar?.imageList : [];
    const maxItems = Math.max(enList.length, arList.length);
    const data = Array.from({ length: maxItems }).map((_, index) => ({
      index,
      en: normalizeBrand(enList[index] || DEFAULT_BRAND),
      ar: normalizeBrand(arList[index] || DEFAULT_BRAND),
    }));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching partnerships brands:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { collection } = await getPartnershipsSection();
    const body = await req.json();
    const enBrand = normalizeBrand(body?.en || DEFAULT_BRAND);
    const arBrand = normalizeBrand(body?.ar || DEFAULT_BRAND);

    const section = await collection.findOne({ sectionId: "partnerships" });
    const currentEn = Array.isArray(section?.en?.imageList) ? [...section!.en!.imageList] : [];
    const currentAr = Array.isArray(section?.ar?.imageList) ? [...section!.ar!.imageList] : [];
    currentEn.push(enBrand);
    currentAr.push(arBrand);

    await collection.findOneAndUpdate(
      { sectionId: "partnerships" },
      {
        $set: {
          sectionId: "partnerships",
          enabled: section?.enabled ?? true,
          order: section?.order ?? 0,
          "en.imageList": currentEn,
          "ar.imageList": currentAr,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    revalidateTag(CacheTags.cms.partnerships, "default");
    return NextResponse.json({ success: true, data: { index: currentEn.length - 1, en: enBrand, ar: arBrand } });
  } catch (error) {
    console.error("Error adding partnerships brand:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add brand" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { collection } = await getPartnershipsSection();
    const body = await req.json();
    const index = Number(body?.index);
    if (!Number.isInteger(index) || index < 0) {
      return NextResponse.json({ success: false, error: "Valid index is required" }, { status: 400 });
    }

    const section = await collection.findOne({ sectionId: "partnerships" });
    const currentEn = Array.isArray(section?.en?.imageList) ? [...section!.en!.imageList] : [];
    const currentAr = Array.isArray(section?.ar?.imageList) ? [...section!.ar!.imageList] : [];
    const maxItems = Math.max(currentEn.length, currentAr.length);
    if (index >= maxItems) {
      return NextResponse.json({ success: false, error: "Brand index out of range" }, { status: 404 });
    }

    currentEn[index] = normalizeBrand(body?.en || currentEn[index] || DEFAULT_BRAND);
    currentAr[index] = normalizeBrand(body?.ar || currentAr[index] || DEFAULT_BRAND);

    await collection.findOneAndUpdate(
      { sectionId: "partnerships" },
      {
        $set: {
          "en.imageList": currentEn,
          "ar.imageList": currentAr,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    revalidateTag(CacheTags.cms.partnerships, "default");
    return NextResponse.json({ success: true, data: { index, en: currentEn[index], ar: currentAr[index] } });
  } catch (error) {
    console.error("Error updating partnerships brand:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update brand" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { collection } = await getPartnershipsSection();
    const { searchParams } = new URL(req.url);
    const index = Number(searchParams.get("index"));
    if (!Number.isInteger(index) || index < 0) {
      return NextResponse.json({ success: false, error: "Valid index is required" }, { status: 400 });
    }

    const section = await collection.findOne({ sectionId: "partnerships" });
    const currentEn = Array.isArray(section?.en?.imageList) ? [...section!.en!.imageList] : [];
    const currentAr = Array.isArray(section?.ar?.imageList) ? [...section!.ar!.imageList] : [];
    const maxItems = Math.max(currentEn.length, currentAr.length);
    if (index >= maxItems) {
      return NextResponse.json({ success: false, error: "Brand index out of range" }, { status: 404 });
    }

    const nextEn = currentEn.filter((_, i) => i !== index);
    const nextAr = currentAr.filter((_, i) => i !== index);

    await collection.findOneAndUpdate(
      { sectionId: "partnerships" },
      {
        $set: {
          "en.imageList": nextEn,
          "ar.imageList": nextAr,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    revalidateTag(CacheTags.cms.partnerships, "default");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting partnerships brand:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete brand" },
      { status: 500 }
    );
  }
}
