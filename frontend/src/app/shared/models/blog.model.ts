export interface Blog {
  id: number;
  name: string;
  handle: string;
  user?: {
    id: number;
    login: string;
  };
}