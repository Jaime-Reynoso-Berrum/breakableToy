
type FilterBarProps = {
    queryFilter: string;
    setQueryFilter: (query: string) => void;
    priorityFilter: number;
    setPriorityFilter: (priority: number) => void;
    completedFilter: 0 | 1 | 2;
    setCompletedFilter: (completed: 0 | 1 | 2) => void;
    onFilterChange: () => void;
}

function FilterBar ({
    queryFilter,
    setQueryFilter,
    priorityFilter,
    setPriorityFilter,
    completedFilter,
    setCompletedFilter,
    onFilterChange
}: FilterBarProps) {
    const handleCompletedChange = (event: React.ChangeEvent<HTMLSelectElement>)=> {
        const value = Number(event.target.value);
        if (value == 0 || value == 1 || value == 2) {
            setCompletedFilter(value);
        }
    }

    const handlePrioriytChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPriorityFilter(Number(event.target.value));
    };

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQueryFilter(event.target.value);
    }

    const handleQuerySearch = () => {
        onFilterChange()
    }

    return (
        <div style = {{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1rem',
            alignItems: 'flex-start',
            backgroundColor: 'grey',
            border: '1px solid black'

        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
                maxWidth: '600px',
                margin: '0 auto'
            }}>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                    <input
                        type = 'text'
                        placeholder = 'Search for items here'
                        value = {queryFilter}
                        onChange={handleQueryChange}
                        style={{flex: 1, minWidth: '400px'}}
                    />
                    <button style = {{ border: '1px solid black', marginLeft: 10}} onClick = {handleQuerySearch}>Search</button>
               </div>


                <select value = {priorityFilter} onChange = {handlePrioriytChange}style={{
                    width: '100%',
                    fontSize: '1.1rem',
                    padding: '8ppx 12px',
                }}>
                    <option value = {0}>All Priorities</option>
                    <option value = {1}>High Priority</option>
                    <option value = {2}>Medium Priority</option>
                    <option value = {3}>Low Priority</option>
                </select>

                <select value = {completedFilter} onChange = {handleCompletedChange}
                    style={{
                        width: '100%',
                        fontSize: '1.1rem',
                        padding: '8ppx 12px',
                }}>
                    <option value = {0}>All Items</option>
                    <option value = {1}>All Completed Items</option>
                    <option value = {2}>All Uncompleted Items</option>
                </select>
            </div>

        </div>
    )

}

export default FilterBar;