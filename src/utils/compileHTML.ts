import { readFileSync } from "fs";
import { join } from "path";
import * as handlebars from "handlebars";

interface ITemplateCert {
  id: string;
  name: string;
  grade: string;
  date: string;
  medal: string;
}

export default async (data: Omit<ITemplateCert, "medal">): Promise<string> => {
  const { id, name, grade, date } = data;

  console.log("==> compileHTML received data");

  const filePath = join(process.cwd(), "src", "templates", "certificate.hbs");
  const medalPath = join(process.cwd(), "src", "templates", "selo.png");

  console.log("==> compileHTML will be reading file");

  const medal = readFileSync(medalPath, "base64");
  const html = readFileSync(filePath, "utf8");

  const variables: ITemplateCert = { id, name, grade, date, medal };

  console.log("==> compileHTML will be to complie HTML");

  const content = handlebars.compile(html)(variables);

  console.log("==> compileHTML return HTML");

  return content;
};
