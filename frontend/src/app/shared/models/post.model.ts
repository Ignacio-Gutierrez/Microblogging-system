export interface Post {
  id: number;
  title: string;
  content: string;
  date: string;
  blog: {
    id: number;
    name: string;
    handle: string;
    user?: {
      id: number;
      login: string;
    };
  };
  tags?: { id: number; name: string }[];
}