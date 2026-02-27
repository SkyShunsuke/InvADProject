const ASSET_VERSION = "20260227m";

function assetPath(path) {
  return `${path}?v=${ASSET_VERSION}`;
}

const figures = {
  overview_1: {
    src: assetPath("/assets/figs/overview_1_hd.png"),
    fallback: assetPath("/assets/figs/overview_1.png"),
    alt: "InvAD methodology in DDPM trajectory view",
    caption:
      "Comparison of normal vs anomalous trajectories under DDPM-style noising dynamics.",
  },
  overview_2: {
    src: assetPath("/assets/figs/overview_2_hd.png"),
    fallback: assetPath("/assets/figs/overview_2.png"),
    alt: "InvAD methodology in PF-ODE trajectory view",
    caption:
      "Trajectory behavior under PF-ODE inversion where InvAD directly targets latent noising.",
  },
};

const methodFigure = document.getElementById("methodFigure");
const methodCaption = document.getElementById("methodCaption");
const switchButtons = document.querySelectorAll(".switch-btn");

for (const button of switchButtons) {
  button.addEventListener("click", () => {
    const key = button.dataset.figure;
    const figure = figures[key];
    if (!figure || !methodFigure || !methodCaption) {
      return;
    }

    methodFigure.dataset.fallbackSrc = figure.fallback;
    methodFigure.onerror = () => {
      methodFigure.onerror = null;
      methodFigure.src = figure.fallback;
    };
    methodFigure.src = figure.src;
    methodFigure.alt = figure.alt;
    methodCaption.textContent = figure.caption;

    for (const other of switchButtons) {
      other.classList.remove("is-active");
    }
    button.classList.add("is-active");
  });
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.14 }
  );

  for (const item of revealItems) {
    observer.observe(item);
  }
} else {
  for (const item of revealItems) {
    item.classList.add("visible");
  }
}

const allImages = document.querySelectorAll("img[data-fallback-src]");
for (const image of allImages) {
  image.addEventListener("error", () => {
    const fallback = image.dataset.fallbackSrc;
    if (!fallback) {
      return;
    }

    if (image.src !== new URL(fallback, window.location.href).href) {
      image.src = fallback;
    }
  });
}

const copyButton = document.getElementById("copyCitation");
const citation = document.getElementById("citationText");

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const temp = document.createElement("textarea");
  temp.value = text;
  temp.style.position = "fixed";
  temp.style.left = "-9999px";
  document.body.appendChild(temp);
  temp.focus();
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);
}

if (copyButton && citation) {
  copyButton.addEventListener("click", async () => {
    try {
      await copyText(citation.innerText.trim());
      copyButton.textContent = "Copied";
      setTimeout(() => {
        copyButton.textContent = "Copy BibTeX";
      }, 1200);
    } catch {
      copyButton.textContent = "Copy failed";
      setTimeout(() => {
        copyButton.textContent = "Copy BibTeX";
      }, 1200);
    }
  });
}

const yearNode = document.getElementById("currentYear");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

function makeSvgElement(tag, attrs = {}) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, String(value));
  }
  return node;
}

function appendChildren(parent, nodes) {
  for (const node of nodes) {
    parent.appendChild(node);
  }
}

const benchmarkData = {
  mvtec: {
    name: "MVTecAD",
    metricLabel: "Image-level AU-ROC (%)",
    metricShort: "Det. AU-ROC",
    points: [
      { method: "RD4AD", score: 94.6, fps: 4.8 },
      { method: "UniAD", score: 96.5, fps: 5.3 },
      { method: "DiAD", score: 97.2, fps: 0.1 },
      { method: "HVQ-Trans", score: 98.0, fps: 5.6 },
      { method: "OmiAD", score: 98.8, fps: 39.4 },
      { method: "InvAD", score: 99.0, fps: 88.1 },
    ],
  },
  visa: {
    name: "VisA",
    metricLabel: "Image-level AU-ROC (%)",
    metricShort: "Det. AU-ROC",
    points: [
      { method: "RD4AD", score: 92.4, fps: 4.9 },
      { method: "UniAD", score: 88.8, fps: 4.6 },
      { method: "DiAD", score: 86.8, fps: 0.1 },
      { method: "HVQ-Trans", score: 93.2, fps: 5.0 },
      { method: "OmiAD", score: 95.3, fps: 35.3 },
      { method: "InvAD", score: 96.9, fps: 74.1 },
    ],
  },
  mpdd: {
    name: "MPDD",
    metricLabel: "Image-level AU-ROC (%)",
    metricShort: "Det. AU-ROC",
    points: [
      { method: "RD4AD", score: 84.1, fps: 4.7 },
      { method: "UniAD", score: 82.2, fps: 5.8 },
      { method: "DiAD", score: 74.6, fps: 0.1 },
      { method: "HVQ-Trans", score: 86.5, fps: 6.2 },
      { method: "OmiAD", score: 93.7, fps: 49.8 },
      { method: "InvAD", score: 96.5, fps: 120.0 },
    ],
  },
  bmad: {
    name: "BMAD",
    metricLabel: "mAD",
    metricShort: "mAD",
    points: [
      { method: "PaDiM", score: 79.9, fps: 20.0 },
      { method: "CFlow", score: 77.0, fps: 15.0 },
      { method: "RD4AD", score: 84.2, fps: 20.0 },
      { method: "PatchCore", score: 86.4, fps: 20.0 },
      { method: "SimpleNet", score: 80.7, fps: 10.0 },
      { method: "InvAD", score: 87.2, fps: 88.0 },
    ],
  },
  realiad: {
    name: "Real-IAD",
    metricLabel: "I-AUROC (%)",
    metricShort: "I-AUROC",
    points: [
      { method: "PatchCore", score: 90.4, fps: 0.04 },
      { method: "PaDiM", score: 86.6, fps: 117.0 },
      { method: "SimpleNet", score: 91.7, fps: 10.0 },
      { method: "DeSTSeg", score: 89.2, fps: 110.0 },
      { method: "UniAD", score: 75.6, fps: 103.0 },
      { method: "DiAD", score: 86.6, fps: 11.0 },
      { method: "HVQ-Trans", score: 82.7, fps: 107.0 },
      { method: "InvAD", score: 92.3, fps: 148.0 },
    ],
  },
};

