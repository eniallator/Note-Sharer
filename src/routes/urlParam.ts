import { unsafeTag, type Tagged } from "niall-utils";

export interface UrlParam<Value> {
  parse: (param: string) => Value;
  format: (value: Value) => string;
}

export type AnyUrlParam = UrlParam<any>;

export function createUrlParam<Value>(
  parse: (param: string) => Value,
  format: (value: Value) => string,
): UrlParam<Value> {
  return { parse, format };
}

// region Definitions

const identity = <T>(value: T) => value;

export type NoteId = Tagged<string, "NoteId">;
export const unsafeNoteId = unsafeTag<NoteId>();

export const urlParams = {
  noteId: createUrlParam(unsafeNoteId, identity),
  num: createUrlParam(Number, String),
};

// end-region
