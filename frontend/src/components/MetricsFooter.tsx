
type MetricsFooterProps = {
    metrics: string[];
};

function MetricsFooter(props: MetricsFooterProps){
    const [totalAvg, highAvg, mediumAvg, lowAvg] = props.metrics;
    return (
        <footer style = {{border: '1px solid black'}}>
            <p>Average Total Completion Time: {totalAvg}</p>
            <p>Average High Completion Time: {highAvg}</p>
            <p>Average Medium Completion Time: {mediumAvg}</p>
            <p>Average Low Completion Time: {lowAvg}</p>

        </footer>
    );
};

export default MetricsFooter;