function niceStep(range, targetSteps) {
  const rough = range / targetSteps;
  if (rough <= 1) {
    return 1;
  }
  if (rough <= 2) {
    return 2;
  }
  if (rough <= 5) {
    return 5;
  }
  if (rough <= 10) {
    return 10;
  }
  return 20;
}

function makeTicks(min, max, targetSteps) {
  const step = niceStep(max - min, targetSteps);
  const first = Math.ceil(min / step) * step;
  const ticks = [];
  for (let v = first; v <= max; v += step) {
    ticks.push(v);
  }
  if (!ticks.includes(min)) {
    ticks.unshift(min);
  }
  if (!ticks.includes(max)) {
    ticks.push(max);
  }
  return ticks;
}

function drawBarComparisonChart(dataset) {
  const svg = document.getElementById("barComparisonChart");
  if (!svg) {
    return;
  }

  const data = dataset.points.map((point) => ({
    method: point.method,
    value: point.score,
  }));

  const width = 860;
  const height = 420;
  const margin = { top: 28, right: 24, bottom: 80, left: 62 };
  const chartW = width - margin.left - margin.right;
  const chartH = height - margin.top - margin.bottom;
  const minAuc = Math.min(...data.map((item) => item.value));
  const maxAuc = Math.max(...data.map((item) => item.value));
  const yMin = Math.max(70, Math.floor(minAuc - 2));
  const yMax = Math.min(100, Math.ceil(maxAuc + 1));
  const yTicks = makeTicks(yMin, yMax, 6);

  svg.innerHTML = "";

  const defs = makeSvgElement("defs");
  const invadGrad = makeSvgElement("linearGradient", {
    id: `invadBarGrad-${dataset.name}`,
    x1: "0%",
    y1: "0%",
    x2: "0%",
    y2: "100%",
  });
  appendChildren(invadGrad, [
    makeSvgElement("stop", { offset: "0%", "stop-color": "#00d2a6" }),
    makeSvgElement("stop", { offset: "100%", "stop-color": "#63d6ff" }),
  ]);
  defs.appendChild(invadGrad);
  svg.appendChild(defs);

  for (const tick of yTicks) {
    const y = margin.top + ((yMax - tick) / (yMax - yMin)) * chartH;
    svg.appendChild(
      makeSvgElement("line", {
        x1: margin.left,
        y1: y,
        x2: margin.left + chartW,
        y2: y,
        stroke: "rgba(161, 194, 212, 0.22)",
        "stroke-width": 1,
      })
    );

    const t = makeSvgElement("text", {
      x: margin.left - 10,
      y: y + 4,
      "text-anchor": "end",
      "font-family": "Sora, sans-serif",
      "font-size": "12",
      fill: "#a8c0ce",
    });
    t.textContent = String(tick);
    svg.appendChild(t);
  }

  const step = chartW / data.length;
  const barWidth = Math.min(72, step * 0.6);

  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    const x = margin.left + step * i + (step - barWidth) / 2;
    const y =
      margin.top + ((yMax - item.value) / (yMax - yMin)) * chartH;
    const h = margin.top + chartH - y;
    const fill =
      item.method === "InvAD"
        ? `url(#invadBarGrad-${dataset.name})`
        : "rgba(99, 214, 255, 0.58)";

    svg.appendChild(
      makeSvgElement("rect", {
        x,
        y,
        width: barWidth,
        height: h,
        rx: 8,
        fill,
        stroke:
          item.method === "InvAD"
            ? "rgba(0, 210, 166, 0.95)"
            : "rgba(99, 214, 255, 0.72)",
      })
    );

    const valueLabel = makeSvgElement("text", {
      x: x + barWidth / 2,
      y: y - 8,
      "text-anchor": "middle",
      "font-family": "Sora, sans-serif",
      "font-size": "12",
      "font-weight": item.method === "InvAD" ? "700" : "500",
      fill: item.method === "InvAD" ? "#7ef3d6" : "#d5eff8",
    });
    valueLabel.textContent = item.value.toFixed(1);
    svg.appendChild(valueLabel);

    const methodLabel = makeSvgElement("text", {
      x: x + barWidth / 2,
      y: margin.top + chartH + 24,
      "text-anchor": "middle",
      "font-family": "Sora, sans-serif",
      "font-size": "12",
      fill: item.method === "InvAD" ? "#00d2a6" : "#a8c0ce",
    });
    methodLabel.textContent = item.method;
    svg.appendChild(methodLabel);
  }

  const xAxis = makeSvgElement("line", {
    x1: margin.left,
    y1: margin.top + chartH,
    x2: margin.left + chartW,
    y2: margin.top + chartH,
    stroke: "rgba(161, 194, 212, 0.52)",
    "stroke-width": 1.2,
  });
  const yAxis = makeSvgElement("line", {
    x1: margin.left,
    y1: margin.top,
    x2: margin.left,
    y2: margin.top + chartH,
    stroke: "rgba(161, 194, 212, 0.52)",
    "stroke-width": 1.2,
  });

  appendChildren(svg, [xAxis, yAxis]);

  const yTitle = makeSvgElement("text", {
    x: 18,
    y: margin.top + chartH / 2,
    transform: `rotate(-90, 18, ${margin.top + chartH / 2})`,
    "text-anchor": "middle",
    "font-family": "Sora, sans-serif",
    "font-size": "12",
    fill: "#a8c0ce",
  });
  yTitle.textContent = dataset.metricLabel;
  svg.appendChild(yTitle);
}

