export default function TicketFilters({ filters, setFilters }) {
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <input
        name="from"
        placeholder="From"
        value={filters.from}
        onChange={handleChange}
        className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3"
      />

      <input
        name="to"
        placeholder="To"
        value={filters.to}
        onChange={handleChange}
        className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3"
      />

      <select
        name="transportType"
        value={filters.transportType}
        onChange={handleChange}
        className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3"
      >
        <option value="">All Transport</option>
        <option value="Bus">Bus</option>
        <option value="Train">Train</option>
        <option value="Flight">Flight</option>
      </select>

      <select
        name="sort"
        value={filters.sort}
        onChange={handleChange}
        className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3"
      >
        <option value="">Sort By Price</option>
        <option value="asc">Low → High</option>
        <option value="desc">High → Low</option>
      </select>
    </div>
  );
}