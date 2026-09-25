import {
  ArrowCircleDown as ArrowCircleDownIcon,
  ArrowCircleUp as ArrowCircleUpIcon,
  ExpandMore as ExpandMoreIcon,
  RemoveCircleOutline as RemoveCircleOutlineIcon
} from "@mui/icons-material";
import { Box, Card, CardContent, MenuItem, Stack, TextField, Typography } from "@mui/material";
import type { FC } from "react";

import { AttributeOptionsList } from "./AttributeOptionsList";
import { CircularIconButton } from "./CircularIconButton";
import { isSelectType, previewKeyFromLabel } from "./mappers";
import { LocalAttribute } from "./types";

const FIELD_TYPE_OPTIONS: Array<{ value: LocalAttribute["inputType"]; label: string }> = [
  { value: "single_select", label: "Single select" },
  { value: "multi_select", label: "Multi select" },
  { value: "date", label: "Date" }
];

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
            select
            label="Field Type *"
            value={attribute.inputType}
            onChange={event => {
              const inputType = event.target.value as LocalAttribute["inputType"];
              onUpdate(attribute.localId, { inputType, options: isSelectType(inputType) ? attribute.options : [] });
            }}
            fullWidth
            size="small"
            disabled={attribute.uuid != null}
          >
            {FIELD_TYPE_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          {attribute.uuid != null && (
            <Typography variant="caption" color="text.secondary">
              Field type cannot be changed after an attribute is created.
            </Typography>
          )}

          <TextField
            label="Label *"
            value={attribute.label}
            onChange={event => onUpdate(attribute.localId, { label: event.target.value })}
            fullWidth
            size="small"
            error={attribute.label.trim() === ""}
            helperText={attribute.label.trim() === "" ? "Label is required" : undefined}
          />

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

          {isSelectType(attribute.inputType) && (
            <AttributeOptionsList
              attributeLocalId={attribute.localId}
              options={attribute.options}
              onAdd={onAddOption}
              onUpdate={onUpdateOption}
              onRemove={onRemoveOption}
              onMove={onMoveOption}
            />
          )}
        </Box>
      )}
    </CardContent>
  </Card>
);