function drawSpeedScatterChart(dataset) {
  const svg = document.getElementById("speedScatterChart");
  if (!svg) {
    return;
  }

  const data = dataset.points;

  const width = 860;
  const height = 420;
  const margin = { top: 28, right: 30, bottom: 58, left: 58 };
  const chartW = width - margin.left - margin.right;
  const chartH = height - margin.top - margin.bottom;
  const xMin = Math.max(70, Math.floor(Math.min(...data.map((item) => item.score)) - 1));
  const xMax = Math.min(100, Math.ceil(Math.max(...data.map((item) => item.score)) + 1));
  const yMin = 0;
  const yMax = Math.max(20, Math.ceil(Math.max(...data.map((item) => item.fps)) / 10) * 10 + 10);
  const xTicks = makeTicks(xMin, xMax, 6);
  const yTicks = makeTicks(yMin, yMax, 5);

  const xToPx = (x) =>
    margin.left + ((x - xMin) / (xMax - xMin)) * chartW;
  const yToPx = (y) =>
    margin.top + chartH - ((y - yMin) / (yMax - yMin)) * chartH;

  svg.innerHTML = "";

  for (const tick of xTicks) {
    const x = xToPx(tick);
    svg.appendChild(
      makeSvgElement("line", {
        x1: x,
        y1: margin.top,
        x2: x,
        y2: margin.top + chartH,
        stroke: "rgba(161, 194, 212, 0.18)",
        "stroke-width": 1,
      })
    );
    const label = makeSvgElement("text", {
      x,
      y: margin.top + chartH + 20,
      "text-anchor": "middle",
      "font-family": "Sora, sans-serif",
      "font-size": "12",
      fill: "#a8c0ce",
    });
    label.textContent = String(tick);
    svg.appendChild(label);
  }

  for (const tick of yTicks) {
    const y = yToPx(tick);
    svg.appendChild(
      makeSvgElement("line", {
        x1: margin.left,
        y1: y,
        x2: margin.left + chartW,
        y2: y,
        stroke: "rgba(161, 194, 212, 0.18)",
        "stroke-width": 1,
      })
    );
    const label = makeSvgElement("text", {
      x: margin.left - 10,
      y: y + 4,
      "text-anchor": "end",
      "font-family": "Sora, sans-serif",
      "font-size": "12",
      fill: "#a8c0ce",
    });
    label.textContent = String(tick);
    svg.appendChild(label);
  }

  const invadPoint = data.find((item) => item.method === "InvAD");
  if (invadPoint) {
    const trend = makeSvgElement("line", {
      x1: xToPx(xMin),
      y1: yToPx(yMin + 2),
      x2: xToPx(invadPoint.score),
      y2: yToPx(invadPoint.fps),
      stroke: "rgba(0, 210, 166, 0.28)",
      "stroke-dasharray": "8 6",
      "stroke-width": 2,
    });
    svg.appendChild(trend);
  }

  for (const point of data) {
    const x = xToPx(point.score);
    const y = yToPx(point.fps);
    const isInvad = point.method === "InvAD";
    const radius = isInvad ? 8 : 5.2;

    if (isInvad) {
      svg.appendChild(
        makeSvgElement("circle", {
          cx: x,
          cy: y,
          r: radius + 7,
          fill: "rgba(0, 210, 166, 0.22)",
        })
      );
    }

    const dot = makeSvgElement("circle", {
      cx: x,
      cy: y,
      r: radius,
      fill: isInvad ? "#00d2a6" : "#63d6ff",
      stroke: isInvad ? "#7ef3d6" : "rgba(223, 245, 255, 0.72)",
      "stroke-width": 1.5,
    });
    const title = makeSvgElement("title");
    title.textContent = `${point.method}: ${dataset.metricShort} ${point.score.toFixed(1)}, FPS ${point.fps.toFixed(1)}`;
    dot.appendChild(title);
    svg.appendChild(dot);

    const label = makeSvgElement("text", {
      x: x + (isInvad ? 12 : 8),
      y: y - (isInvad ? 10 : 8),
      "text-anchor": "start",
      "font-family": "Sora, sans-serif",
      "font-size": isInvad ? "13" : "11",
      "font-weight": isInvad ? "700" : "500",
      fill: isInvad ? "#7ef3d6" : "#cde8f4",
    });
    label.textContent = point.method;
    svg.appendChild(label);
  }

  const xAxis = makeSvgElement("line", {
    x1: margin.left,
    y1: margin.top + chartH,
    x2: margin.left + chartW,
    y2: margin.top + chartH,
    stroke: "rgba(161, 194, 212, 0.56)",
    "stroke-width": 1.2,
  });
  const yAxis = makeSvgElement("line", {
    x1: margin.left,
    y1: margin.top,
    x2: margin.left,
    y2: margin.top + chartH,
    stroke: "rgba(161, 194, 212, 0.56)",
    "stroke-width": 1.2,
  });
  appendChildren(svg, [xAxis, yAxis]);

  const xTitle = makeSvgElement("text", {
    x: margin.left + chartW / 2,
    y: height - 14,
    "text-anchor": "middle",
    "font-family": "Sora, sans-serif",
    "font-size": "12",
    fill: "#a8c0ce",
  });
  xTitle.textContent = dataset.metricLabel;
  svg.appendChild(xTitle);

  const yTitle = makeSvgElement("text", {
    x: 18,
    y: margin.top + chartH / 2,
    transform: `rotate(-90, 18, ${margin.top + chartH / 2})`,
    "text-anchor": "middle",
    "font-family": "Sora, sans-serif",
    "font-size": "12",
    fill: "#a8c0ce",
  });
  yTitle.textContent = "Frames Per Second (FPS)";
  svg.appendChild(yTitle);
}

