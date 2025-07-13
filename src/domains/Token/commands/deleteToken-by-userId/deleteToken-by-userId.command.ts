export class DeleteTokensByUserIdCommand {
  constructor(body: any, req: any, userId: string) {
    this.req = req;
    this.userId = userId;
    this.system_name = body.system_name;
    this.system_password = body.system_password;
  }
  req: any;
  userId: string;
  system_name: string;
  system_password: string;
}
