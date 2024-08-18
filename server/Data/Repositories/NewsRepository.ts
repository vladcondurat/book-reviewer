import { ICreateNews } from "../../Services/Types/ICreateNews";
import { INews } from "../../Services/Types/INews";
import { NewsModel } from "../Entities/News";

export const createNewsById = (values: ICreateNews): Promise<INews[]> =>
  new NewsModel(values).save().then((news) => news.toObject());

export const getAllNews = (): Promise<INews[]> =>
  NewsModel.find().then((reviews) => reviews.reverse() as INews[]);
