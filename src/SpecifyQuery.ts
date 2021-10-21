import { SpecifyFetchSignature } from "./SpecifyFetch";
import { HttpMethod } from "./Constants";
const taxonQueryDefault: ITaxonQuery = {
  name: "Taxon Query",
  contextname: "Taxon",
  contexttableid: 4,
  selectdistinct: false,
  countonly: false,
  formatauditrecids: false,
  specifyuser: "/api/specify/specifyuser/1/",
  isfavorite: true,
  ordinal: 32767,
  fields: [
    {
      sorttype: 0,
      isdisplay: true,
      isnot: false,
      startvalue: "0",
      query: "/api/specify/spquery/",
      position: 0,
      tablelist: "4",
      stringid: "4.taxon.guid",
      fieldname: "guid",
      isrelfld: false,
      operstart: 1,
    },
  ],
};

function prepareTaxonQuery(
  user: ISpecifyUserPartial,
  fieldName: string,
  value: string
): ITaxonQuery {
  const queryId = `4.taxon.${fieldName}`;
  const updatedFields = taxonQueryDefault.fields.map((field) => ({
    ...field,
    stringid: queryId,
    fieldname: fieldName,
    startvalue: value,
  }));
  const query = {
    ...taxonQueryDefault,
    specifyuser: user.resource_uri,
    fields: updatedFields,
  };
  return query;
}

export async function fetchTaxonByField(
  user: ISpecifyUserPartial,
  fieldName: string,
  value: string,
  fetchFunc: SpecifyFetchSignature
): Promise<ISpecifyTaxon | null> {
  const query = prepareTaxonQuery(user, fieldName, value);
  // retrieve mapping first
  const queryResult = await fetchFunc(
    "stored_query/ephemeral/",
    HttpMethod.POST,
    query as KeyVal
  );
  if (!queryResult) {
    return null;
  }
  const { results } = queryResult as ISpecifyQueryMappingResult;
  // only fetch first result for now
  const [taxonId] = results[0];
  const taxon = await fetchFunc(
    `api/specify/taxon/${taxonId}`,
    HttpMethod.GET,
    null
  );
  return taxon ? (taxon as ISpecifyTaxon) : null;
}

export async function fetchTaxonSynonyms(
  taxon: ISpecifyTaxon,
  fetchFunc: SpecifyFetchSignature
): Promise<ISpecifyTaxon[] | null> {
  if (taxon.acceptedchildren) {
    const children = await fetchFunc(taxon.acceptedchildren, HttpMethod.GET, null);
    return children ? children as ISpecifyTaxon[] : null;
  }
  return null;
}
