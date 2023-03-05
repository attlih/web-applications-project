const formatDateTime = (date: string) => {
    // show date and time
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hour}:${minute}`;
}

const updateStates = (states: any, setStates: any) => {
    return (e: any) => {
        const { name, value } = e.target;
        setStates({ ...states, [name]: value });
    };
};


export {
    formatDateTime,
    updateStates,
};