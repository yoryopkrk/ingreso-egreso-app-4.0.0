export interface UserData {
  uid?: string | null;
  email?: string | null;
  nombre?: string | null;
  role?: string | null;
}

export class User {
  public nombre: string;
  public email: string;
  public uid: string;
  public role: string;

  constructor(obj?: UserData | null) {
    this.nombre = obj?.nombre ?? '';
    this.uid = obj?.uid ?? '';
    this.email = obj?.email ?? '';
    this.role = obj?.role ?? '';
  }
}
