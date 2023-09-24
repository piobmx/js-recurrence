import React, { useEffect, useId, useState } from "react";

import Sketch from "react-p5";
import P5 from "p5";
import { useAtom } from "jotai";
import { controller } from "./App";

export default (props) => {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [windowHeight, setWindowHeight] = useState(window.innerHeight);
	const [jotaiTest, setJotaiTest] = useAtom(controller);

	const [polyN, setPolyN] = useState("1");
	const [polyStep, setPolyStep] = useState(0);
	const [poly, setPoly] = useState(() => polynomials[polyN]);
	let canvas;

	const setup = (p5, canvasParentRef) => {
		setWindowWidth(p5.windowWidth);
		setWindowHeight(p5.windowHeight);
		canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(
			canvasParentRef,
		);
		canvas.style("z-index", "-1");

		p5.frameRate(60);
	};

	const mouseClicked = () => {
		const ranks = ["1", "2", "3", "4", "5", "6", "7"];
		const newStep = (polyStep == ranks.length - 1) ? 0 : polyStep + 1;
		const r = ranks[newStep];

		setPolyN(r);
		setPoly(() => polynomials[r]);
		setPolyStep(newStep);
	};

	const draw = (p5) => {
		p5.clear();
		const dpi = Math.floor(windowHeight - p5.mouseX);
		// const dpi = 600;
		const wscale = windowWidth / dpi;
		const hscale = windowHeight / dpi;

		// const xt = linspace(-1, 1, dpi);
		const xt = linspace(0, 1, dpi);
		const epsilonBase = Math.abs(p5.mouseY - windowHeight / 2) /
			(windowHeight / 2);
		const epsilon = epsilonBase ** (4);
		// const epsilon = (Math.pow(10, epsilonBase) - 1 ) / 10

		// console.time("cal");

		const yt = xt.map((x) => {
			return poly(x);
		});
		const differences = computeDifferences(yt, epsilon);
		// console.timeEnd("cal");
		const backgroundColor = p5.color(134, 124, 112, 0);
		const lineColor = p5.color(111, 124, 243, 0);

		p5.background(backgroundColor);
		// p5.ellipse(props.x, props.y, 70, 50);
		p5.strokeWeight(4);

		// p5.strokeJoin(p5.ROUND);
		// p5.noStroke()
		// p5.strokeCap(p5.ROUND);

		// console.time("draw");
		// p5.beginShape();

		for (let i = 0; i < differences.length; i++) {
			let dl = differences[i];
			let dll = dl.length;

			let sequences = [];
			let startIndex = null;

			let ih = i * hscale;
			for (let j = 0; j < dll; j++) {
				if (dl[j] && startIndex === null) {
					startIndex = j;
				} else if (!dl[j] && startIndex !== null) {
					sequences.push([startIndex, j - 1]);
					startIndex = null;
				}
			}
			if (startIndex !== null) {
				sequences.push([startIndex, dl.length - 1]);
			}

			for (let k = 0; k < sequences.length; k++) {
				// if (k < 100) {
				// 	p5.stroke(123);
				// 	p5.curveVertex(sequences[k][0] * wscale, ih);
				// 	p5.curveVertex(sequences[k][1] * wscale, ih);
				// }
				p5.stroke(256 - i * (232 / dpi));
				const lineWidth = sequences[k][1] - sequences[k][0];
				if (lineWidth > 1) {
					p5.line(
						sequences[k][0] * wscale,
						ih,
						sequences[k][1] * wscale,
						ih,
					);
				}
			}
		}

		// p5.endShape();

		// console.timeEnd("draw");
	};

	return (
		<Sketch
			className={"sketch"}
			setup={setup}
			draw={draw}
			mouseClicked={mouseClicked}
		/>
	);
};

const pfive = (props) => {
	const sketch = (p5) => {
		p5.setup = () => {
			p5.createCanvas(props.width, props.height);
		};
		p5.draw = () => {
			p5.line(0, 0, 400, 400);
		};
	};

	const p5 = new P5(sketch);
	return {
		cleanup: p5.remove,
	};
};

export const WorkingDemonstration = () => {
	const id = useId();

	useEffect(() => {
		const { cleanup } = pfive({
			width: 400,
			height: 400,
		});

		return cleanup;
	}, []);

	return <div id={id}></div>;
};

function linspace(start, end, n) {
	if (n === undefined) n = Math.max(Math.round(end - start) + 1, 1);
	if (n < 2) {
		return n === 1 ? [start] : [];
	}

	const arr = Array(n);
	n--;

	for (let i = 0; i <= n; i++) {
		arr[i] = (i * end + (n - i) * start) / n;
	}

	return arr;
}

function computeDifferences(y, epsilon) {
	const n = y.length;
	const result = Array.from({ length: n }, () => Array(n).fill(false));

	console.time("dif");
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			result[i][j] = Math.abs(y[i] - y[j]) < epsilon;
		}
	}
	console.timeEnd("dif");

	return result;
}

const pi = Math.PI;
const sin = Math.sin;
const polynomials = {
	"1": function (x) {
		const N = 12; // number of points
		const a = .1; // amplitude
		const b = 10; // periods
		const k = 3; // number of members of series
		const c = (4 * a) / (pi);
		let sum = 0;
		for (let n = 0; n < k; n++) {
			let p = sin((2 * n - 1) * (2 * b * pi) / N * x);
			let q = 2 * n - 1;
			sum = sum + p / q;
		}
		return sum * c;
	},
	"2": function (x) {
		// return (1 / 2) * (3 * x ** 2 - 1);
		const N = 1;
		const a = 1;
		const p = 25;
		const b = sin(p * pi * ((x - 0.5 * N) / N));
		const c = p * pi * ((x - 0.5 * N) / N);
		return a * b / c;
	},
	"3": function (x) {
		return (1 / 2) * (5 * x ** 3 - 3 * x);
	},
	"4": function (x) {
		return (1 / 8) * (35 * x ** 4 - 30 * x ** 2 + 3);
	},
	"5": function (x) {
		return (1 / 8) * (63 * x ** 5 - 70 * x ** 3 + 15 * x);
	},
	"6": function (x) {
		return (1 / 16) * (231 * x ** 6 - 315 * x ** 4 + 105 * x ** 2 - 5);
	},
	"7": function (x) {
		const x2 = x * x;
		const x3 = x * x2;
		const x5 = x3 * x2;
		const x7 = x5 * x2;
		return (1 / 16) * (429 * x7 - 693 * x5 + 315 * x3 - 35 * x);
	},
};
