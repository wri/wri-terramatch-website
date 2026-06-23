import { useT } from "@transifex/react";
import { useMemo } from "react";

const DISTURBANCE_COMPACT_LIST_UL = '<ul style="margin:0.25rem 0 0;padding:0">';
const DISTURBANCE_COMPACT_LIST_LI = '<li style="margin-top:0.25rem">';

const DISTURBANCE_TYPE_FIELD_DESCRIPTION =
  "The three major disturbance types used in TerraMatch are defined below:" +
  DISTURBANCE_COMPACT_LIST_UL +
  "<li><strong>Ecological</strong> – minor natural disturbances that impact less than half of planted trees or the project area including pests, small erosion events, etc.</li>" +
  DISTURBANCE_COMPACT_LIST_LI +
  "<strong>Climatic</strong> – major natural disturbances that impact more than half of planted trees or the project area, including flooding, wildfires, etc.</li>" +
  DISTURBANCE_COMPACT_LIST_LI +
  "<strong>Man-made</strong> – minor or major human-caused disturbances, including site vandalism, illegal grazing, etc.</li>" +
  "</ul>";

const DISTURBANCE_INTENSITY_FIELD_DESCRIPTION =
  "Indicate the severity of the disturbance event:" +
  DISTURBANCE_COMPACT_LIST_UL +
  "<li><strong>Low</strong> – A small issue that is easy to manage and has little impact on the project. It usually requires minimal time and resources to fix and doesn't cause significant delays. Example: a few newly planted trees are damaged by local wildlife grazing for example. The damage is minor and can be quickly fixed.</li>" +
  DISTURBANCE_COMPACT_LIST_LI +
  "<strong>Medium</strong> – An incident that has a more noticeable impact on the project and might affect its timeline, budget, or scope. It may need a focused response and extra resources, but it's still manageable within the project's overall plan. Example: a pest outbreak that affects a significant portion of the vegetation, requiring a coordinated pest management plan to stop it from spreading and causing further damage.</li>" +
  DISTURBANCE_COMPACT_LIST_LI +
  "<strong>High</strong> – A serious event that puts the project's success or stakeholders at significant risk. It requires an immediate and strong response, possibly with help from external sources like the local government, and can cause major delays, increased costs, or long-term problems for the project. Example: a major flood or landslide in a restoration area that destroys large sections of newly planted trees or seedlings, requiring a complete reevaluation of the project plan, emergency measures to prevent further damage, and extensive efforts to restore the affected area.</li>" +
  "</ul>";

const useDisturbanceReportDescriptions = () => {
  const t = useT();

  return useMemo(
    () => ({
      DISTURBANCE_TYPE_FIELD_DESCRIPTION: t(DISTURBANCE_TYPE_FIELD_DESCRIPTION),
      DISTURBANCE_INTENSITY_FIELD_DESCRIPTION: t(DISTURBANCE_INTENSITY_FIELD_DESCRIPTION),
      DISTURBANCE_SUBTYPE_FIELD_DESCRIPTION: t(
        `For more information on each subtype, please see <a href="https://terramatchsupport.zendesk.com/hc/en-us/articles/50591003474843-How-and-When-to-Report-on-Disturbances-in-your-TerraFund-Project" target="_blank">here</a>`
      ),
      DISTURBANCE_EXTEND_FIELD_DESCRIPTION: t(
        `Estimated percentage of the project area or planted trees affected, or saplings grown in the nurseries affected by the disturbance event`
      ),
      DISTURBANCE_PEOPLE_AFFECTED_FIELD_DESCRIPTION: t(
        `Provide the estimated total number of individuals impacted over the duration of the disturbance event`
      ),
      DISTURBANCE_MONETARY_DAMAGE_FIELD_DESCRIPTION: t(
        `Provide an estimate of the amount of damage incurred by the disturbance event`
      ),
      DISTURBANCE_PROPERTY_AFFECTED_FIELD_DESCRIPTION: t(
        `Identify the property that was affected by the disturbance event`
      ),
      DISTURBANCE_START_DATE_FIELD_DESCRIPTION: t(`Indicate when the disturbance event began`),
      DISTURBANCE_END_DATE_FIELD_DESCRIPTION: t(
        `Indicate when the disturbance event ended. If the event is ongoing, leave this field empty.`
      ),
      DISTURBANCE_SITE_AFFECTED_FIELD_DESCRIPTION: t(`Select the sites where the disturbance event occurred`),
      DISTURBANCE_POLYGONS_FIELD_DESCRIPTION: t(`Select the polygons where the disturbance event occurred`),
      DISTURBANCE_NURSERY_AFFECTED_FIELD_DESCRIPTION: t(`Select the nurseries where the disturbance event occurred`)
    }),
    [t]
  );
};

export default useDisturbanceReportDescriptions;
