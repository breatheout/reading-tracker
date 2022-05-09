export class User {
  username: string;
  email: string;
  password: string;
  accessToken: string;

  constructor(name: string, email: string, password: string) {
    this.username = name;
    this.email = email;
    this.password = password;
    this.accessToken = '';
  }
}
