/**
 * Interface used for paging.
 */
export interface Paging {
    
    /**
     * indicating object ready
     */
    ready: boolean;

    /**
     * indicating navigation for object subcommunities, collections, or items loaded
     */
    loaded: any;

    /**
     * paging offset, offset = page - 1 * limit
     */
    offset: number;

    /**
     * current page
     */
    page: number;

    /**
     * number of 'items' on a page, applies per object
     */
    limit: number;

    /**
     * routing component used for convenience for routerLinks and navigation
     */
    component: string;

    /**
     * number of pages
     */
    pageCount: number;

    /**
     * total number of 'items', total = pageCount * limit
     */
    total: number;

}
