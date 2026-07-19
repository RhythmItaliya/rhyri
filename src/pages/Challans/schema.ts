import React from "react";
import type { Timestamp } from "firebase/firestore";

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
  pageAction: "NEXT" | "PREV" | null;
  lastIndex: Timestamp | null;
  firstIndex: Timestamp | null;
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
