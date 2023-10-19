import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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
  allColumns = ['userId', 'email', 'name', 'age', 'lastLogin', 'lastLoginAgo', 'profileUpdatedAt', 'profileUpdatedAtAgo', 'isSuspended', 'suspensionCount', 'isBanned', 'reportsCount', 'pictures']
  displayedColumns = ['email', 'name', 'lastLoginAgo', 'profileUpdatedAtAgo', 'isSuspended', 'isBanned', 'reportsCount'];
  displayedColumnsControl = new FormControl(this.displayedColumns);
  dataSource = new MatTableDataSource<UserListItem>([]);
  pictureSize = 50;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private readonly usersAdminService: UsersAdminService) {
    this.usersAdminService.getUsers()
      .pipe(
        tap((users) => this.dataSource.data = users),
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    console.log(this.sort);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'lastLoginAgo':
          return item.lastLogin;
        case 'profileUpdatedAtAgo':
          return item.profileUpdatedAt;
        default:
          return (item as Record<string, any>)[property];
      }
    }
  }

  setCols(cols: string[]) {
    this.displayedColumnsControl.setValue(cols);
  }

  augmentPictureSize() {
    this.pictureSize = Math.min(300, this.pictureSize + 10);
  }

  reducePictureSize() {
    this.pictureSize = Math.max(10, this.pictureSize - 10);
  }
}
