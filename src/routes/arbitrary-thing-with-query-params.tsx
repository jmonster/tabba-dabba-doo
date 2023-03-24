import { useEffect } from "react"
import { useQueryParam, NumberParam } from 'use-query-params';
import { Link } from "react-router-dom";

export default function Asdf({}) {
  const [num, setNum] = useQueryParam<number>('x', NumberParam);

  useEffect(() => {
    // when p is undefined, use 0
    // increment by 1 every 300ms
    const id = setInterval(() => setNum((p: number) => (p ?? 0) + 1), 300)
    return () => clearInterval(id)
  }, [])

  return (
    <div>
      <Link to="/a" style={{ padding: "1rem" }}>
        a
      </Link>
      <Link to="/b" style={{ padding: "1rem" }}>b</Link>
      <Link to="/c" style={{ padding: "1rem" }}>c</Link>
    </div>
  );
}
