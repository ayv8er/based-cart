interface CartProps {
  address: string;
  name: string;
  items: string[];
  isCompleted: boolean;
  funds: string;
  fulfiller: string | null;
  owner: string;
  onClick: () => void;
}

export default function Cart({ 
  name,
  isCompleted,
  funds,
  fulfiller,
  owner,
  onClick,
}: CartProps) {

  const statusColor = isCompleted
    ? "bg-red-500"
    : fulfiller === null
      ? "bg-green-500"
      : "bg-yellow-500";

  const cartOwner = owner.slice(0, 5) + "..." + owner.slice(-4);
  
  return (
    <div 
      className="w-full px-4 py-4 border rounded-lg flex items-center justify-between hover:text-blue-600 cursor-pointer"
      onClick={onClick}
    >
      <div className={`w-4 h-4 rounded-full ${statusColor}`}></div>
      <p className="text-center flex-1">{name} for {cartOwner}</p>
      <p className="text-left">${funds}</p>
    </div>
  )
};