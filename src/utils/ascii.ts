import { PrintAsciiProps } from "@/types/general";
import figlet from "figlet";
import picocolors from "picocolors";

export const _printAscii = (props: PrintAsciiProps) => {
  console.log(figlet.textSync(props.name));
  console.log(picocolors.italic(props.desc));
  console.log("\n");
};
