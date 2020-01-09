// specific mapping for fichier-des-personnes-decedees
export default function(record) {
    record._source.id = record._id
    if (!record._source.PRENOM) {
        record._source.PRENOM = "";
    }
    if (!record._source.PRENOMS) {
        record._source.PRENOMS = "";
    }
    return record
}