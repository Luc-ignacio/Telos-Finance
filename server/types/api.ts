export enum ResponseStatus {
  SUCCESS = 200, // General success response
  CREATED_OR_UPDATED = 201, // POST or PUT request successfully processed
  SUCCESS_BUT_NO_DATA_TO_RETURN = 204, // Request succeeded but returns no content (e.g, after DELETE request)
  BAD_REQUEST = 400, // Invalid request
  NOT_FOUND = 404, // Resource not found
  UNPROCESSABLE_ENTITY = 422, // The request could not be processed (e.g., failed Zod validation)
  UNAUTHORISED = 401, // User is not authenticated (token expired, login required)
  FORBIDDEN = 403, // User is authenticated but does not have permission (Role based access)
  INTERNAL_SERVER_ERROR = 500, // An unexpected error occurred on the server
}

export type CDIData = {
  data: string;
  valor: string;
};

export type CalculateYieldResult = {
  businessDays: number;
  calendarDays: number;
  accumulatedFactor: number;
  grossYield: number;
  grossYieldData: Array<{ date: string; accumulatedGrossYield: number }>;
  grossValue: number;
  grossReturn: number;
  taxRate: number;
  tax: number;
  netValue: number;
  netYield: number;
};

export type FixedIncomeValueSingleTransactionResult = {
  totalInvested: number;
  totalGrossValue: number;
  totalNetValue: number;
  taxRate: number;
  tax: number;
  totalReturn: number;
  totalReturnPercentage: number;
};

export type FixedIncomeValueMultipleTransactionsResult = {
  totalInvested: number;
  totalGrossValue: number;
  totalNetValue: number;
  totalTax: number;
  totalGrossReturn: number;
  totalNetReturn: number;
  totalReturnPercentage: number;
  applications: Array<{
    date: Date;
    invested: number;
    grossValue: number;
    netValue: number;
    taxRate: number;
    tax: number;
    grossReturn: number;
    netReturn: number;
    returnPercentage: number;
  }>;
};
