export class BookPost {
  username: string;
  id: string;
  shelf: string;
  title: string;
  pageCount: number;
  authors: string | string[];
  genre: string | string[];
  startDate: string;
  finishedDate: string;
  cover: string;
  notes: string;
  rating: number;

  constructor(
    username: string,
    id: string,
    shelf: string,
    title: string,
    pageCount: number,
    authors: string | string[],
    genre: string | string[],
    startDate: string,
    finishedDate: string,
    cover: string,
    notes: string,
    rating: number
  ) {
    this.username = username;
    this.id = id;
    this.shelf = shelf;
    this.title = title;
    this.pageCount = pageCount;
    this.authors = authors;
    this.genre = genre;
    this.startDate = startDate;
    this.finishedDate = finishedDate;
    this.cover = cover;
    this.notes = notes;
    this.rating = rating;
  }
}
