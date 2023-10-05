import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserListItem } from 'common/models/admin';
import { User } from 'common/models/user';
import { Observable, map, tap } from 'rxjs';
import { UsersAdminService } from 'src/modules/admin/services/users/users-admin.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns = ['userId', 'email', 'name', 'age', 'lastLogin', 'suspendReason', 'suspensionCount', 'banReason', 'reportsCount'];
  dataSource = new MatTableDataSource<UserListItem>([]);

  constructor(private readonly usersAdminService: UsersAdminService) {
    this.usersAdminService.getUsers()
      .pipe(
        tap((users) => this.dataSource.data = users),
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
