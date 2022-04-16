type HttpRequestBodyData = null | KeyVal | FormData;
type HttpRequestBody = null | FormData | string;
type HttpRequestContentType =
  | "application/multipart-formdata"
  | "application/json"
  | "application/x-www-form-urlencoded";

interface KeyVal {
  [key: string]: KeyVal | number | string | undefined;
}

type SpecifyCollectionId = number;

interface ICollectionMap {
  [key: string]: SpecifyCollectionId;
}

interface ISpecifyUserPartial {
  id: number;
  isauthenticated: boolean;
  resource_uri: string;
}

interface ISpecifyTaxon {
  id: number;
  acceptedchildren: string | null;
  acceptedtaxon: string | null;
}

interface ITaxonQueryField {
  sorttype: number;
  isdisplay: boolean;
  isnot: boolean;
  startvalue: string;
  query: string;
  position: number;
  tablelist: string;
  stringid: string;
  fieldname: string;
  isrelfld: boolean;
  operstart: number;
}

interface ITaxonQuery {
  name: string;
  contextname: string;
  contexttableid: number;
  selectdistinct: boolean;
  countonly: boolean;
  formatauditrecids: boolean;
  specifyuser: string;
  isfavorite: boolean;
  ordinal: number;
  fields: ITaxonQueryField[];
  [key: string]: string | number | boolean | ITaxonQueryField[];
}

type SpecifyQueryMapping = [number, string];

interface ISpecifyQueryMappingResult {
  results: SpecifyQueryMapping[];
}

type SpecifyApiData =
  | ISpecifyUserPartial
  | ISpecifyTaxon
  | ISpecifyQueryMappingResult
  | ISpecifyTaxon[]
  | null;
