export default function AllCartOverlayItems({ items }: { items: string[] }) {
  return (
    <div className="flex-1 overflow-y-auto p-2">
      <ul className="grid grid-cols-2 gap-4">
          {items.map((item, index) => (
            <li key={index} className="flex justify-between items-center p-2 rounded-md bg-gray-100 text-black">
              <p>{item}</p>
            </li>
          ))}
      </ul>
    </div>
  )
};