function drawConventionalSpeedScatterChart() {
  const svg = document.getElementById("conventionalSpeedScatterChart");
  if (!svg) {
    return;
  }

  const data = [
    { method: "GLAD", auc: 99.3, fps: 0.2 },
    { method: "TransFusion", auc: 99.2, fps: 1.6 },
    { method: "OmiAD", auc: 98.8, fps: 39.4 },
    { method: "DeCoDiff", auc: 95.7, fps: 17.0 },
    { method: "MDM", auc: 91.9, fps: 2.2 },
    { method: "InvAD (Ours)", auc: 99.1, fps: 88.1 },
  ];

  const width = 860;
  const height = 420;
  const margin = { top: 28, right: 30, bottom: 58, left: 58 };
  const chartW = width - margin.left - margin.right;
  const chartH = height - margin.top - margin.bottom;
  const xMin = 91;
  const xMax = 100;
  const yMin = 0;
  const yMax = 95;
  const xTicks = [92, 93, 94, 95, 96, 97, 98, 99, 100];
  const yTicks = [0, 20, 40, 60, 80];

  const xToPx = (x) =>
    margin.left + ((x - xMin) / (xMax - xMin)) * chartW;
  const yToPx = (y) =>
    margin.top + chartH - ((y - yMin) / (yMax - yMin)) * chartH;

  svg.innerHTML = "";

  for (const tick of xTicks) {
    const x = xToPx(tick);
    svg.appendChild(
      makeSvgElement("line", {
        x1: x,
        y1: margin.top,
        x2: x,
        y2: margin.top + chartH,
        stroke: "rgba(161, 194, 212, 0.18)",
        "stroke-width": 1,
      })
    );
    const label = makeSvgElement("text", {
      x,
      y: margin.top + chartH + 20,
      "text-anchor": "middle",
      "font-family": "Sora, sans-serif",
      "font-size": "12",
      fill: "#a8c0ce",
    });
    label.textContent = String(tick);
    svg.appendChild(label);
  }

  for (const tick of yTicks) {
    const y = yToPx(tick);
    svg.appendChild(
      makeSvgElement("line", {
        x1: margin.left,
        y1: y,
        x2: margin.left + chartW,
        y2: y,
        stroke: "rgba(161, 194, 212, 0.18)",
        "stroke-width": 1,
      })
    );
    const label = makeSvgElement("text", {
      x: margin.left - 10,
      y: y + 4,
      "text-anchor": "end",
      "font-family": "Sora, sans-serif",
      "font-size": "12",
      fill: "#a8c0ce",
    });
    label.textContent = String(tick);
    svg.appendChild(label);
  }

  const labelOffsets = {
    GLAD: [8, -8],
    TransFusion: [8, 14],
    OmiAD: [8, -8],
    DeCoDiff: [8, 14],
    MDM: [8, -8],
    "InvAD (Ours)": [12, -10],
  };

  for (const point of data) {
    const x = xToPx(point.auc);
    const y = yToPx(point.fps);
    const isInvad = point.method === "InvAD (Ours)";
    const radius = isInvad ? 8 : 5.5;

    if (isInvad) {
      svg.appendChild(
        makeSvgElement("circle", {
          cx: x,
          cy: y,
          r: radius + 8,
          fill: "rgba(0, 210, 166, 0.22)",
        })
      );
    }

    const dot = makeSvgElement("circle", {
      cx: x,
      cy: y,
      r: radius,
      fill: isInvad ? "#00d2a6" : "#ff9b54",
      stroke: isInvad ? "#7ef3d6" : "#ffd7b8",
      "stroke-width": 1.5,
    });
    const title = makeSvgElement("title");
    title.textContent = `${point.method}: AU-ROC ${point.auc.toFixed(1)}, FPS ${point.fps.toFixed(1)}`;
    dot.appendChild(title);
    svg.appendChild(dot);

    const [dx, dy] = labelOffsets[point.method] || [8, -8];
    const label = makeSvgElement("text", {
      x: x + dx,
      y: y + dy,
      "text-anchor": "start",
      "font-family": "Sora, sans-serif",
      "font-size": isInvad ? "13" : "11",
      "font-weight": isInvad ? "700" : "500",
      fill: isInvad ? "#7ef3d6" : "#ffd7b8",
    });
    label.textContent = point.method;
    svg.appendChild(label);
  }

  const xAxis = makeSvgElement("line", {
    x1: margin.left,
    y1: margin.top + chartH,
    x2: margin.left + chartW,
    y2: margin.top + chartH,
    stroke: "rgba(161, 194, 212, 0.56)",
    "stroke-width": 1.2,
  });
  const yAxis = makeSvgElement("line", {
    x1: margin.left,
    y1: margin.top,
    x2: margin.left,
    y2: margin.top + chartH,
    stroke: "rgba(161, 194, 212, 0.56)",
    "stroke-width": 1.2,
  });
  appendChildren(svg, [xAxis, yAxis]);

  const xTitle = makeSvgElement("text", {
    x: margin.left + chartW / 2,
    y: height - 14,
    "text-anchor": "middle",
    "font-family": "Sora, sans-serif",
    "font-size": "12",
    fill: "#a8c0ce",
  });
  xTitle.textContent = "Image-level AU-ROC (%)";
  svg.appendChild(xTitle);

  const yTitle = makeSvgElement("text", {
    x: 18,
    y: margin.top + chartH / 2,
    transform: `rotate(-90, 18, ${margin.top + chartH / 2})`,
    "text-anchor": "middle",
    "font-family": "Sora, sans-serif",
    "font-size": "12",
    fill: "#a8c0ce",
  });
  yTitle.textContent = "Frames Per Second (FPS)";
  svg.appendChild(yTitle);
}

