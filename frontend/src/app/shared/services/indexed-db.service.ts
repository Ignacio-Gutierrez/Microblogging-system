import { inject, Injectable } from '@angular/core';
import { openDB, IDBPDatabase, deleteDB } from 'idb';
import type { Post } from '../models/post.model';
import type { Blog } from '../models/blog.model';

const DB_NAME = 'microblogging-db';
const DB_VERSION = 1;

export interface CachedPosts {
  key: string; // e.g. "feed-page-0", "blog-123-page-1"
  posts: Post[];
  timestamp: number;
}

export interface CachedBlogs {
  login: string;
  blogs: Blog[];
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class IndexedDbService {
  private dbPromise!: Promise<IDBPDatabase>;

  constructor() {
    this.initDb();
  }

  private initDb(): void {
    this.dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('posts')) {
          db.createObjectStore('posts', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('blogs')) {
          db.createObjectStore('blogs', { keyPath: 'login' });
        }
        if (!db.objectStoreNames.contains('pending-actions')) {
          db.createObjectStore('pending-actions', {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      },
    });
  }

  // ── Posts cache ──

  async cachePosts(key: string, posts: Post[]): Promise<void> {
    const db = await this.dbPromise;
    await db.put('posts', {
      key,
      posts,
      timestamp: Date.now(),
    });
  }

  async getCachedPosts(key: string): Promise<Post[] | null> {
    const db = await this.dbPromise;
    const cached = await db.get('posts', key) as CachedPosts | undefined;
    if (!cached) return null;
    // Cache válido por 1 hora
    if (Date.now() - cached.timestamp > 60 * 60 * 1000) {
      await db.delete('posts', key);
      return null;
    }
    return cached.posts;
  }

  async clearPostsCache(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear('posts');
  }

  // ── Blogs cache ──

  async cacheBlogs(login: string, blogs: Blog[]): Promise<void> {
    const db = await this.dbPromise;
    await db.put('blogs', { login, blogs, timestamp: Date.now() });
  }

  async getCachedBlogs(login: string): Promise<Blog[] | null> {
    const db = await this.dbPromise;
    const cached = await db.get('blogs', login) as CachedBlogs | undefined;
    if (!cached) return null;
    return cached.blogs;
  }

  // ── Offline actions queue ──

  async addPendingAction(action: { url: string; method: string; body?: unknown }): Promise<void> {
    const db = await this.dbPromise;
    await db.add('pending-actions', { ...action, createdAt: Date.now() });
  }

  async getPendingActions(): Promise<{ id: number; url: string; method: string; body?: unknown }[]> {
    const db = await this.dbPromise;
    return db.getAll('pending-actions');
  }

  async removePendingAction(id: number): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('pending-actions', id);
  }

  async clearPendingActions(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear('pending-actions');
  }

  // ── Storage info ──

  async getStorageEstimate(): Promise<{ usage: number; quota: number; percentUsed: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage ?? 0;
      const quota = estimate.quota ?? 0;
      return {
        usage,
        quota,
        percentUsed: quota > 0 ? Math.round((usage / quota) * 100) : 0,
      };
    }
    return { usage: 0, quota: 0, percentUsed: 0 };
  }

  // ── Full cleanup ──

  async clearAll(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear('posts');
    await db.clear('blogs');
    await db.clear('pending-actions');
  }

  async deleteDatabase(): Promise<void> {
    await deleteDB(DB_NAME);
    this.initDb();
  }
}