export class GetAllTokenQuery {
    constructor(req: any,system_name: string,system_password:string) {
      this.req = req;
      this.system_name = system_name;
      this.system_password = system_password;
    }
    req: any;
    system_name: string;
  system_password: string;

  }
  