export class updateTopicCommand {
    constructor(body: any, req: any,id_topic:string) {
      this.req = req;
      this.topic_name = body.topic_name;
      this.decriptions_topic = body.decriptions_topic;
      this.id_topic = id_topic;
      this.system_name = body.system_name;
      this.system_password = body.system_password;
    }
    req: any;
    topic_name: string;
    decriptions_topic: string;
    id_topic: string;
    system_name: string;
    system_password: string;
  }
  