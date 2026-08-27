import { Add as AddIcon, ArrowBack as ArrowBackIcon, Save as SaveIcon } from "@mui/icons-material";
import { Box, Button, IconButton, Paper, Stack, Toolbar, Typography } from "@mui/material";
import type { FC } from "react";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import modules from "@/admin/modules";
import { useReportingFramework } from "@/connections/ReportingFramework";

import { AttributeCard } from "./polygonOptionalAttributes/AttributeCard";
import { usePolygonOptionalAttributesEditor } from "./polygonOptionalAttributes/usePolygonOptionalAttributesEditor";

export const PolygonOptionalAttributes: FC = () => {
  const { frameworkKey } = useParams<{ frameworkKey: string }>();
  const navigate = useNavigate();
  const [frameworkLoaded, { data: framework }] = useReportingFramework({ frameworkKey });
  const editor = usePolygonOptionalAttributesEditor(frameworkKey);

  const handleBack = useCallback(() => {
    if (frameworkKey == null) {
      navigate(`/${modules.reportingFramework.ResourceName}`);
      return;
    }
    navigate(`/${modules.reportingFramework.ResourceName}/${frameworkKey}/show`);
  }, [frameworkKey, navigate]);

  return (
    <Box className="p-6">
      <Paper elevation={0} className="mb-6 p-6">
        <Stack direction="row" alignItems="center" spacing={2} className="mb-6">
          <IconButton onClick={handleBack} aria-label="Back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5">
            {frameworkLoaded && framework != null ? `${framework.name} Optional Attributes` : "Optional Attributes"}
          </Typography>
        </Stack>

        <Typography variant="subtitle1" className="mb-2" color="text.secondary">
          Framework
        </Typography>
        <Typography variant="body1" className="mb-6">
          {framework?.name ?? frameworkKey}
        </Typography>

        <Typography variant="h6" className="mb-4">
          Polygon Optional Attributes
        </Typography>

        <Stack spacing={1} className="mb-4">
          {editor.attributes.map((attribute, index) => (
            <AttributeCard
              key={attribute.localId}
              attribute={attribute}
              index={index}
              total={editor.attributes.length}
              onToggleExpand={editor.toggleExpand}
              onUpdate={editor.updateAttribute}
              onMove={editor.moveAttribute}
              onRemove={editor.removeAttribute}
              onAddOption={editor.addOption}
              onUpdateOption={editor.updateOption}
              onRemoveOption={editor.removeOption}
              onMoveOption={editor.moveOption}
            />
          ))}
        </Stack>

        <Button variant="outlined" startIcon={<AddIcon />} onClick={editor.addAttribute} sx={{ mb: 4 }}>
          Add Attribute
        </Button>
      </Paper>

      <Toolbar
        sx={{
          bgcolor: "grey.100",
          borderTop: 1,
          borderColor: "divider",
          px: 3,
          py: 2,
          minHeight: 64
        }}
      >
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={editor.handleSave}
          disabled={editor.isSaving || !editor.definitionsLoaded}
        >
          Save
        </Button>
      </Toolbar>
    </Box>
  );
};
