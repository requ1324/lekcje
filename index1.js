const Datastore = require('nedb')

const coll1 = new Datastore({
    filename: 'db/index1.db',
    autoload: true
});

const doc = {
    a: "a",
    b: "b"
};

coll1.insert(doc, function (err, newDoc) {
    console.log("dodano dokument (obiekt):")
    console.log(newDoc)
    console.log("unikalne id dokumentu: " + newDoc._id)
});

/*console.log("PRZED FOR: " + new Date().getMilliseconds())
for (let i = 0; i < 3; i++) {
    let doc = {
        a: "a" + i,
        b: "b" + i
    };
    coll1.insert(doc, function (err, newDoc) {
        console.log("id dokumentu: " + newDoc._id, "DODANO: " + new Date().getMilliseconds())
    });
}
console.log("PO FOR: " + new Date().getMilliseconds())
*/
coll1.findOne({ "a": "a1" }, function (err, doc) {
    console.log("----- obiekt pobrany z bazy: ", doc)
    console.log("----- formatowanie obiektu js na format JSON: ")
    console.log(JSON.stringify(doc, null, 5))
})

coll1.count({ a: "a1" }, function (err, count) {
    console.log("dokumentów jest: ", count)
});

coll1.remove({ a: "a2" }, {}, function (err, numRemoved) {
    console.log("usunięto dokumentów: ", numRemoved)
});

coll1.remove({}, { multi: true }, function (err, numRemoved) {
    console.log("usunięto wszystkie dokumenty: ", numRemoved)
});