export class sendNotificationTopicCommand {
  constructor(req: any, body: any) {
    this.req = req;
    this.title = body.title;
    this.message = body.message;
    this.topic_name = body.topic_name;
    this.system_name = body.system_name;
    this.system_password = body.system_password;
  }
  req: any;
  title: string;
  message: string;
  topic_name: string;
  system_name: string;
  system_password: string;
}
