import EntityMapAndGalleryCard, {
  EntityMapAndGalleryCardProps
} from "@/components/extensive/EntityMapAndGalleryCard/EntityMapAndGalleryCard";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";

const GalleryTab = (props: EntityMapAndGalleryCardProps) => {
  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <EntityMapAndGalleryCard {...props} />
        </PageColumn>
      </PageRow>
      <br />
      <br />
    </PageBody>
  );
};

export default GalleryTab;
