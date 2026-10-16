import { getProjectMarkersBbox, toProjectMarkerPoints } from "./projectMarkers";

describe("toProjectMarkerPoints", () => {
  it("skips projects without a centroid and falls back to the uuid for a missing name", () => {
    const points = toProjectMarkerPoints([
      { uuid: "a", name: "Alpha", lat: 1, long: 2 },
      { uuid: "b", name: null, lat: 3, long: 4 },
      { uuid: "c", name: "No polygons", lat: null, long: null },
      { uuid: "d", name: "Half centroid", lat: 5, long: null }
    ]);

    expect(points).toEqual([
      { uuid: "a", name: "Alpha", lat: 1, lng: 2 },
      { uuid: "b", name: "b", lat: 3, lng: 4 }
    ]);
  });

  it("keeps a centroid on the equator or prime meridian", () => {
    expect(toProjectMarkerPoints([{ uuid: "a", name: "Zero", lat: 0, long: 0 }])).toEqual([
      { uuid: "a", name: "Zero", lat: 0, lng: 0 }
    ]);
  });
});

describe("getProjectMarkersBbox", () => {
  it("returns undefined when there are no markers", () => {
    expect(getProjectMarkersBbox([])).toBeUndefined();
  });

  it("returns [minLng, minLat, maxLng, maxLat] around every marker", () => {
    expect(
      getProjectMarkersBbox([
        { uuid: "a", name: "A", lat: -1, lng: 36 },
        { uuid: "b", name: "B", lat: 2, lng: 30 },
        { uuid: "c", name: "C", lat: 0.5, lng: 34 }
      ])
    ).toEqual([30, -1, 36, 2]);
  });
});
