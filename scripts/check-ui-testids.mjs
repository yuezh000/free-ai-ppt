import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const roots = ["app", "components"];
const files = [];

function collect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) collect(target);
    else if (entry.isFile() && target.endsWith(".tsx")) files.push(target);
  }
}

for (const root of roots) collect(root);

const missing = [];
let buttonCount = 0;
for (const file of files) {
  const source = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const visit = (node) => {
    if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText(source) === "button") {
      buttonCount += 1;
      const tagged = node.attributes.properties.some(
        (attribute) => ts.isJsxAttribute(attribute) && attribute.name.getText(source) === "data-testid" && Boolean(attribute.initializer),
      );
      if (!tagged) {
        const { line, character } = source.getLineAndCharacterOfPosition(node.getStart(source));
        missing.push(`${file}:${line + 1}:${character + 1}`);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

if (missing.length) {
  console.error(`Buttons missing data-testid:\n${missing.join("\n")}`);
  process.exit(1);
}

console.log(`UI tag check passed: ${buttonCount} buttons in ${files.length} TSX files.`);
