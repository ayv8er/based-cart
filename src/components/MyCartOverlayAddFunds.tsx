import { useState } from "react";
import useBasedCart from "@/hooks/useBasedCart";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

export default function MyCartOverlayAddFunds({ address }: { address: string }) {
  const [showFundOptions, setShowFundOptions] = useState<boolean>(false);
  const [fundAmount, setFundAmount] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isAwaitingFundCart, setIsAwaitingFundCart] = useState<boolean>(false);
  const { approveUsdcAndFundCartAsync } = useBasedCart({ contractAddress: address });

  const handleAddMoreFunds = async () => {
    if (fundAmount.trim() === "") {
      setFormError("Amount cannot be empty");
      return;
    }
    if (isNaN(Number(fundAmount))) {
      setFormError("Amount must be a number");
      return;
    }
    if (Number(fundAmount) <= 0) {
      setFormError("Amount must be greater than 0");
      return;
    }
    try {
      setIsAwaitingFundCart(true);
      await approveUsdcAndFundCartAsync(Number(fundAmount));
      setShowFundOptions(false);
      setFundAmount("");
      setFormError(null);
      setIsAwaitingFundCart(false);
    } catch (error) {
      console.error('Error depositing more funds:', error);
      setIsAwaitingFundCart(false);
    }
  };

  return (
    <>
      <div 
        className="text-center border-b rounded-lg py-4 flex justify-around items-center hover:text-blue-600 cursor-pointer"
        onClick={() => setShowFundOptions(!showFundOptions)}
        >
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${showFundOptions ? "rotate-180" : ""}`} />
          Add Funds
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${showFundOptions ? "rotate-180" : ""}`} />
      </div>
      {showFundOptions && (
        <div>
          <div className="flex justify-center items-center w-full pb-2">
            <input
              className="text-black p-1 flex-grow"
              type="text" 
              placeholder="Amount"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              onFocus={() => setFormError(null)}
              disabled={isAwaitingFundCart}
              />
            <button 
              className={`border bg-black p-1 rounded-lg ${isAwaitingFundCart ? "cursor-not-allowed" : "hover:text-blue-600 cursor-pointer"}`}
              onClick={handleAddMoreFunds}
              disabled={isAwaitingFundCart}
              >
              Add Funds
            </button>
          </div>
          {formError && <p className="text-red-500 text-sm">{formError}</p>}
      </div>
      )}
    </>
  )
};