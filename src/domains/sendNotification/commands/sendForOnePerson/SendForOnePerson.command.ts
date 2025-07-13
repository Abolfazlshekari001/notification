export class sendForOnePersonCommand {
  constructor(req: any, body: any) {
    this.req = req;
    this.title = body.title;
    this.message = body.message;
    this.token = body.token;
    this.system_name = body.system_name;
    this.system_password = body.system_password;
  }
  req: any;
  title: string;
  message: string;
  token: string;
  system_name: string;
  system_password: string;
}
