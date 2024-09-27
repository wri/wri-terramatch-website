interface IDataSubmitPolygons {
  id: string;
  name: string;
  status: "draft" | "submitted" | "approved" | "under-review" | "needs-more-information";
  isSubmitted: boolean;
}

export const dataSubmitPolygons: IDataSubmitPolygons[] = [
  { id: "1", name: "Aerobic-agroforestry", status: "approved", isSubmitted: true },
  { id: "2", name: "Arcos", status: "needs-more-information", isSubmitted: false },
  { id: "3", name: "Bccp", status: "submitted", isSubmitted: false },
  { id: "4", name: "Blue-forest", status: "approved", isSubmitted: true },
  { id: "5", name: "Durrell", status: "submitted", isSubmitted: false },
  { id: "6", name: "Ecofix", status: "submitted", isSubmitted: true },
  { id: "7", name: "Env-coffee-forest-forum", status: "submitted", isSubmitted: false },
  { id: "8", name: "Env-found-afr-sl", status: "needs-more-information", isSubmitted: true }
];

export const dataImageGallery = [
  {
    id: "1",
    title: "Non-Geotagged Images",
    images: [
      {
        id: "1",
        src: "/Images/image-modal-main.png",
        title: "TerraMatch Sample",
        dateCreated: "December 29, 2024",
        geoTag: "Not Geo-Referenced"
      },
      {
        id: "2",
        src: "/Images/image-modal-1.png",
        title: "TerraMatch Sample",
        dateCreated: "December 29, 2024",
        geoTag: "Not Geo-Referenced"
      },
      {
        id: "3",
        src: "/Images/image-modal-2.png",
        title: "TerraMatch Sample",
        dateCreated: "December 29, 2024",
        geoTag: "Not Geo-Referenced"
      },
      {
        id: "4",
        src: "/Images/image-modal-3.png",
        title: "TerraMatch Sample",
        dateCreated: "December 29, 2024",
        geoTag: "Not Geo-Referenced"
      },
      {
        id: "5",
        src: "/Images/image-modal-4.png",
        title: "TerraMatch Sample",
        dateCreated: "December 29, 2024",
        geoTag: "Not Geo-Referenced"
      },
      {
        id: "6",
        src: "/Images/image-modal-5.png",
        title: "TerraMatch Sample",
        dateCreated: "December 29, 2024",
        geoTag: "Not Geo-Referenced"
      }
    ]
  },
  {
    id: "2",
    title: "GeoTagged Images",
    images: [
      {
        id: "1",
        src: "/Images/image-modal-main.png",
        title: "TerraMatch Sample",
        dateCreated: "December 29, 2024",
        geoTag: "Not Geo-Referenced"
      },
      {
        id: "2",
        src: "/Images/image-modal-1.png",
        title: "TerraMatch Sample",
        dateCreated: "December 29, 2024",
        geoTag: "Not Geo-Referenced"
      },
      {
        id: "3",
        src: "/Images/image-modal-2.png",
        title: "TerraMatch Sample",
        dateCreated: "December 29, 2024",
        geoTag: "Not Geo-Referenced"
      },
      {
        id: "4",
        src: "/Images/image-modal-3.png",
        title: "TerraMatch Sample",
        dateCreated: "December 29, 2024",
        geoTag: "Not Geo-Referenced"
      },
      {
        id: "5",
        src: "/Images/image-modal-4.png",
        title: "TerraMatch Sample",
        dateCreated: "December 29, 2024",
        geoTag: "Not Geo-Referenced"
      },
      {
        id: "6",
        src: "/Images/image-modal-5.png",
        title: "TerraMatch Sample",
        dateCreated: "December 29, 2024",
        geoTag: "Not Geo-Referenced"
      }
    ]
  }
];

export const uploadImageData = [
  { id: "1", name: "Images5.png", status: "We are processing your image", isVerified: true },
  { id: "2", name: "Images4.png", status: "We are processing your image", isVerified: true },
  { id: "3", name: "Images3.png", status: "/home/solidgrids/Images3.png", isVerified: true },
  { id: "4", name: "Images2.png", status: "/home/solidgrids/Images2.png", isVerified: false },
  { id: "5", name: "Images1.png", status: "/home/solidgrids/Images1.png", isVerified: false }
];

export const polygonStatusLabels = [
  { id: "1", label: "Submitted" },
  { id: "2", label: "Needs More Information" },
  { id: "3", label: "Approved" }
];

export const commentaryFiles = [
  { uuid: "1", file_name: "img-attachment.jpeg" },
  { uuid: "2", file_name: "img-attachment-with-large-name.jpeg" },
  { uuid: "3", file_name: "img-attachment.jpeg" },
  { uuid: "4", file_name: "img-attachment.jpeg" }
];

export const commentariesItems = [
  {
    id: "1",
    name: "Ricardo",
    lastName: "Saavedra",
    date: "Oct 6, 2022 at 1:12 AM",
    commentary: `Don't see the outline. the source code also needs to be updated.re: aligned to one source. we need to make sure whether this is appropriate. consider that we have the organization in sign-up/profile, mask, and work request boards. On Thursday will provide the the source tables requested`,
    files: commentaryFiles,
    status: "submitted"
  },
  {
    id: "2",
    name: "Katie",
    lastName: "Evers",
    date: "Oct 5, 2022 at 11:51 PM",
    commentary: `The zoom to areas table sources the main mapvi
        ew drop down list which only has for example, "Adams County" and not "Unincorporated Adams County". Do we want both options? @ricardosaavedra2    what is the source table of the mask layers? and also what is the source layer for work request drop down? Earlier this week when I was trying to add highlands ranch geom you said 'jurisdictions'. I added it but still don't see the outline. All this should be aligned to one source with data restructure I added it but still don't see the outline. All this should be aligned to one source with data restructure I added it but still don't see the outline. All this should be aligned to one source with data restructure`,
    status: "draft"
  }
];
