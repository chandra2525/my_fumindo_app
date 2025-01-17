export class CreateLoanDto {
  user_id: number;
  customer_name: string;
  notes: string;
  status: string;
  assets: {
    asset_id: number;
    input_method: string;
    quantity: number;
  }[];
}
