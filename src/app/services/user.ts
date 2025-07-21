import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments';
import { User as UserType } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);

  createUser(name: string) {
    return this.http.post<UserType>(`${environment.apiBaseUrl}/users`, { name });
  }

  saveUserToStorage(user: UserType) {
    localStorage.setItem('threads-user', JSON.stringify(user));
  }

  getUserFromStorage(): UserType | null {
    const user = localStorage.getItem('threads-user');
    return user ? JSON.parse(user) : null;
  }
}
