import Button from "@/components/elements/Button/Button";
import LinearProgressBarMonitored from "@/components/elements/ProgressBar/LinearProgressBar/LineProgressBarMonitored";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalNotes from "@/components/extensive/Modal/ModalNotes";
import ModalRunAnalysis from "@/components/extensive/Modal/ModalRunAnalysis";
import { useModalContext } from "@/context/modal.provider";

const HeaderMonitoredTab = () => {
  const { openModal, closeModal } = useModalContext();

  const dataPolygonOverview = [
    {
      status: "Draft",
      count: 12.5,
      color: "bg-grey-200"
    },
    {
      status: "Submitted",
      count: 42.5
    },
    {
      status: "Needs Info",
      count: 22.5
    },
    {
      status: "Approved",
      count: 22.5
    }
  ];

  const openRunAnalysis = () => {
    openModal(
      ModalId.MODAL_RUN_ANALYSIS,
      <ModalRunAnalysis
        title="Update Analysis "
        content="Project Developers may submit one or all polygons for review."
        primaryButtonText="Run"
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => {
            closeModal(ModalId.MODAL_RUN_ANALYSIS);
          }
        }}
        onClose={() => closeModal(ModalId.MODAL_RUN_ANALYSIS)}
        secondaryButtonText="Cancel"
        secondaryButtonProps={{
          className: "px-8 py-3",
          variant: "white-page-admin",
          onClick: () => closeModal(ModalId.MODAL_RUN_ANALYSIS)
        }}
      />
    );
  };

  const openNotes = () => {
    openModal(
      ModalId.MODAL_NOTES,
      <ModalNotes
        title="Notes"
        content="Baseline Analysis Underway: There are 200 approved polygons for this project 
that are ready for analysis and 90 that have been analyzed already. Update the 
graphs and tables below by clicking update analysis button to your right. "
        primaryButtonText="Close"
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "white-page-admin",
          onClick: () => {
            closeModal(ModalId.MODAL_NOTES);
          }
        }}
        onClose={() => closeModal(ModalId.MODAL_NOTES)}
      />
    );
  };

  return (
    <div className="flex w-full items-center justify-between rounded-xl px-6 py-3 shadow-monitored">
      <div className="flex items-baseline gap-9">
        <div className="w-[35vw]">
          <div className="flex items-center justify-between">
            <Text variant="text-14-semibold">Polygon Overview</Text>
            <div className="flex items-center gap-1">
              <Text as="span" variant="text-12" className="text-darkCustom-300">
                Analyzed:
              </Text>
              <Icon name={IconNames.IC_LOADING} className="h-4 w-4 text-success-600" />
              <Text as="span" variant="text-12-bold" className="text-darkCustom-300">
                Baseline
              </Text>
            </div>
          </div>
          <div className="w-[35vw] pt-2">
            <LinearProgressBarMonitored data={dataPolygonOverview} />
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <Text variant="text-12" className=" text-darkCustom">
              No. of Polygons
            </Text>
            <Text variant="text-12-bold" className="text-darkCusto pt-1">
              45
            </Text>
          </div>
          <div>
            <Text variant="text-12" className=" text-darkCustom">
              No. of Sites
            </Text>
            <Text variant="text-12-bold" className="pt-1 text-darkCustom">
              12
            </Text>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          className="h-[40px] text-darkCustom hover:text-primary"
          onClick={() => {
            openNotes();
          }}
        >
          <Icon name={IconNames.IC_NOTIFICATION} className="h-[40px]  w-[40px]" />
        </button>
        <Button
          variant="primary"
          className="!rounded-lg"
          onClick={() => {
            openRunAnalysis();
          }}
        >
          Update analysis
        </Button>
      </div>
    </div>
  );
};

export default HeaderMonitoredTab;
