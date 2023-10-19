import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Ban, Report, Suspend } from 'common/models/moderation';
import { User, UserProfile } from 'common/models/user';
import { BehaviorSubject, Observable, Subject, catchError, combineLatest, map, of, switchMap, tap, throwError } from 'rxjs';
import { BAN_REASONS } from 'src/constants/moderation';
import { UsersAdminService } from 'src/modules/admin/services/users/users-admin.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent {
  updatedAt$: BehaviorSubject<Date | undefined> = new BehaviorSubject<Date | undefined>(undefined);
  user$: Observable<User | undefined>;
  userProfile$: Observable<UserProfile | undefined>;
  suspend$: Observable<(Suspend & { active: boolean })[] | undefined>;
  ban$: Observable<Ban | undefined>;
  reports$: Observable<Report[] | undefined>;
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  error$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private update$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);

  suspendForm = new FormGroup({
    reason: new FormControl(''),
    until: new FormControl(new Date()),
    sendEmail: new FormControl(false),
  })
  banForm = new FormGroup({
    reason: new FormControl(''),
    sendEmail: new FormControl(false),
  })


  banReasons = BAN_REASONS;

  constructor(private readonly usersAdminService: UsersAdminService, private readonly route: ActivatedRoute, private readonly snackBar: MatSnackBar) {
    this.user$ = combineLatest([this.route.params, this.update$]).pipe(
      switchMap(([params]) => 
        params['id']
          ? this.usersAdminService.getUser(params['id'])
          : throwError(() => new Error('No user ID provided'))
      ),
      catchError((err) => {
        this.error$.next(err.message);
        return of(undefined);
      }),
      tap(() => {
        this.loading$.next(false);
        this.updatedAt$.next(new Date());
      }),
    );

    this.userProfile$ = this.user$.pipe(
      switchMap((user) => 
        user
          ? this.usersAdminService.getUserProfile(user.userId)
          : of(undefined)
      ),
      catchError((err) => {
        this.error$.next(err.message);
        return of(undefined);
      }),
    );

    this.suspend$ = this.user$.pipe(
      switchMap((user) => 
        user
          ? this.usersAdminService.getSuspensions(user.userId)
          : of(undefined)
      ),
      catchError((err) => {
        this.error$.next(err.message);
        return of(undefined);
      }),
      map(
        (suspendList) => suspendList
          ? suspendList.map((suspend) => ({
            ...suspend,
            until: new Date(suspend.until),
            active: new Date(suspend.until) > new Date(),
          }))
          : undefined
      )
    );

    this.ban$ = this.user$.pipe(
      switchMap((user) => 
        user
          ? this.usersAdminService.getBan(user.userId)
          : of(undefined)
      ),
      catchError((err) => {
        this.error$.next(err.message);
        return of(undefined);
      }),
    );

    this.reports$ = this.user$.pipe(
      switchMap((user) => 
        user
          ? this.usersAdminService.getReports(user.userId)
          : of(undefined)
      ),
      catchError((err) => {
        this.error$.next(err.message);
        return of(undefined);
      }),
    );
  }

  update() {
    this.update$.next();
  }

  suspend() {
    if (confirm(`Do you want to suspend this user for "${this.suspendForm.value.reason}" until ${this.suspendForm.value.until}`)) {
      console.log(this.suspendForm.value);
      this.usersAdminService.suspendUser(this.route.snapshot.params['id'], this.suspendForm.value.until!, this.suspendForm.value.reason ?? undefined, this.suspendForm.value.sendEmail ?? false).subscribe(() => {
        this.update();
        this.snackBar.open('User suspended', 'Dismiss', { duration: 3000 });
      });
    }
  }

  revokeSuspension() {
    if (confirm('Do you want to revoke this suspension?')) {
      this.usersAdminService.revokeSuspension(this.route.snapshot.params['id']).subscribe(() => {
        this.update();
        this.snackBar.open('Suspension revoked', 'Dismiss', { duration: 3000 });
      });
    }
  }

  ban() {
    if(confirm(`Do you want to ban this user for "${this.banForm.value.reason}"?`)) {
      this.usersAdminService.banUser(this.route.snapshot.params['id'], this.banForm.value.reason ?? undefined, this.banForm.value.sendEmail ?? false).subscribe(() => {
        this.update();
        this.snackBar.open('User banned', 'Dismiss', { duration: 3000 });
      });
    }
  }

  unban() {
    if(confirm('Do you want to unban this user?')) {
      this.usersAdminService.unbanUser(this.route.snapshot.params['id']).subscribe(() => {
        this.update();
        this.snackBar.open('User unbanned', 'Dismiss', { duration: 3000 });
      });
    }
  }
}
