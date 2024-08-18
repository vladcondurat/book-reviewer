export interface IBook {
  _id: string;
  reviews: string[];
  description: string;
  title: string;
  author: string;
  genre: string;
  publishingHouse: string;
  bookCoverImage: string;
  edition: number;
  year: number;
  __v: number;
}
