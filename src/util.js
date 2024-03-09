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
  const turtleStarData = [
    {
      entityA: "Q7958",
      entityB: "Q46857",
      rawPath: `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
    @prefix schema: <http://schema.org/> .
    @prefix wd: <http://www.wikidata.org/entity/> .
    @prefix wdt: <http://www.wikidata.org/prop/direct/> .
    @prefix s: <http://example.org/semantic/> .
    @prefix llm: <http://example.org/llm/> .
    
    wd:Q7958 rdfs:label "explanation" ;
        schema:description "set of statements constructed to describe a set of facts" ;
        wdt:P366 wd:Q352842 .

    << wd:Q7958 wdt:P366 wd:Q352842 >>
    s:distance 747 ;
    llm:interpretation "An explanation has use in teaching" .
    
    wd:Q352842 rdfs:label "teaching" ;
        schema:description "process or activity of imparting knowledge and skills" ;
        wdt:P31 wd:Q11862829 .

    << wd:Q352842 wdt:P31 wd:Q11862829 >>
    s:distance 543 ;
    llm:interpretation "Teaching is an instance of academic discipline".
    
    wd:Q11862829 rdfs:label "academic discipline" ;
        schema:description "academic field of study or profession" ;
        wdt:P1269 wd:Q336 .

    << wd:Q11862829 wdt:P1269 wd:Q336 >>
    s:distance 582 ;
    llm:interpretation "Academic discipline is a facet of science" .
    
    wd:Q336 rdfs:label "science" ;
        schema:description "systematic enterprise that builds and organizes knowledge, and the set of knowledge produced by this enterprise" .
    
    wd:Q46857 rdfs:label "scientific method" ;
        schema:description "mathematical and experimental techniques employed in the natural sciences; more specifically, techniques used in the construction and testing of scientific hypotheses" ;
        wdt:P1535 wd:Q336 .

    << wd:Q46857 wdt:P1535 wd:Q336 >>
    s:distance 376 ;
    llm:interpretation "Scientific method is used by science" .
    
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
    @prefix s: <http://example.org/semantic/> .
    @prefix llm: <http://example.org/llm/> .

    wd:Q81938 rdfs:label "pain" ;
        schema:description "type of unpleasant feeling" ;
        wdt:P2176 wd:Q408801 .

    << wd:Q81938 wdt:P2176 wd:Q408801 >>
    s:distance 749 ;
    llm:interpretation "Pain is treated using celecoxib." .

    wd:Q408801 rdfs:label "celecoxib" ;
        schema:description "chemical compound" ;
        wdt:P2175 wd:Q52849 .
        
    << wd:Q408801 wdt:P2175 wd:Q52849 >>
    s:distance 902 ;
    llm:interpretation "Celecoxib is used for treating ankylosing spondylitis." .

    wd:Q52849 rdfs:label "ankylosing spondylitis" ;
        schema:description "type of arthritis in which there is long term inflammation of the joints of the spine" ;
        wdt:P279 wd:Q7577457 .

    << wd:Q52849 wdt:P279 wd:Q7577457 >>
    s:distance 494 ;
    llm:interpretation "Ankylosing spondylitis is a subclass of spinal disease." .

    wd:Q7577457 rdfs:label "spinal disease" ;
        schema:description "disease involving the vertebral column" ;
        wdt:P927 wd:Q1979420 .

    << wd:Q7577457 wdt:P927 wd:Q1979420 >>
    s:distance 525 ;
    llm:interpretation "Spinal disease is located in the human vertebral column." .

    wd:Q1979420 rdfs:label "human vertebral column" ;
        schema:description "spine of humans" ;
        wdt:P279 wd:Q482853 .

    << wd:Q1979420 wdt:P279 wd:Q482853 >>
    s:distance 46 ;
    llm:interpretation "The human vertebral column is a subclass of the vertebral column." .

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
    {
      entityA: "Q2",
      entityB: "Q177",
      rawPath: `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
      @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
      @prefix schema: <http://schema.org/> .
      @prefix wd: <http://www.wikidata.org/entity/> .
      @prefix wdt: <http://www.wikidata.org/prop/direct/> .
      @prefix s: <http://example.org/semantic/> .
      @prefix llm: <http://example.org/llm/> .
      
      wd:Q2 rdfs:label "Earth" ; 
          schema:description "third planet from the Sun in the Solar System" ; 
          wdt:P527 wd:Q1349417 .
      
      << wd:Q2 wdt:P527 wd:Q1349417 >>
      s:distance 310 ;
      llm:interpretation "Earth encompasses Earth's surface as a fundamental part." .
      
      wd:Q1349417 rdfs:label "Earth's surface" ; 
          schema:description "term for the surface of the Earth" ; 
          wdt:P17 wd:Q16 .
      
      << wd:Q1349417 wdt:P17 wd:Q16 >>
      s:distance 811 ;
      llm:interpretation "Earth's surface is a segment of Canada, denoting its geographical inclusion." .
      
      wd:Q16 rdfs:label "Canada" ; 
          schema:description "country in North America" .
      
      wd:Q38 rdfs:label "Italy" ; 
          schema:description "country in Southern Europe" ; 
          wdt:P530 wd:Q16 .
      
      << wd:Q38 wdt:P530 wd:Q16 >>
      s:distance 363 ;
      llm:interpretation "Italy establishes diplomatic ties with Canada, reflecting international relations." .
      
      wd:Q177 rdfs:label "pizza" ; 
          schema:description "popular Italian dish with a flat dough-based base and toppings" ; 
          wdt:P495 wd:Q38 .
      
      << wd:Q177 wdt:P495 wd:Q38 >>
      s:distance 570 ;
      llm:interpretation "Pizza, an iconic cuisine, originates from Italy, marking its culinary heritage." .
      
      wd:P527 rdfs:label "has part(s)" ; 
          schema:description "part of this subject" .
      
      wd:P17 rdfs:label "country" ; 
          schema:description "sovereign state that this item is in" .
      
      wd:P530 rdfs:label "diplomatic relation" ; 
          schema:description "diplomatic relations of the country" .
      
      wd:P495 rdfs:label "country of origin" ; 
          schema:description "country of origin of this item" .
      `,

      textual: `Earth, the third planet from the Sun, includes Earth's surface as a part. The surface of the Earth is conceptually linked to Canada, a country in North America. Canada has a diplomatic relationship with Italy, a country in Southern Europe known for its popular dish, pizza. Pizza, characterized as a flat dough-based dish with various toppings, originates from Italy.`,
    },
    {
      entityA: "Q12206942",
      entityB: "Q2",
      rawPath: `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
      @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
      @prefix schema: <http://schema.org/> .
      @prefix wd: <http://www.wikidata.org/entity/> .
      @prefix wdt: <http://www.wikidata.org/prop/direct/> .
      @prefix s: <http://example.org/semantic/> .
      @prefix llm: <http://example.org/llm/> .
      
      wd:Q12206942 rdfs:label "Darth Vader" ;
          schema:description "main villain of the Star Wars Trilogy" ; 
          wdt:P1165 wd:Q723764 .
      
      << wd:Q12206942 wdt:P1165 wd:Q723764 >>
      s:distance 510 ;
      llm:interpretation "Darth Vader originates from Tatooine, marking the character's planetary origin." .
      
      wd:Q723764 rdfs:label "Tatooine" ;
          schema:description "fictional planet in the Star Wars universe" ;
          wdt:P31 wd:Q108059870 .
      
      << wd:Q723764 wdt:P31 wd:Q108059870 >>
      s:distance 378 ;
      llm:interpretation "Tatooine is an instance of a Star Wars planet, categorizing it within the universe." .
      
      wd:Q108059870 rdfs:label "Star Wars planet" ;
          schema:description "planet appearing in the Star Wars universe" ;
          wdt:P279 wd:Q2775969 .
      
      << wd:Q108059870 wdt:P279 wd:Q2775969 >>
      s:distance 343 ;
      llm:interpretation "A Star Wars planet is a subclass of fictional planets, situating it in the realm of fiction." .
      
      wd:Q2775969 rdfs:label "fictional planet" ; 
          schema:description "planet that only appears in works of fiction" ;
          wdt:P1074 wd:Q634 .
      
      << wd:Q2775969 wdt:P1074 wd:Q634 >>
      s:distance 329 ;
      llm:interpretation "A fictional planet represents a fictional or mythical analog of a real planet, bridging fiction and reality." .
      
      wd:Q634 rdfs:label "planet" ;
          schema:description "celestial body directly orbiting a star or stellar remnant" ;
          wdt:P5869 wd:Q2 .
      
      << wd:Q634 wdt:P5869 wd:Q2 >>
      s:distance 291 ;
      llm:interpretation "A planet like Earth serves as a model item for conceptualizing celestial bodies in the universe." .
      
      wd:Q2 rdfs:label "Earth" ; 
          schema:description "third planet from the Sun in the Solar System" .
      
      wd:P1165 rdfs:label "home world" ;
          schema:description "home planet or natural satellite for a fictional character or species" .
      
      wd:P31 rdfs:label "instance of" ;
          schema:description "this item is a subclass (subset) of that item; all instances of this item are instances of that item" .
      
      wd:P279 rdfs:label "subclass of" ;
          schema:description "this item is a subclass (subset) of that item; all instances of this item are instances of that item" .
      
      wd:P1074 rdfs:label "fictional or mythical analog of" ; 
          schema:description "used to link an entity or class of entities appearing in a creative work with the analogous entity or class of entities in the real world" .
      
      wd:P5869 rdfs:label "model item" ;
          schema:description "defines which item is a best practice example of modelling a subject, which is described by the value of this property, usage instructions at" .
      `,

      textual: `Darth Vader, the main villain of the Star Wars Trilogy, hails from his home world, Tatooine. Tatooine is a fictional planet within the Star Wars universe and is considered an instance of a broader category known as 'Star Wars planets'. Each Star Wars planet is, in turn, a subclass of fictional planets, which are planets that only exist in works of fiction. The concept of a fictional planet has a fictional or mythical analog in the real world, represented by the entity 'planet'. A planet is a celestial body that orbits a star, and Earth is presented as a model item or best practice example of a planet.`,
    }
  ];

  const processedPaths = [];
  
  for (let index in turtleStarData) {
    const parser = new N3.Parser();
    const path = new N3.Store();
    const entry = turtleStarData[index];

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


export const getRelationInformation = (relations, path) => {
  const quadMap = new Map();
  path.getQuads().forEach(quad => {
    if (quad.subject.termType === 'Quad') {
      const key = `${quad.subject.subject.value}-${quad.subject.object.value}`;
      if (!quadMap.has(key)) {
        quadMap.set(key, []);
      }
      quadMap.get(key).push(quad);
    }
  });

  const enrichedRelations = relations.map(relation => {
    const enrichedRelation = { ...relation, semanticDistance: null, interpretation: null };

    const key = `http://www.wikidata.org/entity/${relation.subject}-http://www.wikidata.org/entity/${relation.object}`;
    const relevantQuads = quadMap.get(key);

    if (relevantQuads) {
      relevantQuads.forEach(quad => {
        if (quad.predicate.value === 'http://example.org/semantic/distance') {
          enrichedRelation.semanticDistance = quad.object.value;
        } else if (quad.predicate.value === 'http://example.org/llm/interpretation') {
          enrichedRelation.interpretation = quad.object.value;
        }
      });
    }

    return enrichedRelation;
  });

  return enrichedRelations;
};

