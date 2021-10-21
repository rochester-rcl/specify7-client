import { HttpMethod } from "./Constants";
import specifyFetch from "./SpecifyFetch";
import { fetchTaxonByField, fetchTaxonSynonyms } from "./SpecifyQuery";

const backendUrl = "http://localhost:80";

async function testFetch(username: string, password: string) {
  const fetchWithCredentials = await specifyFetch(
    backendUrl,
    "username",
    "password",
    1015809
  );

  const currentUser = (await fetchWithCredentials(
    "/context/user.json",
    HttpMethod.GET,
    null
  )) as ISpecifyUserPartial;

  if (currentUser) {
    const data = await fetchTaxonByField(
      currentUser,
      "guid",
      "2426609",
      fetchWithCredentials
    );
    
    const synonyms = await fetchTaxonSynonyms(data, fetchWithCredentials);
    console.log(data);
    console.log(synonyms);
  }
}

testFetch("username", "password");
