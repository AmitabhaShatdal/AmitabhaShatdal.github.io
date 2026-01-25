
import React from 'react';
import { SheetRow, FieldMapping, CardType } from '../../bulletinboardTypes';
import LeaseCard from './cards/LeaseCard';
import StudentCard from './cards/StudentCard';
import MerchSaleCard from './cards/MerchSaleCard';
import MerchWantedCard from './cards/MerchWantedCard';
import CarpoolCard from './cards/CarpoolCard';
import { Search, Car, ShoppingBag, Home } from 'lucide-react';

interface DataGridProps {
  rows: SheetRow[];
  mapping: FieldMapping;
  onItemClick: (row: SheetRow) => void;
  cardType: CardType;
}

const DataGrid: React.FC<DataGridProps> = ({ rows, mapping, onItemClick, cardType }) => {
  
  const renderCard = (row: SheetRow, index: number) => {
      switch (cardType) {
          case 'student':
              return <StudentCard key={index} row={row} mapping={mapping} onClick={() => onItemClick(row)} />;
          case 'sale':
              return <MerchSaleCard key={index} row={row} mapping={mapping} onClick={() => onItemClick(row)} />;
          case 'wanted':
              return <MerchWantedCard key={index} row={row} mapping={mapping} onClick={() => onItemClick(row)} />;
          case 'carpool':
              // We detect if it's a request based on missing capacity field (heuristic) or we could pass a prop.
              // Simpler: Just check if capacityField exists and has value.
              const isRequest = !mapping.capacityField || !row[mapping.capacityField];
              return <CarpoolCard key={index} row={row} mapping={mapping} onClick={() => onItemClick(row)} isRequest={isRequest} />;
          case 'lease':
          default:
              return <LeaseCard key={index} row={row} mapping={mapping} onClick={() => onItemClick(row)} />;
      }
  };

  const getEmptyStateConfig = () => {
      if (cardType === 'carpool') return { icon: Car, text: "No rides found right now." };
      if (cardType === 'sale' || cardType === 'wanted') return { icon: ShoppingBag, text: "No marketplace items found." };
      return { icon: Home, text: "No listings found matching your filters." };
  };

  const emptyConfig = getEmptyStateConfig();
  const EmptyIcon = emptyConfig.icon;

  return (
    <div className="w-full">
      {/* Grid */}
      {rows.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-8">
          {rows.map((row, index) => renderCard(row, index))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
                <EmptyIcon size={32} className="text-slate-400" />
            </div>
            <p className="text-lg font-semibold text-slate-700">{emptyConfig.text}</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting filters or check back later.</p>
        </div>
      )}
    </div>
  );
};

export default DataGrid;
