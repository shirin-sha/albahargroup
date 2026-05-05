import { ArticleType } from "./article";
import { AuthorType } from "./author";

export interface ArticleCardType {
    article: ArticleType;
    width: number;
    height: number;
    alt?: string;
    author?: AuthorType;
    showDate: boolean;
    showCategory?: boolean;
    /** Post detail base path, e.g. `/news` or `/ar/news`. Defaults to `/blogs`. */
    detailHrefBase?: string;
}
