import { downloadFileBlob } from "@/utils";

export class CSVGenerator {
  private csvRows: string[] = [];

  pushRow(cells: (string | number | undefined)[]) {
    this.csvRows.push(cells.map(cell => (!cell ? "" : `"${cell}"`)).join(","));
  }

  getCSVText() {
    return this.csvRows.join("\r\n");
  }

  download(fileName: string) {
    downloadFileBlob(new Blob([this.getCSVText()], { type: "text/csv" }), fileName);
  }
}
