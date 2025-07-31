
type FilterBarProps = {
    queryFilter: string;
    setQueryFilter: (query: string) => void;
    priorityFilter: number;
    setPriorityFilter: (priority: number) => void;
    completedFilter: boolean | null;
    setCompletedFilter: (completed: boolean | null) => void;
    onQueryFilter: () => void;
}

function FilterBar ({
    queryFilter,
    setQueryFilter,
    priorityFilter,
    setPriorityFilter,
    completedFilter,
    setCompletedFilter,
    onQueryFilter
}: FilterBarProps) {
    const handleCompletedChange = (event: React.ChangeEvent<HTMLSelectElement>)=> {
        const value = event.target.value;
        if (value === "true") setCompletedFilter(true);
        else if (value === "false") setCompletedFilter(false);
        else setCompletedFilter(null);
    }

    const handlePrioriytChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const number = parseInt(event.target.value, 10);
        setPriorityFilter(number);
    };

    return (
        <div style = {{
            display: 'felx',
            gap: '1rem',
            padding: '1rem',
            alignItems: 'center',
            backgroundColor: 'grey',
            border: '1px solid black'
        }}>
            <input
                type = 'text'
                placeholder = 'Search for items here'
                value = {queryFilter}
                onChange={(event) => setQueryFilter(event.target.value)}
            />

            <select value = {priorityFilter} onChange = {handlePrioriytChange}>
                <option value = {0}>All Priorities</option>
                <option value = {1}>High Priority</option>
                <option value = {2}>Medium Priority</option>
                <option value = {3}>Low Priority</option>
            </select>

            <select value = {String(completedFilter)} onChange = {handleCompletedChange}>
                <option value = 'null'>All Items</option>
                <option value = 'true'>All Completed Items</option>
                <option value = 'false'>All Uncompleted Items</option>
            </select>

            <button style = {{ border: '1px solid black', marginLeft: 10}} onClick = {onQueryFilter}>Search</button>
        </div>
    )

}

export default FilterBar;