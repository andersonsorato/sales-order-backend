import { Request } from "@sap/cds";
import e from "express";
export type FullRequestParams<ExpecteResult> = Request & {
 result: ExpecteResult
}