export class GetAllTopicQuery {
    constructor(req: any,body: any) {
      this.req = req;
      this.system_name = body.system_name;
      this.system_password = body.system_password;
    }
    req: any;
    system_name: string;
  system_password: string;

  }
  