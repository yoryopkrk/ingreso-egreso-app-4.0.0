export interface UserData {
  uid?: string | null;
  email?: string | null;
  nombre?: string | null;
}

export class User {
  public nombre: string;
  public email: string;
  public uid: string;

  constructor(obj?: UserData | null) {
    this.nombre = obj?.nombre ?? '';
    this.uid = obj?.uid ?? '';
    this.email = obj?.email ?? '';
  }
}
