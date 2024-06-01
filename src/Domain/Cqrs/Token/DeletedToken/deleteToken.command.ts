export class deleteTokensCommand {
  constructor(body: any, req: any, id_token: string) {
    this.req = req;
    this.id_token = id_token;
    this.system_name = body.system_name;
    this.system_password = body.system_password;
  }
  req: any;
  id_token: string;
  system_name: string;
  system_password: string;
}
