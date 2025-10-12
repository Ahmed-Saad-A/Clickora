interface RawBrand {
    _id: string;
    name: string;
}

interface RawCategory {
    _id: string;
    name: string;
    slug?: string;
}

interface RawSubcategory {
    _id: string;
    name: string;
    slug?: string;
}

export type RawWishlistItem = {
    _id: string;
    name?: string;
    title?: string;
    slug?: string;
    description?: string;
    price?: number;
    quantity?: number;
    sold?: number;
    images?: string[];
    imageCover?: string;
    ratingsAverage?: number;
    ratingsQuantity?: number;
    brand?: RawBrand;            // 👈 بدل any
    category?: RawCategory;      // 👈 بدل any
    subcategory?: RawSubcategory[]; // 👈 بدل any[]
    createdAt?: string;
    updatedAt?: string;
};
