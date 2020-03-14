import { dataGouvCatalog } from './stores.js';

let myDataGouvCatalog;

let c = dataGouvCatalog.subscribe((value) => { myDataGouvCatalog = value });

const apiDataGouvURL = 'https://www.data.gouv.fr/api/1/datasets';
const dataset = 'fichier-des-personnes-decedees';
const regexCatch = [/deces-(.*).txt/,'$1'];

export default async function getDataGouvCatalog() {
    if (myDataGouvCatalog) {
      return myDataGouvCatalog;
    }
    const response = await fetch(`${apiDataGouvURL}/${dataset}/`, {
      method: "GET"
    });
    if (response.status >= 300) {
        return null;
    } else {
        let json = await response.json();
        let resources = json.resources;
        console.log(resources);
        if (resources) {
            let catalog = {};
            resources.map(r => {
                if (r.url && r.title) {
                    catalog[r.title.replace(regexCatch[0],regexCatch[1])] = r.url
                }
            });
            await dataGouvCatalog.update(v => catalog);
            console.log(myDataGouvCatalog);
            return myDataGouvCatalog;
        } else {
            return null;
        }
    }
};