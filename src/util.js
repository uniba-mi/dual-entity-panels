import N3 from "n3";
const { DataFactory } = N3;
const { namedNode } = DataFactory;

const getIdFromUri = (uri) => {
  const regex = /([P,Q])\w+/;
  return regex.exec(uri)[0];
};

export const loadPathData = () => {
  const turtleData = [
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
      textual: `"Explanation" involves constructing statements to describe facts and is integral to "teaching," the act of imparting knowledge. Teaching is a facet of "academic disciplines," which are linked to "science," a systematic knowledge-building enterprise. In the realm of science lies the "scientific method," covering mathematical and experimental techniques used in the natural sciences, including hypothesis construction and testing.`,
    },
    {
      entityA: "Q81938",
      entityB: "Q482853",
      rawPath: `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
    @prefix schema: <http://schema.org/> .
    @prefix wd: <http://www.wikidata.org/entity/> .
    @prefix wdt: <http://www.wikidata.org/prop/direct/> .

    wd:Q81938 rdfs:label "pain" ;
        schema:description "type of unpleasant feeling" ;
        wdt:P2176 wd:Q408801 .

    wd:Q408801 rdfs:label "celecoxib" ;
        schema:description "chemical compound" ;
        wdt:P2175 wd:Q52849 .

    wd:Q52849 rdfs:label "ankylosing spondylitis" ;
        schema:description "type of arthritis in which there is long term inflammation of the joints of the spine" ;
        wdt:P279 wd:Q7577457 .

    wd:Q7577457 rdfs:label "spinal disease" ;
        schema:description "disease involving the vertebral column" ;
        wdt:P927 wd:Q1979420 .

    wd:Q1979420 rdfs:label "human vertebral column" ;
        schema:description "spine of humans" ;
        wdt:P279 wd:Q482853 .

    wd:Q482853 rdfs:label "vertebral column" ;
        schema:description "bony structure found in vertebrates" .

    wd:P2176 rdfs:label "drug or therapy used for treatment" ;
        schema:description "drug, procedure, or therapy that can be used to treat a medical condition" .

    wd:P2175 rdfs:label "medical condition treated" ;
        schema:description "disease that this pharmaceutical drug, procedure, or therapy is used to treat" .

    wd:P279 rdfs:label "subclass of" ;
        schema:description "this item is a subclass (subset) of that item; all instances of this item are instances of that item; different from P31 (instance of), e.g.: K2 is an instance of mountain; volcano is a subclass of mountain (and an instance of volcanic landform)" .

    wd:P927 rdfs:label "anatomical location" ;
        schema:description "where in the body or cell does this feature lie or happen" .`,
      textual: `Pain can be treated with a pharmaceutical drug or therapy called celecoxib. Celecoxib is specifically used for the treatment of ankylosing spondylitis, which is a type of medical condition characterized by long-term inflammation of the joints of the spine. Ankylosing spondylitis falls under the category of spinal diseases, which are conditions involving the human vertebral column. The human vertebral column, in turn, is a specific type of the broader anatomical structure known as the vertebral column, which is a bony framework found in various vertebrate species, including humans.`,
    },
  ];

  const processedPaths = [];
  
  for (let index in turtleData) {
    const parser = new N3.Parser();
    const path = new N3.Store();
    const entry = turtleData[index];

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
