/**
 * Generated by @openapi-codegen
 *
 * @version 1.0
 */
export type PreviousPlantingCountDto = {
  /**
   * Taxonomic ID for this tree species row
   */
  taxonId: string | null;
  /**
   * Number of trees of this type that have been planted in all previous reports on this entity.
   */
  amount: number;
};

export type ScientificNameDto = {
  /**
   * The scientific name for this tree species
   *
   * @example Abelia uniflora
   */
  scientificName: string;
};

export type EstablishmentsTreesDto = {
  /**
   * The species that were specified at the establishment of the parent entity keyed by collection. Note that for site reports, the seeds on the site establishment are included under the collection name "seeds"
   *
   * @example {"tree-planted":["Aster Peraliens","Circium carniolicum"],"non-tree":["Coffee"]}
   */
  establishmentTrees: {
    [key: string]: string[];
  };
  /**
   * If the entity in this request is a report, the sum totals of previous planting by species by collection.
   *
   * @example {"tree-planted":{"Aster persaliens":{"amount":256},"Cirsium carniolicum":{"taxonId":"wfo-0000130112","amount":1024}},"non-tree":{"Coffee":{"amount":2048}}}
   */
  previousPlantingCounts: {
    [key: string]: {
      [key: string]: PreviousPlantingCountDto;
    };
  } | null;
};
