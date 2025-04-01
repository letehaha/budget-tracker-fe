import { TransactionModel } from "shared-types";

export interface Budget {
  id: number;
  userId?: number;
  name: string;
  start_date?: Date;
  end_date: Date;
  limit_amount: number | null;
  category_id?: number | null;
  auto_include: boolean;
  transactions?: TransactionModel[];
}
