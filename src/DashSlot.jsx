import { useDrop } from "react-dnd";
const style = {
	height: "504px",
	color: "white",
	textAlign: "center",
	margin: "24px 24px 24px 24px",
	border: "2px dashed gray",
};
export const DashSlot = ({ index, dashLetDropped }) => {
	const [{ canDrop, isOver }, drop] = useDrop(() => ({
		accept: "CARD",
		drop: (item) => dashLetDropped(item.index, index),
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	}));

	const isActive = canDrop && isOver;
	let backgroundColor = "transparent";
	if (isActive) {
		backgroundColor = "darkgray";
	}

	return (
		<div ref={drop} style={{ ...style, backgroundColor }}>
			{isActive ? "Release to drop" : ""}
		</div>
	);
};

export default DashSlot;
