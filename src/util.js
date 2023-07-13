import N3 from "n3";
const { DataFactory } = N3;
const { namedNode } = DataFactory;

const getIdFromUri = (uri) => {
  const regex = /([P,Q])\w+/;
  return regex.exec(uri)[0];
};

export const loadPathData = () => {
  const nThreeData = [
    {
      entityA: "Q7958",
      entityB: "Q46857",
      rawPath: `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
    @prefix schema: <http://schema.org/> .
    @prefix wd: <http://www.wikidata.org/entity/> .
    @prefix wdt: <http://www.wikidata.org/prop/direct/> .
    
    wd:Q7958 rdfs:label "explanation" ;
        schema:description "set of statements constructed to describe a set of facts" ;
        wdt:P366 wd:Q352842 .
    
    wd:Q352842 rdfs:label "teaching" ;
        schema:description "process or activity of imparting knowledge and skills" ;
        wdt:P31 wd:Q11862829 .
    
    wd:Q11862829 rdfs:label "academic discipline" ;
        schema:description "academic field of study or profession" ;
        wdt:P1269 wd:Q336 .
    
    wd:Q336 rdfs:label "science" ;
        schema:description "systematic enterprise that builds and organizes knowledge, and the set of knowledge produced by this enterprise" .
    
    wd:Q46857 rdfs:label "scientific method" ;
        schema:description "mathematical and experimental techniques employed in the natural sciences; more specifically, techniques used in the construction and testing of scientific hypotheses" ;
        wdt:P1535 wd:Q336 .
    
    wd:P366 rdfs:label "has use" ;
        schema:description "main use of the subject (includes current and former usage)" .
    
    wd:P31 rdfs:label "instance of" ;
        schema:description "that class of which this subject is a particular example and member; different from P279 (subclass of); for example: K2 is an instance of mountain; volcano is a subclass of mountain (and an instance of volcanic landform)" .
    
    wd:P1269 rdfs:label "facet of" ;
        schema:description "topic of which this item is an aspect, item that offers a broader perspective on the same topic" .
    
    wd:P1535 rdfs:label "used by" ;
        schema:description "item or concept that makes use of the subject (use sub-properties when appropriate)" .`,
      textual: `The found path signifies the relationship between "explanation" and "scientific method", highlighting how explanation is utilized in teaching, which contributes to the development of academic disciplines. These disciplines form the basis of scientific knowledge, leading to the application of the scientific method in the pursuit of understanding and testing scientific hypotheses.`,
    },
  ];

  const processedPaths = [];
  const parser = new N3.Parser();

  for (let index in nThreeData) {
    const path = new N3.Store();

    const entry = nThreeData[index];

    parser.parse(entry.rawPath, (_0, quad, _1) => {
      if (quad) {
        path.addQuad(quad);
      } else {
        processedPaths.push({ ...entry, parsedPath: path });
        console.log(`Parsed n3 path ${index}: ${path.size} triples found.`);
      }
    });
  }

  return processedPaths;
};

export const getLabelForId = (id, path) => {
  const quads = path.getObjects(
    namedNode(`http://www.wikidata.org/entity/${id}`),
    namedNode(`http://www.w3.org/2000/01/rdf-schema#label`)
  );

  return quads[0].id.replaceAll('"', "") ?? "No label found!";
};

export const getDescriptionForId = (id, path) => {
  const quads = path.getObjects(
    namedNode(`http://www.wikidata.org/entity/${id}`),
    namedNode(`http://schema.org/description`)
  );

  return quads[0].id.replaceAll('"', "") ?? "No description found!";
};

export const getPathEntities = (path) => {
  let entities = path
    .getSubjects()
    .concat(path.getObjects())
    .map((object) => object.id)
    .filter((uri) => uri.includes("http://www.wikidata.org/entity/Q"))
    .map((uri) => getIdFromUri(uri));

  entities = [...new Set(entities)];

  return entities;
};

export const getPathRelations = (path) => {
  let relations = path
    .getQuads()
    .map((quad) => {
      return {
        subject: quad._subject.id,
        predicate: quad._predicate.id,
        object: quad._object.id,
      };
    })
    .filter(
      (triple) =>
        triple.subject.includes("http://www.wikidata.org/entity/Q") &&
        triple.object.includes("http://www.wikidata.org/entity/Q")
    )
    .map((triple) => {
      return {
        subject: getIdFromUri(triple.subject),
        predicate: getIdFromUri(triple.predicate),
        object: getIdFromUri(triple.object),
      };
    });

  return relations;
};
