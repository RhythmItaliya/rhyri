import { DocumentSnapshot } from "@firebase/firestore";
import { BankCategory } from "../../types";
import React from "react";

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
  pageAction: "NEXT" | "PREV" | null;
  lastIndex: string | null;
  firstIndex: string | null;
  categoryFilterValue?: BankCategory;
  startAfterDoc: DocumentSnapshot | null;
}

export type ColumnDef =
  | {
      id: string;
      header: string | React.JSX.Element;
      canHide: true;
      isVisible: boolean;
    }
  | {
      id: string;
      header: string | React.JSX.Element;
      canHide: false;
      isVisible?: true;
    };
