import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Post } from '../models/post.model';
import { Blog } from '../models/blog.model';
import { SearchUser } from '../models/search.model';
import { PostService } from './post.service';

interface RawUser {
  id: number;
  login: string;
}

interface RawTag {
  id: number;
  name: string;
}

export interface SearchAllResult {
  users: SearchUser[];
  posts: Post[];
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly http = inject(HttpClient);
  private readonly postService = inject(PostService);

  /**
   * Search users whose login matches the query (case-insensitive).
   */
  searchUsers(query: string): Observable<SearchUser[]> {
    if (!query.trim()) return of([]);

    return this.http
      .get<RawUser[]>('/api/users?page=0&size=100&sort=login,asc')
      .pipe(
        map(users =>
          users.filter(u => u.login.toLowerCase().includes(query.toLowerCase()))
        ),
      );
  }

  /**
   * Search tags whose name matches the query (case-insensitive).
   */
  searchTags(query: string): Observable<RawTag[]> {
    if (!query.trim()) return of([]);

    return this.http
      .get<RawTag[]>('/api/tags?page=0&size=100')
      .pipe(
        map(tags =>
          tags.filter(t => t.name.toLowerCase().includes(query.toLowerCase()))
        ),
      );
  }

  /**
   * Search blogs whose name or handle matches the query (case-insensitive).
   */
  searchBlogs(query: string): Observable<Blog[]> {
    if (!query.trim()) return of([]);

    return this.http
      .get<Blog[]>('/api/blogs?eagerload=true')
      .pipe(
        map(blogs =>
          blogs.filter(
            b =>
              b.name.toLowerCase().includes(query.toLowerCase()) ||
              b.handle.toLowerCase().includes(query.toLowerCase()),
          )
        ),
      );
  }

  /**
   * Get posts for a given tag name (limited to 5).
   */
  private searchPostsByTagName(tagName: string): Observable<Post[]> {
    return this.postService
      .getPostsByTag(tagName, 0, 5)
      .pipe(map(res => res.body ?? []));
  }

  /**
   * Get posts for a given blog id (limited to 5).
   */
  private searchPostsByBlogId(blogId: number): Observable<Post[]> {
    return this.postService
      .getPostsByBlog(blogId, 0, 5)
      .pipe(map(res => res.body ?? []));
  }

  /**
   * Perform a full search across users, tags, and blogs.
   * Returns users first, then posts from matching tags and blogs.
   */
  searchAll(query: string): Observable<SearchAllResult> {
    if (!query.trim()) {
      return of({ users: [], posts: [] });
    }

    return forkJoin({
      users: this.searchUsers(query),
      tags: this.searchTags(query),
      blogs: this.searchBlogs(query),
    }).pipe(
      switchMap(({ users, tags, blogs }) => {
        const postObservables: Observable<Post[]>[] = [
          ...tags.map(t => this.searchPostsByTagName(t.name)),
          ...blogs.map(b => this.searchPostsByBlogId(b.id)),
        ];

        if (postObservables.length === 0) {
          return of({ users, posts: [] });
        }

        return forkJoin(postObservables).pipe(
          map((results: Post[][]) => {
            const seen = new Set<number>();
            const posts: Post[] = [];
            for (const arr of results) {
              for (const post of arr) {
                if (!seen.has(post.id)) {
                  seen.add(post.id);
                  posts.push(post);
                }
              }
            }
            return { users, posts };
          }),
          catchError(() => of({ users, posts: [] })),
        );
      }),
      catchError(() => of({ users: [], posts: [] })),
    );
  }
}