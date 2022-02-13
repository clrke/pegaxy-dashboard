import Race from "./Race";

export default class Pega {
  constructor(
    public readonly id: string = "",
    public readonly name: string = "",
    public readonly energy: number | null = null,
    public readonly lastReduceEnergy: Date | null = null,
    public readonly avatar: string = "",
    public readonly races: Race[] = []
  ) {
  }
}
