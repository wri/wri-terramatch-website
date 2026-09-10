import {
  Add as AddIcon,
  ArrowCircleDown as ArrowCircleDownIcon,
  ArrowCircleUp as ArrowCircleUpIcon,
  RemoveCircleOutline as RemoveCircleOutlineIcon
} from "@mui/icons-material";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import type { FC } from "react";

import { CircularIconButton } from "./CircularIconButton";
import { LocalOption } from "./types";

const OPTION_INPUT_PLACEHOLDER = "Option label";

type AttributeOptionsListProps = {
  attributeLocalId: string;
  options: LocalOption[];
  onAdd: (attributeLocalId: string) => void;
  onUpdate: (attributeLocalId: string, optionLocalId: string, label: string) => void;
  onRemove: (attributeLocalId: string, optionLocalId: string) => void;
  onMove: (attributeLocalId: string, optionLocalId: string, direction: -1 | 1) => void;
};

export const AttributeOptionsList: FC<AttributeOptionsListProps> = ({
  attributeLocalId,
  options,
  onAdd,
  onUpdate,
  onRemove,
  onMove
}) => (
  <Box>
    <Typography variant="subtitle2" className="mb-2">
      Options
    </Typography>
    {options.length === 0 && (
      <Typography variant="body2" color="text.secondary">
        No options yet. Add at least one option.
      </Typography>
    )}
    <Stack spacing={1.5}>
      {options.map((option, optionIndex) => (
        <Stack key={option.localId} direction="row" alignItems="center" spacing={1}>
          <TextField
            size="small"
            label={OPTION_INPUT_PLACEHOLDER}
            placeholder={OPTION_INPUT_PLACEHOLDER}
            value={option.label}
            onChange={event => onUpdate(attributeLocalId, option.localId, event.target.value)}
            fullWidth
            error={option.label.trim() === ""}
          />
          <CircularIconButton
            onClick={() => onMove(attributeLocalId, option.localId, -1)}
            disabled={optionIndex === 0}
            ariaLabel="Move option up"
          >
            <ArrowCircleUpIcon fontSize="small" />
          </CircularIconButton>
          <CircularIconButton
            onClick={() => onMove(attributeLocalId, option.localId, 1)}
            disabled={optionIndex === options.length - 1}
            ariaLabel="Move option down"
          >
            <ArrowCircleDownIcon fontSize="small" />
          </CircularIconButton>
          <CircularIconButton
            onClick={() => onRemove(attributeLocalId, option.localId)}
            color="warning"
            ariaLabel="Remove option"
          >
            <RemoveCircleOutlineIcon fontSize="small" />
          </CircularIconButton>
        </Stack>
      ))}
    </Stack>
    <Button startIcon={<AddIcon />} onClick={() => onAdd(attributeLocalId)} className="mt-2">
      Add Option
    </Button>
  </Box>
);
