import { Request } from '@sap/cds';
export type FullRequestParams<ExpecteResult> = Request & {
 result: ExpecteResult
}
