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

export const comentaryFiles = [
  { id: "1", file: "img-attachment.jpeg" },
  { id: "2", file: "img-attachment-with-large-name.jpeg" },
  { id: "3", file: "img-attachment.jpeg" },
  { id: "4", file: "img-attachment.jpeg" }
];

export const comentariesItems = [
  {
    id: "1",
    name: "Ricardo",
    lastName: "Saavedra",
    date: "Oct 6, 2022 at 1:12 AM",
    comentary: `Don't see the outline. the source code also needs to be updated.re: aligned to one source. we need to make sure whether this is appropriate. consider that we have the organization in sign-up/profile, mask, and work request boards. On Thursday will provide the the source tables requested`,
    files: comentaryFiles,
    status: "Submitted"
  },
  {
    id: "2",
    name: "Katie",
    lastName: "Evers",
    date: "Oct 5, 2022 at 11:51 PM",
    comentary: `The zoom to areas table sources the main mapvi
      ew drop down list which only has for example, "Adams County" and not "Unincorporated Adams County". Do we want both options? @ricardosaavedra2    what is the source table of the mask layers? and also what is the source layer for work request drop down? Earlier this week when I was trying to add highlands ranch geom you said 'jurisdictions'. I added it but still don't see the outline. All this should be aligned to one source with data restructure I added it but still don't see the outline. All this should be aligned to one source with data restructure I added it but still don't see the outline. All this should be aligned to one source with data restructure`,
    status: "Draft"
  }
];
