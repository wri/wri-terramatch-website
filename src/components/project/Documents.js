import React from "react";
import { useTranslation } from "react-i18next";
import DocumentListItem from "../../components/documentList/DocumentListItem";

const Documents = props => {
  const { documentsState } = props;
  const { t } = useTranslation();

  const documentList = documentsState
    ? documentsState.map((option, index) => (
        <DocumentListItem key={option.id} option={option} type={option.type} />
      ))
    : null;

  return (
    <section className="c-section c-section--thin-width">
      <h2>{t("project.documents.title")}</h2>
      {documentsState && documentsState.length > 0  ?
        documentList
        : <p>{t('project.documents.none')}</p>
      }
    </section>
  );
};

export default Documents;
