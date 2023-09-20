import React, { useEffect, useState } from 'react'
import { useAtom } from "jotai";
import { controller } from "./App"


function ScrollingBackground() {
	const [scrollY, setscrollY] = useState(0);
	const [scrollHeight, setScrollHeight] = useState(0)
	const [coordXY, setCoordXY] = useState({ x: 0, y: 0 })
	const [jotaiTest, setJotaiTest] = useAtom(controller)

	useEffect(() => {
		const handleMouseMove = event => {
			setCoordXY({
				x: event.clientX,
				y: event.clientY
			})
			setJotaiTest(event.clientY)

		}
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('scroll', handleMouseMove);
		const sH = document.documentElement.scrollHeight
		const sY = window.scrollY
		setScrollHeight(sH)
		setscrollY(sY)
		console.log(`jodai scroll ${jotaiTest}`)
		
	})


	const dummyList = Array.from({ length: 1000 }).map((_, idx) => `Item ${idx + 1}`);

	return (
		<div id={"panel"} style={{ height: '100vh', paddingTop: "800px" }}>
			<h1>ScrollY: {scrollY}</h1>
			<h1>scrollHeight: {scrollY}</h1>
			<h1>XY: {coordXY.x},{coordXY.y}</h1>
			<ul>
				{dummyList.map(item => (
					<li key={item}>{item}</li>
				))}
			</ul>

		</div>
	)
}



export default ScrollingBackground;

