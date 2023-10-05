import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Report } from 'common/models/moderation';
import { Observable } from 'rxjs';
import { ModerationService } from 'src/modules/admin/services/moderation/moderation.service';

@Component({
  selector: 'app-reports-page',
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.scss']
})
export class ReportsPageComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<Report>([]);
  displayedColumns = ['id', 'reason', 'description', 'reportingUserEmail', 'reportedUserEmail', 'created_at']

  constructor(private readonly moderationService: ModerationService) {
    this.moderationService.getReports()
      .subscribe((reports) => this.dataSource.data = reports);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
