export class deleteTopicCommand {
    constructor(body: any, req: any,id_topic:string) {
      this.req = req;
      this.id_topic = id_topic;
      this.system_name = body.system_name;
      this.system_password = body.system_password;
    }
    req: any;
    token: string;
    id_topic: string;
    system_name: string;
    system_password: string;
  }
  