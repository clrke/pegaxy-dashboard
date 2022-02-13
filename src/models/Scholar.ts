import Pega from "./Pega";

export default class Scholar {
  constructor(public name: string = "", public pegas: Pega[] = [new Pega()]) {
  }
}
