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

      const videoHandler = () => {
        const range = this.quill.getSelection();
        const value = prompt("Please enter the YouTube video URL:");

        if (value) {
          let videoId = "";
          const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
          const match = value.match(regExp);

          if (match && match[2].length === 11) {
            videoId = match[2];
            this.quill.insertEmbed(range.index, "video", `https://www.youtube.com/embed/${videoId}`);
          } else {
            this.quill.insertEmbed(range.index, "video", value);
          }

          this.quill.setSelection(range.index + 1);
        }
      };

      const toolbar = this.quill.getModule("toolbar");
      toolbar.addHandler("video", videoHandler);
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
          
          /* Updated responsive CSS for video embeds */
          .quill-editor-container .ql-editor iframe,
          .quill-editor-container .ql-editor .ql-video {
            width: 100% !important;
            aspect-ratio: 16/9 !important;
            max-width: 100% !important;
            height: auto !important;
          }
          
          @supports not (aspect-ratio: 16/9) {
            .quill-editor-container .ql-editor iframe,
            .quill-editor-container .ql-editor .ql-video {
              height: 0 !important;
              padding-bottom: 56.25% !important;
              position: relative !important;
            }
            
            .quill-editor-container .ql-editor iframe,
            .quill-editor-container .ql-editor .ql-video iframe {
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              width: 100% !important;
              height: 100% !important;
            }
          }
          
          @media (min-width: 1500px) {
            .quill-editor-container .ql-editor iframe,
            .quill-editor-container .ql-editor .ql-video {
              max-width: 75% !important;
              margin: 0 auto !important;
              display: block !important;
            }
          }
        `}</style>
        <div ref={this.editorRef}></div>
      </div>
    );
  }
}

export default QuillEditor;
