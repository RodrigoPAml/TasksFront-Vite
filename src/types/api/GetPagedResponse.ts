export interface GetPagedResponse<T> {
  items: T[];
  pages: number;
  count: number;
}