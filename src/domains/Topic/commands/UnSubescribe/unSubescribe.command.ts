export class unSubscriptionCommand {
  constructor(body: any, req: any, ids: string[]) {
    this.req = req;
    this.topic_name = body.topic_name;
    this.tokens = body.tokens;
    this.system_name = body.system_name;
    this.system_password = body.system_password;
    this.ids = ids;
  }
  req: any;
  topic_name: string;
  tokens: string[];
  system_name: string;
  system_password: string;
  ids: string[];
}
