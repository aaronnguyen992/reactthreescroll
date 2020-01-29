import React, { useState, useRef, useEffect } from "react";
import lerp from 'lerp';
import * as THREE from 'three';
import state from './store';
import { Canvas, extend, useThree, useFrame } from 'react-three-fiber';

const offsetContext = createContext(0);

const Block = ({ children, offset, factor, ...props }) => {
	const ref = useRef();
	const { offset:parentOffset, sectionHeight } = useBlock();
	offset = offset !== undefined ? offset : parentOffset;

	useFrame(() => {
		const curY = ref.current.position.y;
		const curTop = state.top.current;
		ref.current.position.y = lerp(curY, (curTop / state.zoom)*factor, 0.1)
	});

	return (
		<offsetContext.Provider value ={offset}>
			<group {...props} position={[0, -sectionHeight * offset * factor, 0]}>
				<group ref={ref}>
					{children}
				</group>
			</group>
		</offsetContext.Provider>
	)
};

const useBlock = () => {
	const { viewport } = useThree();
	const offset = useContext(offsetContext);
	const canvasWidth = viewport.width / zoom;
	const canvasHeight = viewport.height / zoom; 
	const sectionHeight = canvasWidth * ((pages - 1)/(sections - 1))

	return {offset, canvasWidth, canvasHeight, sectionHeight};
}

const App = () => {
	const scrollArea = useRef();
	const onScroll = e => (state.top.current = e.target.scrollTop);
	useEffect(() => void onScroll({ target: scrollArea.current }), []);
	return (
		<div>
			<Canvas orthographic>
			<Block offset={2} factor={1.5}>
				<Content>
					<Block factor={-0.5}>
						<SubContent />
					</Block>
				</Content>
			</Block>
			</Canvas>
			<div ref={scrollArea} onScroll={onScroll}>
				<div style={{ height: `${state.pages * 100}vh` }} />
			</div>
		</div>
	);
};

ReactDOM.render(<App />, document.getElementById("root"))
