export class SubscriptionCommand {
  constructor(
    public readonly tokens: string[],
    public readonly topic_name: string,
    public readonly system_name: string,
    public readonly system_password: string,
    public readonly req?: any,
  ) {}
}