function drawGeneralizationChart() {
  const svg = document.getElementById("generalizationChart");
  if (!svg) {
    return;
  }

  const data = [
    { method: "DiAD", det: 97.2, loc: 96.8, fps: 0.1, ours: false },
    { method: "DiAD + InvAD", det: 98.2, loc: 97.5, fps: 88.1, ours: true },
    { method: "MDM", det: 91.9, loc: 94.8, fps: 2.2, ours: false },
    { method: "MDM + InvAD", det: 98.2, loc: 97.5, fps: 63.0, ours: true },
  ];

  const width = 860;
  const height = 420;
  const margin = { top: 34, right: 24, bottom: 64, left: 54 };
  const chartW = width - margin.left - margin.right;
  const chartH = height - margin.top - margin.bottom;

  const leftW = chartW * 0.58;
  const gapW = 28;
  const rightW = chartW - leftW - gapW;
  const leftX0 = margin.left;
  const rightX0 = margin.left + leftW + gapW;

  const aucMin = 90;
  const aucMax = 100;
  const fpsMin = 0;
  const fpsMax = 90;
  const aucTicks = [90, 92, 94, 96, 98, 100];
  const fpsTicks = [0, 20, 40, 60, 80];

  const yAuc = (v) => margin.top + chartH - ((v - aucMin) / (aucMax - aucMin)) * chartH;
  const yFps = (v) => margin.top + chartH - ((v - fpsMin) / (fpsMax - fpsMin)) * chartH;

  svg.innerHTML = "";

  for (const tick of aucTicks) {
    const y = yAuc(tick);
    svg.appendChild(
      makeSvgElement("line", {
        x1: leftX0,
        y1: y,
        x2: leftX0 + leftW,
        y2: y,
        stroke: "rgba(161, 194, 212, 0.2)",
        "stroke-width": 1,
      })
    );
    const label = makeSvgElement("text", {
      x: leftX0 - 8,
      y: y + 4,
      "text-anchor": "end",
      "font-family": "Sora, sans-serif",
      "font-size": "11.5",
      fill: "#a8c0ce",
    });
    label.textContent = String(tick);
    svg.appendChild(label);
  }

  for (const tick of fpsTicks) {
    const y = yFps(tick);
    svg.appendChild(
      makeSvgElement("line", {
        x1: rightX0,
        y1: y,
        x2: rightX0 + rightW,
        y2: y,
        stroke: "rgba(161, 194, 212, 0.2)",
        "stroke-width": 1,
      })
    );
    const label = makeSvgElement("text", {
      x: rightX0 - 8,
      y: y + 4,
      "text-anchor": "end",
      "font-family": "Sora, sans-serif",
      "font-size": "11.5",
      fill: "#a8c0ce",
    });
    label.textContent = String(tick);
    svg.appendChild(label);
  }

  appendChildren(svg, [
    makeSvgElement("line", {
      x1: leftX0,
      y1: margin.top + chartH,
      x2: leftX0 + leftW,
      y2: margin.top + chartH,
      stroke: "rgba(161, 194, 212, 0.56)",
      "stroke-width": 1.2,
    }),
    makeSvgElement("line", {
      x1: leftX0,
      y1: margin.top,
      x2: leftX0,
      y2: margin.top + chartH,
      stroke: "rgba(161, 194, 212, 0.56)",
      "stroke-width": 1.2,
    }),
    makeSvgElement("line", {
      x1: rightX0,
      y1: margin.top + chartH,
      x2: rightX0 + rightW,
      y2: margin.top + chartH,
      stroke: "rgba(161, 194, 212, 0.56)",
      "stroke-width": 1.2,
    }),
    makeSvgElement("line", {
      x1: rightX0,
      y1: margin.top,
      x2: rightX0,
      y2: margin.top + chartH,
      stroke: "rgba(161, 194, 212, 0.56)",
      "stroke-width": 1.2,
    }),
  ]);

  const leftGroupStep = leftW / data.length;
  const pairWidth = Math.min(68, leftGroupStep * 0.52);
  const singleBarWidth = pairWidth * 0.42;
  const rightGroupStep = rightW / data.length;
  const fpsBarWidth = Math.min(50, rightGroupStep * 0.46);

  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];

    const groupLeft = leftX0 + i * leftGroupStep + (leftGroupStep - pairWidth) / 2;
    const detX = groupLeft;
    const locX = groupLeft + pairWidth - singleBarWidth;
    const detY = yAuc(item.det);
    const locY = yAuc(item.loc);
    const detH = margin.top + chartH - detY;
    const locH = margin.top + chartH - locY;

    svg.appendChild(
      makeSvgElement("rect", {
        x: detX,
        y: detY,
        width: singleBarWidth,
        height: detH,
        rx: 5,
        fill: item.ours ? "rgba(99, 214, 255, 0.95)" : "rgba(99, 214, 255, 0.58)",
        stroke: item.ours ? "rgba(214, 246, 255, 0.95)" : "rgba(99, 214, 255, 0.7)",
      })
    );
    svg.appendChild(
      makeSvgElement("rect", {
        x: locX,
        y: locY,
        width: singleBarWidth,
        height: locH,
        rx: 5,
        fill: item.ours ? "rgba(255, 155, 84, 0.95)" : "rgba(255, 155, 84, 0.6)",
        stroke: item.ours ? "rgba(255, 223, 196, 0.95)" : "rgba(255, 155, 84, 0.7)",
      })
    );

    const fpsX = rightX0 + i * rightGroupStep + (rightGroupStep - fpsBarWidth) / 2;
    const fpsY = yFps(item.fps);
    const fpsH = margin.top + chartH - fpsY;
    svg.appendChild(
      makeSvgElement("rect", {
        x: fpsX,
        y: fpsY,
        width: fpsBarWidth,
        height: fpsH,
        rx: 6,
        fill: item.ours ? "rgba(0, 210, 166, 0.95)" : "rgba(139, 230, 221, 0.65)",
        stroke: item.ours ? "rgba(126, 243, 214, 0.95)" : "rgba(139, 230, 221, 0.7)",
      })
    );

    const methodLabelLeft = makeSvgElement("text", {
      x: groupLeft + pairWidth / 2,
      y: margin.top + chartH + 20,
      "text-anchor": "middle",
      "font-family": "Sora, sans-serif",
      "font-size": "10.8",
      fill: item.ours ? "#7ef3d6" : "#a8c0ce",
    });
    methodLabelLeft.textContent = item.method;
    svg.appendChild(methodLabelLeft);

    const methodLabelRight = makeSvgElement("text", {
      x: fpsX + fpsBarWidth / 2,
      y: margin.top + chartH + 20,
      "text-anchor": "middle",
      "font-family": "Sora, sans-serif",
      "font-size": "10.8",
      fill: item.ours ? "#7ef3d6" : "#a8c0ce",
    });
    methodLabelRight.textContent = item.method;
    svg.appendChild(methodLabelRight);
  }

  const leftTitle = makeSvgElement("text", {
    x: leftX0 + leftW / 2,
    y: 18,
    "text-anchor": "middle",
    "font-family": "Space Grotesk, sans-serif",
    "font-size": "13",
    fill: "#dff3fb",
  });
  leftTitle.textContent = "Detection/Localization AU-ROC";
  svg.appendChild(leftTitle);

  const rightTitle = makeSvgElement("text", {
    x: rightX0 + rightW / 2,
    y: 18,
    "text-anchor": "middle",
    "font-family": "Space Grotesk, sans-serif",
    "font-size": "13",
    fill: "#dff3fb",
  });
  rightTitle.textContent = "Inference Speed (FPS)";
  svg.appendChild(rightTitle);

  const legendItems = [
    { name: "Det. AU-ROC", color: "#63d6ff" },
    { name: "Loc. AU-ROC", color: "#ff9b54" },
    { name: "FPS", color: "#00d2a6" },
  ];
  let legendX = margin.left + 10;
  const legendY = 32;
  for (const item of legendItems) {
    svg.appendChild(
      makeSvgElement("rect", {
        x: legendX,
        y: legendY - 8,
        width: 12,
        height: 12,
        rx: 3,
        fill: item.color,
      })
    );
    const text = makeSvgElement("text", {
      x: legendX + 18,
      y: legendY + 2,
      "text-anchor": "start",
      "font-family": "Sora, sans-serif",
      "font-size": "11",
      fill: "#cfe8f3",
    });
    text.textContent = item.name;
    svg.appendChild(text);
    legendX += 110;
  }
}

