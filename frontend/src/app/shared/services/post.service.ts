import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/posts';

  /**
   * Fetch a paginated page of posts, ordered by date descending.
   * @param page 0-based page index
   * @param size number of items per page
   */
  getPosts(page: number, size: number = 10): Observable<HttpResponse<Post[]>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'date,desc')
      .set('eagerload', 'true');

    return this.http.get<Post[]>(this.baseUrl, {
      params,
      observe: 'response',
    });
  }

  /**
   * Fetch a paginated page of posts for a specific blog.
   * @param blogId the blog ID to filter by
   * @param page 0-based page index
   * @param size number of items per page
   */
  getPostsByBlog(blogId: number, page: number, size: number = 10): Observable<HttpResponse<Post[]>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'date,desc')
      .set('eagerload', 'true')
      .set('blogId', blogId);

    return this.http.get<Post[]>(this.baseUrl, {
      params,
      observe: 'response',
    });
  }

  /**
   * Fetch a paginated page of posts that contain a specific tag.
   * @param tagName the tag name to filter by
   * @param page 0-based page index
   * @param size number of items per page
   */
  getPostsByTag(tagName: string, page: number, size: number = 10): Observable<HttpResponse<Post[]>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'date,desc')
      .set('eagerload', 'true')
      .set('tagName', tagName);

    return this.http.get<Post[]>(this.baseUrl, {
      params,
      observe: 'response',
    });
  }

  /*
   * Create a new post.
   */
  createPost(post: {
    title: string;
    content: string;
    date: string;
    blog: { id: number };
  }): Observable<Post> {
    return this.http.post<Post>(this.baseUrl, post);
  }

  /* Delete a post by ID. */
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /* Get a random post from today. */
  getRandomPost(): Observable<Post | null> {
    return this.http.get<Post>(`${this.baseUrl}/random`).pipe(
      map(response => response ?? null)
    );
  }
}