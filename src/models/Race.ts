export default class Race {
  constructor(
    public readonly id: string = "",
    public readonly reward: number,
    public readonly endDate: Date
  ) {
  }
}