function drawDiffusionArchAblationChart() {
  const svg = document.getElementById("diffusionArchAblationChart");
  if (!svg) {
    return;
  }

  const data = [
    { model: "MLP", det: 97.2, loc: 96.8, ours: false },
    { model: "UNet", det: 98.0, loc: 97.3, ours: false },
    { model: "DiT-base", det: 93.8, loc: 95.9, ours: false },
    { model: "DiT-gigant", det: 99.0, loc: 97.5, ours: true },
  ];

  const width = 860;
  const height = 420;
  const margin = { top: 38, right: 24, bottom: 78, left: 62 };
  const chartW = width - margin.left - margin.right;
  const chartH = height - margin.top - margin.bottom;
  const yMin = 92;
  const yMax = 100;
  const yTicks = [92, 94, 96, 98, 100];

  svg.innerHTML = "";

  for (const tick of yTicks) {
    const y = margin.top + ((yMax - tick) / (yMax - yMin)) * chartH;
    svg.appendChild(
      makeSvgElement("line", {
        x1: margin.left,
        y1: y,
        x2: margin.left + chartW,
        y2: y,
        stroke: "rgba(161, 194, 212, 0.22)",
        "stroke-width": 1,
      })
    );
    const label = makeSvgElement("text", {
      x: margin.left - 10,
      y: y + 4,
      "text-anchor": "end",
      "font-family": "Sora, sans-serif",
      "font-size": "12",
      fill: "#a8c0ce",
    });
    label.textContent = String(tick);
    svg.appendChild(label);
  }

  const step = chartW / data.length;
  const groupWidth = Math.min(120, step * 0.74);
  const barWidth = groupWidth * 0.4;

  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    const groupX = margin.left + step * i + (step - groupWidth) / 2;
    const detX = groupX;
    const locX = groupX + groupWidth - barWidth;

    const detY = margin.top + ((yMax - item.det) / (yMax - yMin)) * chartH;
    const locY = margin.top + ((yMax - item.loc) / (yMax - yMin)) * chartH;
    const detH = margin.top + chartH - detY;
    const locH = margin.top + chartH - locY;

    svg.appendChild(
      makeSvgElement("rect", {
        x: detX,
        y: detY,
        width: barWidth,
        height: detH,
        rx: 8,
        fill: item.ours ? "rgba(99, 214, 255, 0.95)" : "rgba(99, 214, 255, 0.58)",
        stroke: item.ours ? "rgba(214, 246, 255, 0.95)" : "rgba(99, 214, 255, 0.72)",
      })
    );

    svg.appendChild(
      makeSvgElement("rect", {
        x: locX,
        y: locY,
        width: barWidth,
        height: locH,
        rx: 8,
        fill: item.ours ? "rgba(255, 155, 84, 0.95)" : "rgba(255, 155, 84, 0.58)",
        stroke: item.ours ? "rgba(255, 223, 196, 0.95)" : "rgba(255, 155, 84, 0.72)",
      })
    );

    const detValue = makeSvgElement("text", {
      x: detX + barWidth / 2,
      y: detY - 8,
      "text-anchor": "middle",
      "font-family": "Sora, sans-serif",
      "font-size": "11.5",
      "font-weight": item.ours ? "700" : "500",
      fill: item.ours ? "#d8f6ff" : "#d5eff8",
    });
    detValue.textContent = item.det.toFixed(1);
    svg.appendChild(detValue);

    const locValue = makeSvgElement("text", {
      x: locX + barWidth / 2,
      y: locY - 8,
      "text-anchor": "middle",
      "font-family": "Sora, sans-serif",
      "font-size": "11.5",
      "font-weight": item.ours ? "700" : "500",
      fill: item.ours ? "#ffe9d3" : "#ffe1ca",
    });
    locValue.textContent = item.loc.toFixed(1);
    svg.appendChild(locValue);

    const setting = makeSvgElement("text", {
      x: groupX + groupWidth / 2,
      y: margin.top + chartH + 24,
      "text-anchor": "middle",
      "font-family": "Sora, sans-serif",
      "font-size": "12",
      fill: item.ours ? "#7ef3d6" : "#a8c0ce",
    });
    setting.textContent = item.model;
    svg.appendChild(setting);
  }

  appendChildren(svg, [
    makeSvgElement("line", {
      x1: margin.left,
      y1: margin.top + chartH,
      x2: margin.left + chartW,
      y2: margin.top + chartH,
      stroke: "rgba(161, 194, 212, 0.56)",
      "stroke-width": 1.2,
    }),
    makeSvgElement("line", {
      x1: margin.left,
      y1: margin.top,
      x2: margin.left,
      y2: margin.top + chartH,
      stroke: "rgba(161, 194, 212, 0.56)",
      "stroke-width": 1.2,
    }),
  ]);

  const yTitle = makeSvgElement("text", {
    x: 18,
    y: margin.top + chartH / 2,
    transform: `rotate(-90, 18, ${margin.top + chartH / 2})`,
    "text-anchor": "middle",
    "font-family": "Sora, sans-serif",
    "font-size": "12",
    fill: "#a8c0ce",
  });
  yTitle.textContent = "AU-ROC (%)";
  svg.appendChild(yTitle);

  const legendItems = [
    { name: "Det. AU-ROC", color: "#63d6ff" },
    { name: "Loc. AU-ROC", color: "#ff9b54" },
  ];
  let legendX = margin.left + 10;
  const legendY = 20;
  for (const item of legendItems) {
    svg.appendChild(
      makeSvgElement("rect", {
        x: legendX,
        y: legendY - 8,
        width: 12,
        height: 12,
        rx: 3,
        fill: item.color,
      })
    );
    const text = makeSvgElement("text", {
      x: legendX + 18,
      y: legendY + 2,
      "text-anchor": "start",
      "font-family": "Sora, sans-serif",
      "font-size": "11",
      fill: "#cfe8f3",
    });
    text.textContent = item.name;
    svg.appendChild(text);
    legendX += 120;
  }
}

