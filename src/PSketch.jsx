import React, { useEffect, useId, useState } from "react";

import Sketch from "react-p5";
import P5 from "p5";
import { useAtom } from "jotai";
import { controller } from "./App";

let x = 50;
let y = 50;

export default (props) => {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [windowHeight, setWindowHeight] = useState(window.innerHeight);
	const setup = (p5, canvasParentRef) => {
		setWindowWidth(p5.windowWidth);
		setWindowHeight(p5.windowHeight);
		p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(
			canvasParentRef,
		);
		p5.frameRate(60);
	};

	const [jotaiTest, setJotaiTest] = useAtom(controller);

	const dpi = 1000;
	const wscale = windowWidth / dpi;
	const hscale = windowHeight / dpi;

	const xt = linspace(-1, 1, dpi);
	const epsilon = Math.floor(jotaiTest / 100) / 10;
	console.log("epi", epsilon);

	console.time("cal");
	const yt = xt.map((x) => {
		// const x2 = x * x
		// const x3 = x * x2
		// const x5 = x3 * x2
		// const x7 = x5 * x2
		// const p = (429*x7 - 693*x5 + 315*x3 - 35*x)
		// return (1/16) * p
		return (1 / 8) * (63 * x ** 5 - 70 * x ** 3 + 15 * x);
	});
	const differences = computeDifferences(yt, epsilon);
	console.timeEnd("cal");

	const draw = (p5) => {
		const backgroundColor = p5.color(255, 204, 0);

		p5.background(backgroundColor);
		// p5.ellipse(props.x, props.y, 70, 50);
		p5.strokeWeight(10);

		// console.time("draw");
		// p5.beginShape(p5.POINTS);
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
				p5.stroke(Math.max(10, i/10));

				p5.line(sequences[k][0] * wscale, ih, sequences[k][1] * wscale, ih);
			}
		}

		// p5.endShape();
		// console.timeEnd("draw");
	};

	return <Sketch className={"sketch"} setup={setup} draw={draw} />;
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

	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			result[i][j] = Math.abs(y[i] - y[j]) < epsilon;
		}
	}

	return result;
}
