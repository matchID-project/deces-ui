export const validColumns = [
    'lastName',
    'legalName',
    'sex',
    'birthDate',
    'birthCity',
    'birthDepartment',
    'birthCountry',
    'deathDate',
    'deathCity',
    'deathDepartment',
    'deathCountry',
    'lastSeenAliveDate'
];

export const getJobsData = async (accessToken) => {
    const headers = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }
    let response = await fetch('__BACKEND_PROXY_PATH__/queue/jobs', headers);
    const list = (await response.json()).jobs || [];
    return list
}

export const getJobsFilteredData = async (accessToken) => {
    const list = await getJobsData(accessToken);
    const tmpJobs = [];
    list.forEach(j => {
        const delay = (
            (j.finishedOn ? j.finishedOn : Math.floor(Date.now()))
            - j.processedOn
        ) / 1000;
        const progress = j.status && j.status === "completed" ?
            "100" : j.progress && j.progress.percentage ?
                Math.round(j.progress.percentage) : 0
        tmpJobs.push({
            rows: j.data.totalRows,
            id: j.id,
            user: j.data && j.data.user,
            date: j.timestamp,
            status: j.status,
            waiting_time: j.processedOn && (j.processedOn - j.timestamp) / 1000,
            processing_time: delay,
            columns: validColumns.filter(c => j.data && j.data[c]),
            processing_rate: j.processedOn && Math.floor((progress / 100) * (j.data.totalRows / delay)),
            finishedOnTime: j.finishedOn ? dateTostr(new Date(j.finishedOn)) : 'job en cours',
            deletionTime: j.finishedOn ? dateTostr(new Date(j.finishedOn + (j.data.tmpfilePersistence || 3600000))) : 'job en cours',
            link: j.finishedOn && (Date.now() < new Date(j.finishedOn + (j.data.tmpfilePersistence || 3600000))) ? `/link?job=${j.data.randomKey}` : undefined,
            progress: progress
        })});
    return tmpJobs.sort((a,b) => (b.date - a.date)).map(j => {
        j.date= dateTostr(new Date(j.date));
        return j;
    });
}


export const getJobData = async (accessToken, linkJob) => {
    const jobs = await getJobsData(accessToken);
    return jobs.find(j => j.data && j.data.randomKey && j.data.randomKey === linkJob);
}

const dateTostr = (_date) => {
    const pad = (num) => num.toString().padStart(2, '0');
    return `${_date.getFullYear()}-${pad(_date.getMonth() + 1)}-${pad(_date.getDate())} ${pad(_date.getHours())}:${pad(_date.getMinutes())}`;
}