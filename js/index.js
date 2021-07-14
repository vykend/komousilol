import { claims, generators } from "./data.js";

const splitText = (text, maxLineLength) => {
  const result = [];
  while (text.length > maxLineLength) {
    let pos = text.substring(0, maxLineLength).lastIndexOf(" ");
    pos = pos <= 0 ? maxLineLength : pos;
    result.push(text.substring(0, pos));
    let i = text.indexOf(" ", pos) + 1;
    if (i < pos || i > pos + maxLineLength) i = pos;
    text = text.substring(i);
  }
  result.push(text);
  return result;
};

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const canvas = document.getElementById("picture");
const ctx = canvas.getContext("2d");

const unrolledGenerators = generators.flatMap(({ url, weight }) => Array(weight).fill(url));

const initImage = async (customText) => {
  const loadLogo = () => {
    const logo = new Image();
    logo.src = "public/logo_kscm.png";
    logo.addEventListener("load", () => {
      ctx.drawImage(logo, 0, 411);
      const linkSave = document.getElementById("save");
      linkSave.setAttribute("download", "KomunistiKampan.png");
      setTimeout(() => {
        linkSave.setAttribute("href", canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
      }, 500);
    });
  };

  const imageData = await fetch(pickRandom(unrolledGenerators));
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = imageData.url;
  image.addEventListener("load", () => {
    ctx.drawImage(image, 0, 0);
    loadLogo();
    const unsplitText = customText ?? pickRandom(claims);
    const lines = splitText(unsplitText, 20);
    const fontSize = lines.length < 5 ? 40 : 30;
    ctx.font = `bold ${fontSize}px Arial`;
    lines.forEach((line, index) => {
      const x = 740;
      const y = 30;
      const padding = 15;
      const lineHeight = padding + fontSize;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x - (ctx.measureText(line).width), (y + (index * lineHeight)), ctx.measureText(line).width + 2 * padding, lineHeight);
      ctx.textBaseline = "top";
      ctx.fillStyle = "black";
      ctx.fillText(line, x - (ctx.measureText(line).width) + padding, y + padding/2 + (index * lineHeight));
    });
  });
};

const buttonRandom = document.getElementById("randomize");
buttonRandom.onclick = () => initImage();

const inputCustom = document.getElementById("customText");
const buttonCustom = document.getElementById("submitCustomText");
buttonCustom.onclick = () => {
  if (inputCustom.value) {
    initImage(inputCustom.value);
  }
};

//initFont();
initImage();
