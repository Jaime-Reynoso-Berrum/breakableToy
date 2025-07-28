
type MetricsFooterProps = {
    avgCompletioTime: string;
};

function MetricsFooter(props: MetricsFooterProps){
    return (
        <footer style = {{border: '1px solid black'}}>
            <p>Average Completion Time: {props.avgCompletioTime}</p>
        </footer>
    );
};

export default MetricsFooter;