function drawScoringAblationChart() {
  const svg = document.getElementById("scoringAblationChart");
  if (!svg) {
    return;
  }

  const steps = ["3", "5", "10", "50", "100", "1000"];
  const series = [
    { name: "NLL", color: "#63d6ff", values: [96.1, 95.2, 93.0, 89.7, 89.4, 89.1] },
    { name: "Diff", color: "#ff9b54", values: [98.4, 98.1, 95.8, 83.2, 82.2, 82.0] },
    { name: "NLL + Diff (Ours)", color: "#00d2a6", values: [99.0, 98.9, 98.4, 96.0, 95.7, 95.4] },
  ];

  const width = 860;
  const height = 420;
  const margin = { top: 38, right: 28, bottom: 64, left: 62 };
  const chartW = width - margin.left - margin.right;
  const chartH = height - margin.top - margin.bottom;
  const yMin = 80;
  const yMax = 100;
  const yTicks = [80, 84, 88, 92, 96, 100];

  const xAt = (index) =>
    margin.left + (index / (steps.length - 1)) * chartW;
  const yAt = (value) =>
    margin.top + chartH - ((value - yMin) / (yMax - yMin)) * chartH;

  svg.innerHTML = "";

  for (const tick of yTicks) {
    const y = yAt(tick);
    svg.appendChild(
      makeSvgElement("line", {
        x1: margin.left,
        y1: y,
        x2: margin.left + chartW,
        y2: y,
        stroke: "rgba(161, 194, 212, 0.22)",
        "stroke-width": 1,
      })
    );
    const label = makeSvgElement("text", {
      x: margin.left - 10,
      y: y + 4,
      "text-anchor": "end",
      "font-family": "Sora, sans-serif",
      "font-size": "12",
      fill: "#a8c0ce",
    });
    label.textContent = String(tick);
    svg.appendChild(label);
  }

  for (let i = 0; i < steps.length; i += 1) {
    const x = xAt(i);
    svg.appendChild(
      makeSvgElement("line", {
        x1: x,
        y1: margin.top,
        x2: x,
        y2: margin.top + chartH,
        stroke: "rgba(161, 194, 212, 0.15)",
        "stroke-width": 1,
      })
    );
    const label = makeSvgElement("text", {
      x,
      y: margin.top + chartH + 20,
      "text-anchor": "middle",
      "font-family": "Sora, sans-serif",
      "font-size": "12",
      fill: "#a8c0ce",
    });
    label.textContent = steps[i];
    svg.appendChild(label);
  }

  for (const line of series) {
    const points = line.values.map((value, i) => `${xAt(i)},${yAt(value)}`).join(" ");
    svg.appendChild(
      makeSvgElement("polyline", {
        points,
        fill: "none",
        stroke: line.color,
        "stroke-width": line.name.includes("Ours") ? 3.2 : 2.3,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      })
    );

    for (let i = 0; i < line.values.length; i += 1) {
      const cx = xAt(i);
      const cy = yAt(line.values[i]);
      svg.appendChild(
        makeSvgElement("circle", {
          cx,
          cy,
          r: line.name.includes("Ours") ? 4.8 : 3.8,
          fill: line.color,
          stroke: "rgba(4, 17, 24, 0.9)",
          "stroke-width": 1.2,
        })
      );
    }
  }

  appendChildren(svg, [
    makeSvgElement("line", {
      x1: margin.left,
      y1: margin.top + chartH,
      x2: margin.left + chartW,
      y2: margin.top + chartH,
      stroke: "rgba(161, 194, 212, 0.56)",
      "stroke-width": 1.2,
    }),
    makeSvgElement("line", {
      x1: margin.left,
      y1: margin.top,
      x2: margin.left,
      y2: margin.top + chartH,
      stroke: "rgba(161, 194, 212, 0.56)",
      "stroke-width": 1.2,
    }),
  ]);

  const xTitle = makeSvgElement("text", {
    x: margin.left + chartW / 2,
    y: height - 14,
    "text-anchor": "middle",
    "font-family": "Sora, sans-serif",
    "font-size": "12",
    fill: "#a8c0ce",
  });
  xTitle.textContent = "Total Diffusion Steps (S)";
  svg.appendChild(xTitle);

  const yTitle = makeSvgElement("text", {
    x: 18,
    y: margin.top + chartH / 2,
    transform: `rotate(-90, 18, ${margin.top + chartH / 2})`,
    "text-anchor": "middle",
    "font-family": "Sora, sans-serif",
    "font-size": "12",
    fill: "#a8c0ce",
  });
  yTitle.textContent = "Image-level AU-ROC (%)";
  svg.appendChild(yTitle);

  const legendStartX = margin.left + chartW - 188;
  let legendY = margin.top - 16;
  for (const line of series) {
    svg.appendChild(
      makeSvgElement("line", {
        x1: legendStartX,
        y1: legendY,
        x2: legendStartX + 24,
        y2: legendY,
        stroke: line.color,
        "stroke-width": line.name.includes("Ours") ? 3 : 2.2,
      })
    );
    const text = makeSvgElement("text", {
      x: legendStartX + 30,
      y: legendY + 4,
      "text-anchor": "start",
      "font-family": "Sora, sans-serif",
      "font-size": "11.5",
      fill: line.name.includes("Ours") ? "#7ef3d6" : "#cde8f4",
    });
    text.textContent = line.name;
    svg.appendChild(text);
    legendY += 18;
  }
}

