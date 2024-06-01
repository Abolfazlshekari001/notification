export class GetOneTopicQuery {
  constructor(
    req: any,
    id_topic: any,
    system_name: string,
    system_password: string,
  ) {
    this.req = req;
    this.id_topic = id_topic;
    this.system_name = system_name;
    this.system_password = system_password;
  }
  req: any;
  token: string;
  id_topic: string;
  system_name: string;
  system_password: string;
}
