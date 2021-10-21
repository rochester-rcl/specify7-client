import { ContentTypes, HttpMethod } from "./Constants";
import Cookies from "js-cookie";

function formatBody(
  body: HttpRequestBodyData
): [HttpRequestContentType, HttpRequestBody] {
  if (body) {
    if (body.constructor === FormData) {
      return [ContentTypes.FORM_DATA, body];
    }
    try {
      return [ContentTypes.JSON, JSON.stringify(body)];
    } catch (error) {
      return [ContentTypes.DEFAULT, null];
    }
  }
  return [ContentTypes.DEFAULT, null];
}

/**
 *
 * @param url
 * @param method
 * @param body
 */
async function fetchInternal<T>(
  url: string,
  method: HttpMethod = HttpMethod.GET,
  data: HttpRequestBodyData = null,
  token: string | null = null
): Promise<T | null> {
  const [contentType, body] = formatBody(data);
  const headers: HeadersInit = {
    "Content-Type": contentType,
  };
  if (token) {
    headers["X-CSRFToken"] = token;
  }
  const result = await fetch(url, {
    method,
    body,
    headers,
    credentials: "include",
  });
  try {
    const json = await result.json();
    return json;
  } catch (error) {
    return null;
  }
}

interface ISpecifyLoginCtx {
  username: string;
  password: string;
  collections: KeyVal[];
  collection: string | null;
}

async function getCredentials(
  baseUrl: string,
  username: string,
  password: string,
  collectionId: number,
  credentialsKey: string = "csrftoken"
): Promise<string> {
  let token = null;
  const loginUrl = `${baseUrl}/context/login/`;
  // retrieve initial token
  const loginInfo = await fetchInternal<ISpecifyLoginCtx>(loginUrl);
  if (loginInfo) {
    // use the newly acquired token
    token = Cookies.get(credentialsKey);
    if (!token) {
      throw new Error("The CSRF token was not set by Specify API");
    }
    const data = {
      username,
      password,
      collection: collectionId,
    };
    // retrieve the final CSRF token
    await fetchInternal<ISpecifyLoginCtx>(
      loginUrl,
      HttpMethod.PUT,
      data,
      token
    );
    token = Cookies.get(credentialsKey);
    if (!token) {
      throw new Error(
        "The CSRF token was not set by the Specify API - please check your username and password and try again."
      );
    }
    return token;
  } else {
    throw new Error(
      "Unable to reach the Specify API login context - is the application running?"
    );
  }
}

export type SpecifyFetchSignature = (
  url: string,
  method: HttpMethod,
  data: HttpRequestBodyData
) => Promise<SpecifyApiData>;

export default async function specifyFetch(
  baseUrl: string,
  username: string,
  password: string,
  collectionId: SpecifyCollectionId,
  credentialsKey: string = "csrftoken"
): Promise<SpecifyFetchSignature> {
  // always ensure the user is logged in
  // check for existing CSRF token stored in cookies
  let token = await getCredentials(
    baseUrl,
    username,
    password,
    collectionId,
    credentialsKey
  );
  function fetchWithCredentials(
    path: string,
    method: HttpMethod,
    data: HttpRequestBodyData
  ): Promise<SpecifyApiData> {
    const finalUrl = `${baseUrl}${path.charAt(0) === "/" ? path : "/" + path}`;
    return fetchInternal(finalUrl, method, data, token);
  }
  return fetchWithCredentials;
}
