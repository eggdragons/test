export type ExportData = {
  name: string;
  startTokenId: number;
  img: boolean;
  imgServer: string;
  imgHash: string;
  ani: boolean;
  aniServer: string;
  aniHash: string;
  step: number;
};

export type CollectionData = {
  collectionName?: string;
  collectionDescription?: string;
  collectionImage?: string;
};

export const initExportData: ExportData = {
  name: "",
  startTokenId: 1,
  img: true,
  imgServer: "arweave",
  imgHash: "",
  ani: false,
  aniServer: "arweave",
  aniHash: "",
  step: 1,
};

export const initCollectionData: CollectionData = {
  collectionName: "",
  collectionDescription: "",
  collectionImage: "",
};
