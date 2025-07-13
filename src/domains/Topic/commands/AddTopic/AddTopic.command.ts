export class addTopicCommand {
  constructor(
    public readonly topic_name: string,
    public readonly decriptions_topic: string,
    public readonly system_name: string,
    public readonly system_password: string,
    public readonly req?: any,
  ) {}
}
