export class unSubscriptionCommand {
  constructor(body: any, req: any, id_sub: string) {
    this.req = req;
    this.topic_name = body.topic_name;
    this.token = body.token;
    this.system_name = body.system_name;
    this.system_password = body.system_password;
    this.id_sub = id_sub;
  }
  req: any;
  topic_name: string;
  token: string;
  system_name: string;
  system_password: string;
  id_sub: string;
}
