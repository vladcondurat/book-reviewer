import { BusinessError } from "../Exceptions/BusinessErrors";
import { HttpStatusCode } from "../Constants/HttpStatusCodes";
import {
  createNewsById,
  getAllNews,
} from "../../Data/Repositories/NewsRepository";
import { NewsTypes } from "../../Data/Constants/NewsTypes";
import { INews } from "../Types/INews";
import RSS from "rss";

export async function createNews(
  userId: string | null,
  type: NewsTypes,
  bookId?: string | null
): Promise<INews[]> {
  if (!userId || !type) {
    throw new BusinessError("Bad Request", HttpStatusCode.BAD_REQUEST);
  }

  if (bookId !== undefined && bookId === null) {
    throw new BusinessError(
      "Book ID cannot be null if provided",
      HttpStatusCode.BAD_REQUEST
    );
  }

  const news = await createNewsById({
    userId,
    type,
    bookId,
    createdAt: new Date(),
  });
  return news;
}

export async function getLatestNews(): Promise<string> {
  const news = await getAllNews();

  const feed = new RSS({
    title: "Latest News",
    description: "The latest news updates",
    feed_url: "http://localhost:5173/news",
    site_url: "http://localhost:5173/",
    language: "en",
  });

  news.forEach((newsItem: INews) => {
    feed.item({
      title: `News by User ${newsItem.userId}`,
      description: `Type: ${newsItem.type}, Book ID: ${
        newsItem.bookId || "N/A"
      }`,
      url: `http://http://localhost:5173//news/${newsItem.id}`,
      date: newsItem.createdAt,
    });
  });

  return feed.xml({ indent: true });
}
