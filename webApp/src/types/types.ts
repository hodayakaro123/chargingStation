export interface User {
    firstName: string;
    lastName: string;
    picture: string;
    email: string;
}
    


export interface Comment {
    text: string;
}


export interface Charger {
    location?: string;
    latitude?: number;
    longitude?: number;
    price: number;
    rating?: number;
    chargingRate?: number;
    picture?: string;
    description?: string;
    comments: Comment[];
    userId: string;
    _id: string;
    chargerId: string;
}
  
  export interface Booking {
    _id: string;
    Date: string;
    StartTime: string;
    EndTime: string;
    Location: string;
    Status: string;
    Message: string;
    contactNumber: string;
    chargerId: string;
    chargerPicture?: string; 
    userId: string;
}
  