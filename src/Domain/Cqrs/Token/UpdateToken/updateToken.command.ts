export class updateTokenCommand {
  constructor(body: any, req: any,id_token: string) {
    this.req = req;
    this.id_token = id_token;
    this.token = body.token;
    this.platform = body.platform;
    this.system_name = body.system_name;
    this.system_password = body.system_password;
  }
  req: any;
  id_token: string;
  token:string
  platform:string
  system_name: string;
  system_password: string;
}