function updateChartTitles(dataset) {
  const barTitle = document.getElementById("barChartTitle");
  if (barTitle) {
    barTitle.textContent = `Method Comparison (${dataset.name}, ${dataset.metricShort})`;
  }

  const scatterTitle = document.getElementById("scatterChartTitle");
  if (scatterTitle) {
    scatterTitle.textContent = `Speed-Accuracy Trade-off (${dataset.name})`;
  }
}

const benchmarkButtons = document.querySelectorAll(".benchmark-btn");
let currentBenchmark = "mvtec";

function setBenchmark(key) {
  const dataset = benchmarkData[key];
  if (!dataset) {
    return;
  }

  currentBenchmark = key;
  drawBarComparisonChart(dataset);
  drawSpeedScatterChart(dataset);
  updateChartTitles(dataset);

  for (const button of benchmarkButtons) {
    button.classList.toggle("is-active", button.dataset.benchmark === key);
  }
}

for (const button of benchmarkButtons) {
  button.addEventListener("click", () => {
    const key = button.dataset.benchmark;
    if (key && key !== currentBenchmark) {
      setBenchmark(key);
    }
  });
}

setBenchmark(currentBenchmark);
drawConventionalSpeedScatterChart();
drawDiffusionArchAblationChart();
drawScoringAblationChart();
drawGeneralizationChart();
