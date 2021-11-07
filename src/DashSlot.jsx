import { useDrop } from "react-dnd";
const style = {
	height: "480px",
	color: "white",
	textAlign: "center",
	margin: "24px 24px 24px 24px",
	border: "2px dashed gray",
};
export const DashSlot = () => {
	const [{ canDrop, isOver }, drop] = useDrop(() => ({
		accept: "CARD",
		drop: () => ({ name: "DropTarget" }),
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
		<div ref={drop} role={"DropTarget"} style={{ ...style, backgroundColor }}>
			{isActive ? "Release to drop" : ""}
		</div>
	);
};

export default DashSlot;
