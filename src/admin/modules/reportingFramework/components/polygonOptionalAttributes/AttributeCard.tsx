import {
  ArrowCircleDown as ArrowCircleDownIcon,
  ArrowCircleUp as ArrowCircleUpIcon,
  ExpandMore as ExpandMoreIcon,
  RemoveCircleOutline as RemoveCircleOutlineIcon
} from "@mui/icons-material";
import { Box, Card, CardContent, FormControlLabel, Stack, Switch, TextField, Typography } from "@mui/material";
import type { FC } from "react";

import { AttributeOptionsList } from "./AttributeOptionsList";
import { CircularIconButton } from "./CircularIconButton";
import { previewKeyFromLabel } from "./mappers";
import { LocalAttribute } from "./types";

type AttributeCardProps = {
  attribute: LocalAttribute;
  index: number;
  total: number;
  onToggleExpand: (localId: string) => void;
  onUpdate: (localId: string, patch: Partial<LocalAttribute>) => void;
  onMove: (localId: string, direction: -1 | 1) => void;
  onRemove: (localId: string) => void;
  onAddOption: (attributeLocalId: string) => void;
  onUpdateOption: (attributeLocalId: string, optionLocalId: string, label: string) => void;
  onRemoveOption: (attributeLocalId: string, optionLocalId: string) => void;
  onMoveOption: (attributeLocalId: string, optionLocalId: string, direction: -1 | 1) => void;
};

export const AttributeCard: FC<AttributeCardProps> = ({
  attribute,
  index,
  total,
  onToggleExpand,
  onUpdate,
  onMove,
  onRemove,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
  onMoveOption
}) => (
  <Card variant="outlined" sx={{ boxShadow: "none" }}>
    <CardContent
      sx={{
        py: 1,
        px: 2,
        "&:last-child": { pb: attribute.isExpanded ? 2 : 1 }
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          className="min-w-0 flex-1 cursor-pointer"
          onClick={() => onToggleExpand(attribute.localId)}
        >
          <ExpandMoreIcon
            fontSize="small"
            color="action"
            sx={{
              transform: attribute.isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.15s ease"
            }}
          />
          <Typography variant="body1" noWrap title={attribute.label || "New Attribute"}>
            {attribute.label || "New Attribute"}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexShrink: 0 }}>
          <CircularIconButton
            onClick={event => {
              event.stopPropagation();
              onMove(attribute.localId, -1);
            }}
            disabled={index === 0}
            ariaLabel="Move attribute up"
          >
            <ArrowCircleUpIcon fontSize="small" />
          </CircularIconButton>
          <CircularIconButton
            onClick={event => {
              event.stopPropagation();
              onMove(attribute.localId, 1);
            }}
            disabled={index === total - 1}
            ariaLabel="Move attribute down"
          >
            <ArrowCircleDownIcon fontSize="small" />
          </CircularIconButton>
          <CircularIconButton
            onClick={event => {
              event.stopPropagation();
              onRemove(attribute.localId);
            }}
            color="warning"
            ariaLabel="Delete attribute"
          >
            <RemoveCircleOutlineIcon fontSize="small" />
          </CircularIconButton>
        </Stack>
      </Stack>

      {attribute.isExpanded && (
        <Box className="mt-3 space-y-3">
          <TextField
            label="Key"
            value={attribute.key ?? previewKeyFromLabel(attribute.label)}
            fullWidth
            size="small"
            disabled
            helperText={
              attribute.uuid != null
                ? "Stable machine name. Locked after create."
                : "Preview of the key the backend will generate from the label on save."
            }
          />

          <TextField
            label="Label *"
            value={attribute.label}
            onChange={event => onUpdate(attribute.localId, { label: event.target.value })}
            fullWidth
            size="small"
            error={attribute.label.trim() === ""}
            helperText={attribute.label.trim() === "" ? "Label is required" : undefined}
          />

          <Stack direction="row" spacing={4}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={attribute.isRequired}
                  onChange={event => onUpdate(attribute.localId, { isRequired: event.target.checked })}
                />
              }
              label="Required"
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={attribute.inputType === "multi_select"}
                  onChange={event =>
                    onUpdate(attribute.localId, {
                      inputType: event.target.checked ? "multi_select" : "single_select"
                    })
                  }
                  disabled={attribute.uuid != null}
                />
              }
              label="Multiselect"
            />
          </Stack>
          {attribute.uuid != null && (
            <Typography variant="caption" color="text.secondary">
              Input type cannot be changed after an attribute is created.
            </Typography>
          )}

          <AttributeOptionsList
            attributeLocalId={attribute.localId}
            options={attribute.options}
            onAdd={onAddOption}
            onUpdate={onUpdateOption}
            onRemove={onRemoveOption}
            onMove={onMoveOption}
          />
        </Box>
      )}
    </CardContent>
  </Card>
);
