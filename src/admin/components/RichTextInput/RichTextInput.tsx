import { Remove } from "@mui/icons-material";
import { styled, ToggleButton } from "@mui/material";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import {
  AlignmentButtons,
  DefaultEditorOptions,
  LinkButtons,
  ListButtons,
  RichTextInput as _RichTextInput,
  RichTextInputProps as RaRichTextInputProps,
  RichTextInputToolbar,
  useTiptapEditor
} from "ra-input-rich-text";

import { LevelSelect } from "@/admin/components/RichTextInput/LevelSelect";

export const MyEditorOptions = {
  ...DefaultEditorOptions,
  injectCSS: true,
  extensions: [...(DefaultEditorOptions?.extensions || []), HorizontalRule]
};

interface RichTextInputProps extends RaRichTextInputProps, RichTextToolbarProps {
  height?: string;
}

export const RichTextInput = ({ height = "300px", ...props }: RichTextInputProps) => (
  <StyledRichTextInput
    {...props}
    toolbar={<RichTextToolbar {...props} />}
    editorOptions={MyEditorOptions}
    sx={{ ".ProseMirror": { minHeight: height } }}
  />
);

interface RichTextToolbarProps {
  disableLevelSelect?: boolean;
  disableAlignmentSelect?: boolean;
  disableListSelect?: boolean;
  disableLinkSelect?: boolean;
  disableHorizontalLine?: boolean;
}

const RichTextToolbar = ({
  disableLevelSelect,
  disableAlignmentSelect,
  disableListSelect,
  disableHorizontalLine,
  disableLinkSelect
}: RichTextToolbarProps) => {
  const editor = useTiptapEditor();

  return (
    <RichTextInputToolbar size="large">
      {!disableLevelSelect && <LevelSelect levels={[1, 2]} />}
      {!disableAlignmentSelect && <AlignmentButtons />}
      {!disableListSelect && <ListButtons />}
      {!disableLinkSelect && <LinkButtons />}
      {!disableHorizontalLine && (
        <ToggleButton
          aria-label="Add an horizontal rule"
          title="Add an horizontal rule"
          value="left"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          selected={editor && editor.isActive("horizontalRule")}
        >
          <Remove fontSize="inherit" />
        </ToggleButton>
      )}
    </RichTextInputToolbar>
  );
};

const StyledRichTextInput = styled(_RichTextInput)({
  "&, &>span, .RaRichTextInputToolbar-root": {
    width: "100%"
  },
  ".ProseMirror": {
    backgroundColor: "white !important",
    padding: "2rem !important",
    h1: {
      fontSize: "2.25rem",
      fontWeight: "700",
      fontStyle: "normal",
      marginBottom: "0.25rem",
      textTransform: "uppercase"
    },
    hr: {
      margin: "2rem 0",
      color: "#E3E3E3"
    },
    h2: {
      fontSize: "1.25rem",
      fontWeight: "700",
      fontStyle: "normal",
      marginBottom: "1rem"
    },
    p: {
      fontSize: "1rem",
      fontWeight: "300",
      fontStyle: "normal"
    },
    a: {
      color: "#27A9E0",
      TextDecoration: "underline"
    },
    ul: {
      li: {
        display: "flex",
        gap: "0.5rem",

        ":before": {
          content: '"●"',
          fontSize: "1.5rem",
          color: "#8CC63F",
          lineHeight: 1
        },
        ":not(:last-child)": {
          marginBottom: "0.75rem"
        }
      }
    },
    "ol > li": {
      listStyle: "decimal",
      marginLeft: "0.75rem",
      ":not(:last-child)": {
        marginBottom: "0.75rem"
      }
    }
  }
});
