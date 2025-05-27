import figlet from "figlet";
import picocolors from "picocolors";

type _PrintAsciiProps = {
  name: string;
  desc: string;
};

export const _printAscii = (props: _PrintAsciiProps) => {
  console.log(figlet.textSync(props.name));
  console.log(picocolors.italic(props.desc));
  console.log("\n");
};
