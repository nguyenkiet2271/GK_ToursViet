export interface Tour {
    id: string;
    name: string;
    city: string;
    days: number;
    price: number;
    seats: number;
    departure: string;
    image: string;
    isFavorite: boolean;
  }
  
  export const groupByCity = (tours: Tour[]) => {
    if (!tours || !Array.isArray(tours)) return [];
  
    const groups: { [key: string]: Tour[] } = {};
    tours.forEach((tour) => {
      const city = tour.city || 'Khác';
      if (!groups[city]) {
        groups[city] = [];
      }
      groups[city].push(tour);
    });
  
    const sortedCities = Object.keys(groups).sort((a, b) => a.localeCompare(b, 'vi'));
  
    return sortedCities.map((city) => {
      const sortedData = groups[city].sort((a, b) =>
        (a.departure || '').localeCompare(b.departure || '')
      );
      return {
        title: `${city} · ${sortedData.length} tour`,
        data: sortedData,
      };
    });
  };

  export const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };
  
  export const getSeatLabel = (seats: number) => {
    if (seats === 0) return 'Hết chỗ';
    if (seats >= 1 && seats <= 3) return `Chỉ còn ${seats} chỗ`;
    return `Còn ${seats} chỗ`;
  };