import "quill/dist/quill.snow.css";

import Quill from "quill";
import React, { Component, createRef } from "react";

interface QuillEditorProps {
  value?: string;
  onChange?: (content: string) => void;
}

class QuillEditor extends Component<QuillEditorProps> {
  private editorRef = createRef<HTMLDivElement>();
  private quill?: Quill;

  componentDidMount() {
    this.initializeQuill();
  }

  componentDidUpdate(prevProps: QuillEditorProps) {
    if (prevProps.value !== this.props.value && this.quill) {
      this.quill.root.innerHTML = this.props.value || "";
    }
  }

  initializeQuill() {
    if (this.editorRef.current && !this.quill) {
      this.quill = new Quill(this.editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            ["link", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["video"] // Add video button
          ],
          videoResize: {}
        }
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
      <div className="quill-editor-container">
        <div ref={this.editorRef} style={{ minHeight: "200px" }}></div>
      </div>
    );
  }
}

export default QuillEditor;
