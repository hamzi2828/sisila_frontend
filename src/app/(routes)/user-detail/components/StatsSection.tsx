import React from "react";
import { formatPrice } from "@/lib/formatPrice";

export interface StatsSectionProps {
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  joinedDate,
  totalOrders,
  totalSpent,
  loyaltyPoints,
}) => {
  return (
    <section className="px-4 sm:px-6 lg:px-8 xl:px-20 py-12 bg-gray-50 border-t border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-primary rounded-full flex items-center justify-center">
            <i className="fas fa-user text-white text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-black">Member Since</h3>
          <p className="text-gray-500">
            {new Date(joinedDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
            <i className="fas fa-shopping-bag text-blue-500 text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-black">{totalOrders} Orders</h3>
          <p className="text-gray-500">Total orders placed</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
            <i className="fas fa-rupee-sign text-green-500 text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-black">{formatPrice(totalSpent)}</h3>
          <p className="text-gray-500">Total amount spent</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-stone-100 rounded-full flex items-center justify-center">
            <i className="fas fa-truck text-stone-700 text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-black">Free Delivery</h3>
          <p className="text-gray-500">On orders over Rs 5,000</p>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
