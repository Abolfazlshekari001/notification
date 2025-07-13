export class SendToMultipleTopicsCommand {
  constructor(req: any, body: any) {
    this.req = req;
    this.title = body.title;
    this.message = body.message;
    this.topics = body.topics;
    this.system_name = body.system_name;
    this.system_password = body.system_password;
  }
  req: any;
  title: string;
  message: string;
  topics: string | string[];
  system_name: string;
  system_password: string;
}
