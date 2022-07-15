import { createCanvas, loadImage } from "canvas";
import { inputParts, projectPath } from "./config.js";
import fs from "fs";

const width = 1000;
const height = 1000;

const imagesLimit = process.argv[2];
const imagesSize = Number(imagesLimit) || 10;

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

var combinationList = [];

const createUniqueCombination = () => {
  let randomCombination = [];
  inputParts().forEach((part) => {
    let randomNumber = Math.floor(Math.random() * part.parts.length);
    randomCombination.push(randomNumber);
  });
  const newCombination = randomCombination.join("");
  if (combinationList.find((i) => i.join("") === newCombination))
    return createUniqueCombination();
  return randomCombination;
};

const getImageDetails = (image) =>
  inputParts().map((inputPart, index) => {
    let selectedPart = inputPart.parts[image[index]];
    return {
      path: inputPart.path,
      position: inputPart.position,
      size: inputPart.size,
      selectedPart,
    };
  });

const loadImagePart = async (part) =>
  new Promise(async (resolve) => {
    const image = await loadImage(`${part.path}${part.selectedPart.name}`);
    resolve({ part, image });
  });

const saveImage = (name) => {
  fs.writeFileSync(
    projectPath + `/output/${name}.png`,
    canvas.toBuffer("image/png")
  );
};

const startImageGenerator = async () => {
  let counter = 1;
  while (counter <= imagesSize) {
    let newCombination = createUniqueCombination();
    let images = getImageDetails(newCombination);
    let loadedParts = [];

    images.forEach((image) => {
      loadedParts.push(loadImagePart(image));
    });

    await Promise.all(loadedParts).then((partsList) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillRect(0, 0, width, height);

      partsList.forEach((parts) => {
        ctx.drawImage(
          parts.image,
          parts.part.position.x,
          parts.part.position.y,
          parts.part.size.width,
          parts.part.size.height
        );
      });

      saveImage(counter);
      console.log(
        `\nImage ${counter} generated \nCombination: ${newCombination}`
      );
    });
    combinationList.push(newCombination);
    counter += 1;
  }
  console.log("");
};

startImageGenerator();
