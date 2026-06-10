import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { ITag, NewTag } from '../tag.model';

export type PartialUpdateTag = Partial<ITag> & Pick<ITag, 'id'>;

@Injectable()
export class TagsService {
  readonly tagsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(undefined);
  readonly tagsResource = httpResource<ITag[]>(() => {
    const params = this.tagsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of tag that have been fetched. It is updated when the tagsResource emits a new value.
   * In case of error while fetching the tags, the signal is set to an empty array.
   */
  readonly tags = computed(() => (this.tagsResource.hasValue() ? this.tagsResource.value() : []));
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/tags');
}

@Injectable({ providedIn: 'root' })
export class TagService extends TagsService {
  protected readonly http = inject(HttpClient);

  create(tag: NewTag): Observable<ITag> {
    return this.http.post<ITag>(this.resourceUrl, tag);
  }

  update(tag: ITag): Observable<ITag> {
    return this.http.put<ITag>(`${this.resourceUrl}/${encodeURIComponent(this.getTagIdentifier(tag))}`, tag);
  }

  partialUpdate(tag: PartialUpdateTag): Observable<ITag> {
    return this.http.patch<ITag>(`${this.resourceUrl}/${encodeURIComponent(this.getTagIdentifier(tag))}`, tag);
  }

  find(id: number): Observable<ITag> {
    return this.http.get<ITag>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<ITag[]>> {
    const options = createRequestOption(req);
    return this.http.get<ITag[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getTagIdentifier(tag: Pick<ITag, 'id'>): number {
    return tag.id;
  }

  compareTag(o1: Pick<ITag, 'id'> | null, o2: Pick<ITag, 'id'> | null): boolean {
    return o1 && o2 ? this.getTagIdentifier(o1) === this.getTagIdentifier(o2) : o1 === o2;
  }

  addTagToCollectionIfMissing<Type extends Pick<ITag, 'id'>>(tagCollection: Type[], ...tagsToCheck: (Type | null | undefined)[]): Type[] {
    const tags: Type[] = tagsToCheck.filter(isPresent);
    if (tags.length > 0) {
      const tagCollectionIdentifiers = tagCollection.map(tagItem => this.getTagIdentifier(tagItem));
      const tagsToAdd = tags.filter(tagItem => {
        const tagIdentifier = this.getTagIdentifier(tagItem);
        if (tagCollectionIdentifiers.includes(tagIdentifier)) {
          return false;
        }
        tagCollectionIdentifiers.push(tagIdentifier);
        return true;
      });
      return [...tagsToAdd, ...tagCollection];
    }
    return tagCollection;
  }
}
