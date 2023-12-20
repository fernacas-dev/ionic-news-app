import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Article, ArticlesByCategoryAndPage, NewsResponse } from '../interfaces';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private apiKey = environment.apiKey;
  private apiUrl = environment.apiUrl;

  private articlesByCategoryAndPage: ArticlesByCategoryAndPage = {};

  constructor( private http: HttpClient) { }

  private executeQuery<T>(endpoint: string) {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, {
      params: {
        apiKey: this.apiKey,
        country: 'us'
      }
    });

  }

  getTopHeadlines(): Observable<Article[]> {
    return this.getTopHeadlinesByCategory('business');
  }

  getTopHeadlinesByCategory(category: string, loadMore: boolean = false): Observable<Article[]> {

    if( loadMore ) {
      return this.getTopHeadlinesByCategory(category);
    }

    if(this.articlesByCategoryAndPage[category]){
      return of(this.articlesByCategoryAndPage[category].articles);
    }

    return this.getArticlesByCategory(category);
  }

  private getArticlesByCategory(category: string): Observable<Article[]>{

    if(Object.keys(this.articlesByCategoryAndPage).includes(category)){
      //this.articlesByCategoryAndPage[category].page += 0;
    } else {
      this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: []
      }
    }

    const page = this.articlesByCategoryAndPage[category].page + 1;

    return this.executeQuery<NewsResponse>(`/top-headlines?category=${category}&page=${page}`)
    .pipe(
      map(({articles}) => {

        if( articles.length === 0) return this.articlesByCategoryAndPage[category].articles;

        this.articlesByCategoryAndPage[category] = {
          page: page,
          articles: [...this.articlesByCategoryAndPage[category].articles, ...articles]
        };

        return this.articlesByCategoryAndPage[category].articles;
      })
    );
  }
}
