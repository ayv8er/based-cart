import { useState } from "react";
import useBasedCart from "@/hooks/useBasedCart";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

function getCloseState({
  isCompleted,
  fulfiller,
}: {
  isCompleted: boolean;
  fulfiller: string | null;
}) {
  let message = "";
  let buttonText = "I understand";
  let buttonDisabled = false;

  if (isCompleted) {
    message = "This cart is completed and cannot be closed.";
    buttonDisabled = true;
  } else if (!isCompleted && fulfiller === null) {
    message = "Closing this cart will return all funds and delete the cart.";
    buttonText = "I understand";
  } else if (!isCompleted && fulfiller) {
    message =
      "Closing this cart will transfer the balance to " +
      fulfiller.slice(0, 5) +
      "..." +
      fulfiller.slice(-4) +
      ". I understand this means I am confirming delivery. ";
    buttonText = "Cart Delivered";
  }

  return {
    message,
    buttonText,
    buttonDisabled,
  };
}

interface MyCartOverlayCloseProps {
  address: string;
  onClose: () => void;
  fulfiller: string | null;
  isCompleted: boolean;
}

export default function MyCartOverlayClose({ 
  address, 
  onClose, 
  fulfiller, 
  isCompleted 
}: MyCartOverlayCloseProps) {
  const [acknowledged, setAcknowledged] = useState<boolean>(false);
  const [showCloseOptions, setShowCloseOptions] = useState<boolean>(false);
  const [isAwaitingCloseCart, setIsAwaitingCloseCart] = useState<boolean>(false);
  const { withdrawAndDestroyAsync, closeSuccessDeliveryAsync } = useBasedCart({ contractAddress: address });

  const {
    message,
    buttonText,
    buttonDisabled,
  } = getCloseState({
    isCompleted,
    fulfiller,
  });

  const handleCloseCart = async () => {
    try {
      setIsAwaitingCloseCart(true);
      if (buttonText === "Cart Delivered") {
        await closeSuccessDeliveryAsync();
      } else {
        await withdrawAndDestroyAsync();
      }
      setIsAwaitingCloseCart(false);
      onClose();
    } catch (error) {
      console.error('Error withdrawing and destroying cart:', error);
      setIsAwaitingCloseCart(false);
    }
  };

  return (
    <>
      <div 
        className="text-center border-b rounded-lg py-4 flex justify-around items-center hover:text-blue-600 cursor-pointer"
        onClick={() => setShowCloseOptions(!showCloseOptions)}
      >
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${showCloseOptions ? "rotate-180" : ""}`} />
          Close Cart
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${showCloseOptions ? "rotate-180" : ""}`} />
      </div>
      {showCloseOptions && (
        <div className="flex flex-col items-center">
          <div className="text-sm mb-4 flex items-center space-x-2">
            <span>{message}</span>
            <input
              type="checkbox"
              className="mr-2"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              disabled={isAwaitingCloseCart}
            />
          </div>
          <button
            className={`
              border p-2 rounded-lg w-full 
              ${buttonDisabled || !acknowledged ? "cursor-not-allowed text-gray-400" : "cursor-pointer"}
            `}
            onClick={handleCloseCart}
            disabled={buttonDisabled || !acknowledged || isAwaitingCloseCart}
          >
            {isAwaitingCloseCart ? "Closing cart..." : buttonText}
          </button>
        </div>
      )}
    </>
  )
};