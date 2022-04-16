import { HttpMethod } from "./Constants";
import specifyFetch, { getAvailableCollections } from "./SpecifyFetch";
import { fetchTaxonByField, fetchTaxonSynonyms } from "./SpecifyQuery";

export const Tools = {
  specifyFetch,
  getAvailableCollections,
  fetchTaxonByField,
  fetchTaxonSynonyms,
};
