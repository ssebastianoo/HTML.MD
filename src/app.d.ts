declare module "turndown" {
  export default class Turndown {
    constructor(options?: any);
    turndown(html: string): string;
    remove(selector: string): this;
  }
}
