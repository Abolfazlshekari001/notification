export class SubscriptionCommand {
    constructor(body: any, req: any) {
      this.req = req;
      this.topic_name = body.topic_name;
      this.token = body.token;
      this.system_name = body.system_name;
      this.system_password = body.system_password;
    }
    req: any;
    topic_name: string;
    token: string;
    system_name: string;
    system_password: string;
  }