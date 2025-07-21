import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { UserService } from './services/user';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  title = 'threads-app';
  userService = inject(UserService);

  constructor() {
    const user = this.userService.getUserFromStorage();
    if (!user) {
      const randomUsername = this.generateFunUsername();
      this.userService.createUser(randomUsername)
        .subscribe({
          next: (user) => {
            this.userService.saveUserToStorage(user);
          },
          error: (err) => {
            console.error('Error creating user:', err);
          },
        });
    }
  }

  private generateFunUsername(): string {
    const adjectives = [
      'Chatori', // foodie
      'Nakhrewali', // sassy
      'Jugaadu', // jugaad expert
      'Bindass', // carefree
      'Bhokali', // cool/show-off
      'Sanskari', // cultured
      'Desi', // native/local
      'Tandoori', // spicy
      'Garam', // hot
    ];

    const nouns = [
      'Nariyal', // coconut
      'Rickshawala',
      'Biryani',
      'ChaiLover',
      'Patakha', // firecracker
      'LassiKing',
      'Pandaal',
      'BollywoodFan',
      'MasalaDosa',
      'KajuKatli',
    ];

    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 1000);

    return `${randomAdj}${randomNoun}-${randomNum}`;
  }
}
