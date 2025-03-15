const Controls = () => {
    const sendCommand = (command) => {
        fetch(`http://localhost:5000/move?cmd=${command}`);
    };

    return (
        <div>
            <h2>Manual Controls</h2>
            <button onClick={() => sendCommand("left")}>← Move Left</button>
            <button onClick={() => sendCommand("right")}>→ Move Right</button>
            <button onClick={() => sendCommand("up")}>↑ Move Up</button>
            <button onClick={() => sendCommand("down")}>↓ Move Down</button>
        </div>
    );
};

export default Controls;