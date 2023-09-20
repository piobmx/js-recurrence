import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Sketch, { WorkingDemonstration } from "./PSketch";
import ScrollingBackground from "./ScrollingBackground";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";

export const controller = atom(0);

function App() {
	const [count, setCount] = useState(0);
	const [jotaiTest, setJodaiTest] = useAtom(controller);

	let ellisPosition = {
		x: 100,
		y: jotaiTest,
	};
	// useEffect(() => {
	// 	console.log(`jotai: ${jotaiTest}`);
	// }, []);

	return (
		<>
			<Sketch {...ellisPosition} />
			<ScrollingBackground />
			{/* <WorkingDemonstration height={200} width={400} /> */}
		</>
	);
}

export default App;
