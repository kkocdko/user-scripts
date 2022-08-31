const fs = require("fs");
const path = require("path");

const trans = (srcDir) => {
  fs.readdirSync(srcDir).forEach((fileName) => {
    const filePath = path.join(srcDir, fileName);
    if (fs.statSync(filePath).isFile()) {
      fs.writeFileSync(
        filePath,
        fs.readFileSync(filePath).toString().replaceAll("\r\n", "\n")
      );
    } else {
      trans(filePath);
    }
  });
};

trans(__dirname);
