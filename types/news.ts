
export type News = {
    path: string;
    isActive: string;
    type: string;
    description: string;
}


export type NewsData = News & {
  id: number;
  createdAt: string;
  updatedAt: string;
};