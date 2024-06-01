export class GetAllSubForTopicQuery {
  constructor(req: any,body: any) {
    this.req = req;
    this.topic_name = body.topic_name;
    this.system_name = body.system_name;
    this.system_password = body.system_password;
  }
  req: any;
  system_name: string;
system_password: string;
topic_name: string;

}
