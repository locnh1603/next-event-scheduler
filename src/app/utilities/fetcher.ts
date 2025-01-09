// @ts-expect-error: EXPECTED FROM SWR EXAMPLE
const fetcher = (...args: never[]) => fetch(...args).then(res => res.json());
export default fetcher;
