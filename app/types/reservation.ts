export interface TimeSlot {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  price: string;
  isOpen: boolean;
}

export interface Reservation {
  id: string;
  userId: string;
  fieldId: string;
  fieldName: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  price: string;
  status: "confirmed" | "cancelled";
  createdAt: string;
}

export interface Field {
  id: string;
  name: string;
  address: string;
  city: string;
  sportType: string;
  description: string;
  images: string[];
  schedule: TimeSlot[];
}
