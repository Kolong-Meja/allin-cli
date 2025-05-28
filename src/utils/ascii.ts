import figlet from "figlet";
import picocolors from "picocolors";
import chalk from "chalk";

type _PrintAsciiProps = {
  name: string;
  desc: string;
};

export const _printAscii = (props: _PrintAsciiProps) => {
  console.log(chalk.bold.green(figlet.textSync(props.name, "3D-ASCII")));
  console.log(picocolors.italic(props.desc));
  console.log("\n");
};
