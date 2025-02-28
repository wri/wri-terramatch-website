import React, { Component, createRef } from "react";

let Quill: any = null;

if (typeof window !== "undefined") {
  Quill = require("quill").default;
  require("quill/dist/quill.snow.css");
}

interface QuillEditorProps {
  value?: string;
  onChange?: (content: string) => void;
}

class QuillEditor extends Component<QuillEditorProps> {
  private editorRef = createRef<HTMLDivElement>();
  private quill?: any;

  componentDidMount() {
    if (typeof window !== "undefined" && Quill) {
      this.initializeQuill();
    }
  }

  componentDidUpdate(prevProps: QuillEditorProps) {
    if (this.quill && prevProps.value !== this.props.value) {
      this.quill.root.innerHTML = this.props.value || "";
    }
  }

  initializeQuill() {
    if (this.editorRef.current && !this.quill && Quill) {
      this.quill = new Quill(this.editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            ["link", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["video"]
          ]
        },
        bounds: document.body
      });

      this.quill.on("text-change", () => {
        if (this.quill && this.props.onChange) {
          this.props.onChange(this.quill.root.innerHTML);
        }
      });

      if (this.props.value) {
        this.quill.root.innerHTML = this.props.value;
      }
    }
  }

  render() {
    return (
      <div
        className="quill-editor-container relative"
        style={{
          position: "relative",
          zIndex: 1
        }}
      >
        <style>{`
          .quill-editor-container .ql-tooltip {
            z-index: 1000;
            position: absolute;
            left: 0 !important;
          }
          
          .quill-editor-container .ql-editor {
            min-height: 200px;
          }
          
          .quill-editor-container .ql-container {
            position: relative;
          }
          
          .quill-editor-container .ql-toolbar {
            position: sticky;
            top: 0;
            z-index: 2;
            background: white;
          }
        `}</style>
        <div ref={this.editorRef}></div>
      </div>
    );
  }
}

export default QuillEditor;
