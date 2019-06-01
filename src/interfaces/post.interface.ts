export interface Post {
  id?: string;
  title: string;
  featureImage: string;
  displayImage?: string;
  content: any;
  city: any;
  authorId: string;
  authorEmail: string;
  authorName: string;
  createdAt: number;
  updatedAt: number;
  likes: any;
  comments: any;
  adminApproved: boolean;
}
