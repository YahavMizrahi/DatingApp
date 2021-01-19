import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseurl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsersWithRoles() {
    return this.http.get<Partial<User[]>>(
      this.baseurl + 'admin/users-with-roles'
    );
  }

  updateUserRoles(username: string, roles: string[]) {
    return this.http.post(
      this.baseurl + 'admin/edit-roles/' + username + '?roles=' + roles,
      {}
    );
  }
}
