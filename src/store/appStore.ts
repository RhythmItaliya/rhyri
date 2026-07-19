import { create } from "zustand";

export type DownloadDocumentType = "invoice" | "purchaseBill" | "challan";

interface DownloadState {
  id: string | null;
  progress: string | null;
}

interface AppStoreState {
  downloads: Record<DownloadDocumentType, DownloadState>;
  setDownload: (
    type: DownloadDocumentType,
    payload: Partial<DownloadState>,
  ) => void;
  clearDownload: (type: DownloadDocumentType) => void;
  clearAllDownloads: () => void;
}

const initialDownloadState: Record<DownloadDocumentType, DownloadState> = {
  invoice: { id: null, progress: null },
  purchaseBill: { id: null, progress: null },
  challan: { id: null, progress: null },
};

export const useAppStore = create<AppStoreState>((set) => ({
  downloads: initialDownloadState,
  setDownload: (type, payload) =>
    set((state) => ({
      downloads: {
        ...state.downloads,
        [type]: {
          ...state.downloads[type],
          ...payload,
        },
      },
    })),
  clearDownload: (type) =>
    set((state) => ({
      downloads: {
        ...state.downloads,
        [type]: { id: null, progress: null },
      },
    })),
  clearAllDownloads: () => set({ downloads: initialDownloadState }),
}));
