import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnetion: HubConnection;
  private onlineUserSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUserSource.asObservable();

  constructor(private toastr: ToastrService, private router: Router) {}

  createHubConnection(user: User) {
    this.hubConnetion = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnetion.start().catch((error) => console.log(error));

    this.hubConnetion.on('UserIsOnline', (username) => {
      // this.toastr.info(username + ' has connected');
      this.onlineUsers$.pipe(take(1)).subscribe((usernames) => {
        this.onlineUserSource.next([...usernames, username]);
      });
    });

    this.hubConnetion.on('UserIsOffline', (username) => {
      // this.toastr.warning(username + ' has disconnected');
      this.onlineUsers$.pipe(take(1)).subscribe((usernames) => {
        this.onlineUserSource.next([
          ...usernames.filter((x) => x !== username),
        ]);
      });
    });

    this.hubConnetion.on('GetOnlineUsers', (username: string[]) => {
      this.onlineUserSource.next(username);
    });

    this.hubConnetion.on('NewMessageReceived', ({ username, knownAs }) => {
      this.toastr
        .info(knownAs + ' has sent a new message!')
        .onTap.pipe(take(1))
        .subscribe(() =>
          this.router.navigateByUrl('/members/' + username + '?tab=3')
        );
    });
  }

  stopHubConnection() {
    this.hubConnetion.stop().catch((error) => console.log(error));
  }
}
