type DisplayCart = "all" | "my";

export default function DisplayToggle({
  showMyCarts,
  handleShowMyCarts,
}: {
  showMyCarts: DisplayCart;
  handleShowMyCarts: (displayCart: DisplayCart) => void;
}) {
  return (
    <div className="flex justify-center my-4">
      <div className="inline-flex border rounded-full overflow-hidden">
        <div 
          className={`border-r px-8 py-4 cursor-pointer ${
            showMyCarts === "all" ? "text-blue-600" : "hover:text-blue-600"
          }`}
          onClick={() => handleShowMyCarts("all")}
        >
          All Carts
        </div>
        <div 
          className={`px-8 py-4 cursor-pointer ${
            showMyCarts === "my" ? "text-blue-600" : "hover:text-blue-600"
          }`}
          onClick={() => handleShowMyCarts("my")}
        >
          My Carts
        </div>
      </div>
    </div>
  )
};