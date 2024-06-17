import { MapPolygonCheckPanelItemProps } from "@/components/elements/MapPolygonPanel/MapPolygonCheckPanelItem";
import { MapPolygonPanelItemProps } from "@/components/elements/MapPolygonPanel/MapPolygonPanelItem";

export const uploadImageData = [
  { id: "1", name: "Images5.png", status: "We are processing your image", isVerified: true },
  { id: "2", name: "Images4.png", status: "We are processing your image", isVerified: true },
  { id: "3", name: "Images3.png", status: "/home/solidgrids/Images3.png", isVerified: true },
  { id: "4", name: "Images2.png", status: "/home/solidgrids/Images2.png", isVerified: false },
  { id: "5", name: "Images1.png", status: "/home/solidgrids/Images1.png", isVerified: false }
];

export const polygonStatusLabels = [
  { id: "1", label: "Site Approved" },
  { id: "2", label: "Polygons Submitted" },
  { id: "3", label: "Polygons Approved" },
  { id: "4", label: "Monitoring Begins" }
];

export const commentaryFiles = [
  { id: "1", file: "img-attachment.jpeg" },
  { id: "2", file: "img-attachment-with-large-name.jpeg" },
  { id: "3", file: "img-attachment.jpeg" },
  { id: "4", file: "img-attachment.jpeg" }
];

export const commentariesItems = [
  {
    id: "1",
    name: "Ricardo",
    lastName: "Saavedra",
    date: "Oct 6, 2022 at 1:12 AM",
    commentary: `Don't see the outline. the source code also needs to be updated.re: aligned to one source. we need to make sure whether this is appropriate. consider that we have the organization in sign-up/profile, mask, and work request boards. On Thursday will provide the the source tables requested`,
    files: commentaryFiles,
    status: "Submitted"
  },
  {
    id: "2",
    name: "Katie",
    lastName: "Evers",
    date: "Oct 5, 2022 at 11:51 PM",
    commentary: `The zoom to areas table sources the main mapvi
      ew drop down list which only has for example, "Adams County" and not "Unincorporated Adams County". Do we want both options? @ricardosaavedra2    what is the source table of the mask layers? and also what is the source layer for work request drop down? Earlier this week when I was trying to add highlands ranch geom you said 'jurisdictions'. I added it but still don't see the outline. All this should be aligned to one source with data restructure I added it but still don't see the outline. All this should be aligned to one source with data restructure I added it but still don't see the outline. All this should be aligned to one source with data restructure`,
    status: "Draft"
  }
];

export const PolygonData: MapPolygonPanelItemProps[] = [
  {
    uuid: "1",
    title: "Polygon 1",
    subtitle: "Created 15/12/2023"
  },
  {
    uuid: "2",
    title: "Polygon 2",
    subtitle: "Created 15/12/2023"
  },
  {
    uuid: "3",
    title: "Polygon 3",
    subtitle: "Created 15/12/2023"
  },
  {
    uuid: "4",
    title: "Polygon 4",
    subtitle: "Created 15/12/2023"
  },
  {
    uuid: "5",
    title: "Polygon 5",
    subtitle: "Created 15/12/2023"
  }
];

export const PolygonAvailableData: MapPolygonCheckPanelItemProps[] = [
  {
    uuid: "1",
    title: "Durrell",
    status: "Submitted"
  },
  {
    uuid: "2",
    title: "Ecofix",
    status: "Approved"
  },
  {
    uuid: "3",
    title: "Env Coffee Forest Forum",
    status: "Needs More Info",
    polygon: ["Not WGS 84 projection", "Not WGS 84 projection", "Overlapping polygons identified"]
  },
  {
    uuid: "4",
    title: "Env Found Afr Sl",
    status: "Submitted"
  },
  {
    uuid: "5",
    title: "Justdiggit",
    status: "Draft"
  }
];
