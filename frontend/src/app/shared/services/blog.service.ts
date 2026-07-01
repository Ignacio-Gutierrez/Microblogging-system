import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Blog } from '../models/blog.model';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/blogs';

  /* Get all blogs for the currently authenticated user. */
  getMyBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.baseUrl}/my-blogs`);
  }

  /* Get all blogs for a specific user by their login. */
  getBlogsByUser(login: string): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.baseUrl}?eagerload=true&login=${login}`);
  }

  /* Get a single blog by its ID. */
  getBlogById(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.baseUrl}/${id}`);
  }

  /* Create a new blog. */
  createBlog(blog: { name: string; handle: string; user?: { id: number } }): Observable<Blog> {
    return this.http.post<Blog>(`${this.baseUrl}`, blog);
  }

  /* Update an existing blog. */
  updateBlog(blog: Pick<Blog, 'id'> & Partial<Blog>): Observable<Blog> {
    return this.http.patch<Blog>(`${this.baseUrl}/${blog.id}`, blog);
  }

  /* Delete a blog by its ID. */
  deleteBlog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
