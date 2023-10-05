import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserListItem } from 'common/models/admin';
import { User, UserProfile } from 'common/models/user';
import { Ban, Report, Suspend } from 'common/models/moderation';

@Injectable({
  providedIn: 'root'
})
export class UsersAdminService {
  constructor(private readonly http: HttpClient) { }

  getUsers(): Observable<UserListItem[]> {
    return this.http.get<UserListItem[]>('/admin/users');
  }

  getUser(userId: number): Observable<User> {
    return this.http.get<User>(`/admin/users/${userId}`);
  }

  getUserProfile(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`/admin/users/profile/${userId}`);
  }

  getSuspensions(userId: number): Observable<Suspend[]> {
    return this.http.get<Suspend[]>(`/admin/users/suspend/${userId}`);
  }

  getBan(userId: number): Observable<Ban> {
    return this.http.get<Ban>(`/admin/users/ban/${userId}`);
  }

  suspendUser(userId: number, until: Date, reason?: string): Observable<void> {
    return this.http.post<void>(`/admin/users/suspend/${userId}`, { until, reason });
  }

  revokeSuspension(userId: number): Observable<void> {
    return this.http.delete<void>(`/admin/users/suspend/${userId}`);
  }

  banUser(userId: number, reason?: string): Observable<void> {
    return this.http.post<void>(`/admin/users/ban/${userId}`, { reason });
  }

  unbanUser(userId: number): Observable<void> {
    return this.http.delete<void>(`/admin/users/ban/${userId}`);
  }

  getReports(userId: number): Observable<Report[]> {
    return this.http.get<Report[]>(`/admin/users/reports/${userId}`);
  }
}
