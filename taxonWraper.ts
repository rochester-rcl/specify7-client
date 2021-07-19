
interface Taxon{
    author: string; 
    fullName: string; 
    commonName: string; 
}

function taxonWrapper(taxon: Taxon){
    return taxon.commonName; 
}

const taxon: Taxon = {
author: "Kushal", 
fullName: "ABC",
commonName: "CommonName"
}

const SPECIFY_API_ENDPOINT = "http://localhost:8080/api/specify"; // just for testing; 


async function getTaxon(fullName: string): Promise<Taxon| null> {
    try {
      const url: string = `${SPECIFY_API_ENDPOINT}/taxon?name=${fullName}`;
      return await fetch(url).then(res => res.json());
    } catch (e) {
      console.log("An error occured", e);
      return null;
    }
  }
  document.body.textContent=taxonWrapper(taxon);
 console.log(JSON.stringify(getTaxon("diadema")));
  console.log("Test"); 
  
