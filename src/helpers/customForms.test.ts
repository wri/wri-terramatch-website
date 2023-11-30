import * as yup from "yup";

import { FieldType, FormStepSchema } from "@/components/extensive/WizardForm/types";
import { normalizedFormData, normalizedFormDefaultValue } from "@/helpers/customForms";

const formSteps: FormStepSchema[] = [
  {
    title: "test",
    fields: [
      {
        name: "inputTable",
        type: FieldType.InputTable,
        validation: yup.object().required(),
        fieldProps: {
          headers: ["Head1", "Head2"],
          rows: [
            {
              name: "childQuestion1",
              type: FieldType.Input,
              validation: yup.number(),
              fieldProps: {
                type: "number"
              }
            },
            {
              name: "childQuestion2",
              type: FieldType.Input,
              validation: yup.number(),
              fieldProps: {
                type: "number"
              }
            },
            {
              name: "childQuestion3",
              type: FieldType.Input,
              validation: yup.number(),
              fieldProps: {
                type: "number"
              }
            }
          ]
        }
      },
      {
        name: "map",
        type: FieldType.Map,
        validation: yup.object(),
        fieldProps: {}
      }
    ]
  }
];

describe("normalizedFormDefaultValue", () => {
  test("transform InputTable correctly", () => {
    const values = {
      childQuestion1: 1,
      childQuestion2: 2,
      childQuestion3: 3
    };

    expect(normalizedFormDefaultValue(values, formSteps)).toEqual({
      childQuestion1: 1,
      childQuestion2: 2,
      childQuestion3: 3,
      inputTable: {
        childQuestion1: 1,
        childQuestion2: 2,
        childQuestion3: 3
      }
    });
  });

  test("remove 'uuid', 'updated_at', 'deleted_at', 'created_at' from response", () => {
    const values = {
      uuid: "e65fc793-602c-4355-b8e9-14cbbfdbebba",
      updated_at: "2023-05-02T09:29:50.000000Z",
      deleted_at: "2023-05-02T09:29:50.000000Z",
      created_at: "2023-05-02T09:29:50.000000Z",
      childQuestion1: 1,
      childQuestion2: 2,
      childQuestion3: 3
    };

    expect(normalizedFormDefaultValue(values, formSteps)).toEqual({
      childQuestion1: 1,
      childQuestion2: 2,
      childQuestion3: 3,
      inputTable: {
        childQuestion1: 1,
        childQuestion2: 2,
        childQuestion3: 3
      }
    });
  });

  test("remove work correctly if 'deleted_at' and 'uuid' are missing", () => {
    const values = {
      updated_at: "2023-05-02T09:29:50.000000Z",
      created_at: "2023-05-02T09:29:50.000000Z",
      childQuestion1: 1,
      childQuestion2: 2,
      childQuestion3: 3
    };

    expect(normalizedFormDefaultValue(values, formSteps)).toEqual({
      childQuestion1: 1,
      childQuestion2: 2,
      childQuestion3: 3,
      inputTable: {
        childQuestion1: 1,
        childQuestion2: 2,
        childQuestion3: 3
      }
    });
  });
});

describe("normalizedFormData", () => {
  test("transform InputTable correctly", () => {
    const values = {
      inputTable: {
        childQuestion1: 1,
        childQuestion2: 2,
        childQuestion3: 3
      }
    };

    expect(normalizedFormData(values, formSteps)).toEqual({
      childQuestion1: 1,
      childQuestion2: 2,
      childQuestion3: 3
    });
  });

  test("transform map correctly", () => {
    const values = {
      map: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { shape: "Polygon", name: "Unnamed Layer", category: "default" },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-1.866486, 50.721936],
                  [-1.86093, 50.72235],
                  [-1.861273, 50.723898],
                  [-1.86137, 50.724279],
                  [-1.861788, 50.724741],
                  [-1.862957, 50.725318],
                  [-1.866486, 50.721936]
                ]
              ]
            },
            id: "680925aa-9f37-49e5-8127-e5fe7a9c3dc8"
          }
        ]
      }
    };

    expect(normalizedFormData(values, formSteps).map).toEqual(
      `{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"shape":"Polygon","name":"Unnamed Layer","category":"default"},"geometry":{"type":"Polygon","coordinates":[[[-1.866486,50.721936],[-1.86093,50.72235],[-1.861273,50.723898],[-1.86137,50.724279],[-1.861788,50.724741],[-1.862957,50.725318],[-1.866486,50.721936]]]},"id":"680925aa-9f37-49e5-8127-e5fe7a9c3dc8"}]}`
    );
  });
});
