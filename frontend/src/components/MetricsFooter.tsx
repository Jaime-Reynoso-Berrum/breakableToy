
type MetricsFooterProps = {
    metrics: string[];
};

function MetricsFooter({ metrics }: MetricsFooterProps){

    const totalAvg = metrics[0] || "N/A";
    const highAvg = metrics[1] || "N/A";
    const mediumAvg = metrics[2] || "N/A";
    const lowAvg = metrics[3] || "N/A";

    return (
        <footer
            style = {{
                position:'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                borderTop: '1px solid black',
                gap: '2rem',
                padding: '1rem',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'center',
                background: 'lightgray'
            }}
        >
            <div style={{ flex: 1, padding: '0 20px'}}>
                <strong> Average time to finish tasks:</strong>
                <div>{totalAvg}</div>
            </div>
            <div style={{ flex: 1, padding: '0 20px'}}>
                <strong>Average time to finish tasks by priority:</strong>
                <div>High: {highAvg}</div>
                <div>Medium: {mediumAvg}</div>
                <div>Low: {lowAvg}</div>
            </div>

        </footer>
    );
};

export default MetricsFooter;