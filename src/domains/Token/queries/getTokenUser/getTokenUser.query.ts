export class GetATokenUserQuery {
  constructor(
    req: any,
    userId: string,
    system_name: string,
    system_password: string,
  ) {
    this.req = req;
    this.userId = userId;
    this.system_name = system_name;
    this.system_password = system_password;
  }
  req: any;
  userId: string;
  system_name: string;
  system_password: string;
}
