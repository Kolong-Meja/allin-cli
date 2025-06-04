import figlet from "figlet";
import picocolors from "picocolors";
import gradient from "gradient-string";

type _PrintAsciiProps = {
  name: string;
  desc: string;
};

export const _printAscii = (props: _PrintAsciiProps): void => {
  const _natureGradient = gradient(["#B771E5", "#81E7AF", "#FF9100"]);
  console.log(_natureGradient(figlet.textSync(props.name, "3D-ASCII")));
  console.log(picocolors.italic(props.desc));
};
