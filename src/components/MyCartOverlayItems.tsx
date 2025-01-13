import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import useBasedCart from "@/hooks/useBasedCart";

export default function MyCartOverlayItems({ items, address }: { items: string[], address: string }) {
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const { deleteItemsAsync } = useBasedCart({ contractAddress: address });

  const handleCheckBoxChange = (item: string) => {
    setCheckedItems(prev => {
      if (prev.includes(item)) {
        return prev.filter(i => i !== item);
      } else {
        return [...prev, item];
      }
    })
  };

  const handleDeleteItems = async () => {
    console.log('checked items',checkedItems);
    try {
      await deleteItemsAsync(checkedItems);
      setCheckedItems([]);
      setDeleteConfirmation(false);
    } catch (error) {
      console.error('Error deleting items:', error);
    }
  };
  return (
    <>
      <div className="flex-1 overflow-y-auto p-2">
        <ul className="grid grid-cols-2 gap-4">
            {items.map((item, index) => (
              <li key={index} className="flex justify-between items-center p-2 rounded-md bg-gray-100 text-black">
                <p>{item}</p>
                <input 
                  className="mr-2"
                  type="checkbox"
                  checked={checkedItems.includes(item)}
                  onChange={() => handleCheckBoxChange(item)}
                />
              </li>
            ))}
        </ul>
      </div>

      <div className="flex justify-around items-center border-b pb-4 rounded-lg">
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${checkedItems.length > 0 ? "rotate-180" : ""}`} />
          <p className="invisible">Delete Items</p>
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${checkedItems.length > 0 ? "rotate-180" : ""}`} />
      </div>

      {checkedItems.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="text-sm mb-4 flex items-center space-x-2">
            <span>Deleted items cannot be added again, are you sure?</span>
            <input
              type="checkbox"
              checked={deleteConfirmation}
              onChange={() => setDeleteConfirmation(!deleteConfirmation)}
            />
          </div>
          <button
            className={`
              border p-2 rounded-lg w-full 
              ${deleteConfirmation ? 'hover:text-blue-600 cursor-pointer' : 'cursor-not-allowed text-gray-400'}
            `}
            onClick={handleDeleteItems}
            disabled={!deleteConfirmation}
          >
            Delete Selected Items
          </button>
        </div>
      )}
    </>
  )
};