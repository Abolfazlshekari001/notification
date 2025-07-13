export class MuteNotificationCommand {
  constructor(body: any, req: any, id_token: string) {
    this.req = req;
    this.id_token = id_token;
    this.Mute = body.Mute;
    this.system_name = body.system_name;
    this.system_password = body.system_password;
  }
  req: any;
  id_token: string;
  Mute: boolean;
  system_name: string;
  system_password: string;
}
