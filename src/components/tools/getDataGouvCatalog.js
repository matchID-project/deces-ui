import { dataGouvCatalog } from './stores.js';

let myDataGouvCatalog;

let loading = false;

let c = dataGouvCatalog.subscribe((value) => { myDataGouvCatalog = value });

const dataGouvCatalogURL = '__DATAGOUV_CATALOG_URL__';
const dataGouvRewrite = {
    title: [/deces-(.*).txt/,'$1'],
    url: ['__DATAGOUV_RESOURCES_URL__', '__DATAGOUV_PROXY_PATH__']
};


export default async function getDataGouvCatalog() {
    if (myDataGouvCatalog) {
      return myDataGouvCatalog;
    }
    if (loading) { return };
    loading = true;
    const response = await fetch(dataGouvCatalogURL, {
      method: "GET"
    });
    if (response.status >= 300) {
        return null;
    } else {
        let json = await response.json();
        let resources = json.resources;
        if (resources) {
            let catalog = {};
            resources.map(r => {
                if (r.url && r.title) {
                    catalog[r.title.replace(dataGouvRewrite.title[0],dataGouvRewrite.title[1])] = r.url.replace(dataGouvRewrite.url[0], dataGouvRewrite.url[1])
                }
            });
            await dataGouvCatalog.update(v => catalog);
            return myDataGouvCatalog;
        } else {
            return null;
        }
    }
    loading = false;
};