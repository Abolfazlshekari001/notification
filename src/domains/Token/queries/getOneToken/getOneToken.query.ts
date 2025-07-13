export class GetOneTokenQuery {
  constructor(
    req: any,
    id_token: any,
    system_name: string,
    system_password: string,
  ) {
    this.req = req;
    this.id_token = id_token;
    this.system_name = system_name;
    this.system_password = system_password;
  }
  req: any;
  id_token: string;
  system_name: string;
  system_password: string;
}
