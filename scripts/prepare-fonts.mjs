import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
await fs.mkdir("public/fonts",{recursive:true});
const ranges={cyrillic:"U+0401,U+0410-044F,U+0451,U+2116",latin:"U+0020-007E,U+00A0,U+00A9,U+00AB,U+00BB,U+2000-201F,U+2022,U+2026,U+202F,U+20BD,U+2212"};
for(const family of ["inter","roboto-condensed"]){
  const base=`node_modules/@fontsource-variable/${family}`;
  for(const [sub,chars] of Object.entries(ranges)){
    const named=`${family}-${sub}-wght-normal.woff2`;
    execFileSync(process.env.FONTTOOLS_PYTHON||"python3",["-m","fontTools.subset",`${base}/files/${named}`,`--unicodes=${chars}`,"--flavor=woff2","--layout-features=kern,liga,locl,tnum,pnum",`--output-file=public/fonts/${named}`],{stdio:"inherit"});
  }
  await fs.copyFile(`${base}/LICENSE`,`public/fonts/${family}-LICENSE.txt`);
}

