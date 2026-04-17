export type TransactionItemType = {
  invoice_number: string
  transaction_type: string
  description: string
  total_amount: number
  created_on: string
}

export type TransactionHistoryResponse = {
  offset: number
  limit: number
  records: TransactionItemType[]
}
