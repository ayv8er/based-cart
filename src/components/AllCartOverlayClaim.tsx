import { useState } from "react";
import useBasedCart from "@/hooks/useBasedCart";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useAccount } from "wagmi";

function getClaimState({
  isCompleted,
  fulfiller,
  account,
}: {
  isCompleted: boolean;
  fulfiller: string | null;
  account?: `0x${string}`;
}) {
  let message = "";
  let buttonText = "Confirm Claim";
  let buttonDisabled = false;

  if (isCompleted) {
    message = "This cart is completed and cannot be claimed.";
    buttonDisabled = true;
  } else if (!isCompleted && fulfiller === null) {
    message = "You may claim this cart. If you cannot fulfill the order, please forfeit your claim to give others a chance to claim it.";
  } else if (!isCompleted && fulfiller?.toLowerCase() === account?.toLowerCase()) {
    message = "You have already claimed this cart. If you cannot fulfill this order, please forfeit your claim to give someone else a chance.";
    buttonText = "Forfeit Claim";
  } else if (!isCompleted && fulfiller && fulfiller.toLowerCase() !== account?.toLowerCase()) {
    message =
      "This cart cannot be claimed. It is being fulfilled by " +
      fulfiller.slice(0, 5) +
      "..." +
      fulfiller.slice(-4) +
      ".";
    buttonDisabled = true;
  }

  return {
    message,
    buttonText,
    buttonDisabled,
  };
}

interface AllCartOverlayClaimProps {
  address: string;
  fulfiller: string | null;
  isCompleted: boolean;
}

export default function AllCartOverlayClaim({
  address,
  fulfiller,
  isCompleted
}: AllCartOverlayClaimProps) {
  const [showClaimOptions, setShowClaimOptions] = useState<boolean>(false);
  const { claimDeliveryAsync, forfeitDeliveryAsync } = useBasedCart({ contractAddress: address });
  const [isAwaitingClaim, setIsAwaitingClaim] = useState<boolean>(false);
  const { address: account } = useAccount();

  const { message, buttonText, buttonDisabled } =
    getClaimState({ isCompleted, fulfiller, account });

    const handleButtonClick = async () => {
      try {
        setIsAwaitingClaim(true);
        if (buttonText === "Forfeit Claim") {
          await forfeitDeliveryAsync();
        } else if (buttonText === "Confirm Claim") {
          await claimDeliveryAsync();
        }
        setIsAwaitingClaim(false);
        setShowClaimOptions(false);
      } catch (error) {
        console.error("Error with claim/forfeit:", error);
        setIsAwaitingClaim(false);
        setShowClaimOptions(false);
      }
    };
  
  return (
    <>
      <div 
        className="text-center border-b rounded-lg py-4 flex justify-around items-center hover:text-blue-600 cursor-pointer"
        onClick={() => setShowClaimOptions(!showClaimOptions)}
      >
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${showClaimOptions ? "rotate-180" : ""}`} />
          Claim Cart
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${showClaimOptions ? "rotate-180" : ""}`} />
      </div>
      {showClaimOptions && (
        <div className="flex flex-col items-center">
          <div className="text-sm mb-2">
            {message}
          </div>
          <button
            className={`
              border p-2 rounded-lg w-full 
              ${isAwaitingClaim ? "cursor-not-allowed" : "hover:text-blue-600 cursor-pointer"}
            `}
            onClick={handleButtonClick}
            disabled={buttonDisabled || isAwaitingClaim}
          >
            {isAwaitingClaim ? "Processing..." : buttonText}
          </button>
        </div>
      )}
    </>
  )
};