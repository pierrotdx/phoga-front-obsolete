export interface DbDoc {
  _id: string;
  manifest?: {
    creation?: {
      when?: Date;
    };
    last_update?: {
      when?: Date;
    };
  };
  [key: string]: any;
}
