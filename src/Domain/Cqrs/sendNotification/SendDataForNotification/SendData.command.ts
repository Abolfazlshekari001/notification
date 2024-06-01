export class SendDataCommand {
  constructor(req: any, body: any, data: any) {
    this.req = req;
    this.token = body.token;
    this.data = data;
    this.system_name = body.system_name;
    this.system_password = body.system_password;
  }
  req: any;
  token: string;
  data: any;
  system_name: string;
  system_password: string;
}
