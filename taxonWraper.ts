
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

async function getTaxon(fullName: string): Promise<?Taxon> {
    try{
    const url: string =`${SPECIFY_API_ENDPOINT}/taxon?name=${fullName}`;
    const result: ?Taxon = await fetch(url).then((res: Response) => res.json());
    return result;
  } catch (e){
      console.log("An error occured"); 
      return ; 
  }
}

 document.body.textContent = taxonWrapper(taxon);
