import * as fs from "node:fs";
import {PNG} from "pngjs";

const data = fs.readFileSync('in.png');
const png = PNG.sync.read(data);

const colorToNumberMap: Record<string, number> = {};
const numberToColorMap: string[] = [];
const mappedImage: number[][] = [];

for (let y = 0; y < png.height; y++) {
  mappedImage[y] = [];
  for (let x = 0; x < png.width; x++) {
    const idx = (png.width * y + x) << 2;

    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];

    const key = `${r},${g},${b}`;
    let number = colorToNumberMap[key];
    if (number == null) {
      number = numberToColorMap.length;
      numberToColorMap.push(key);
      colorToNumberMap[key] = number;
    }

    mappedImage[y]![x] = number;
  }
}

const csv = mappedImage.map((row)=>row.join(',')).join("\n");
fs.writeFileSync('out.csv', csv);
console.log(numberToColorMap.reduce((prev, cur, idx) => ({
  ...prev,
  [idx]: cur,
}), {}));
