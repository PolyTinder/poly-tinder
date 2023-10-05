import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Report } from 'common/models/moderation';

@Injectable({
  providedIn: 'root'
})
export class ModerationService {

  constructor(private readonly http: HttpClient) { }

  getReports() {
    return this.http.get<Report[]>('/admin/moderation/reports');
  }
}
