export interface Address {
  _id: string;
  details: string;
  phone: string;
  city: string;
}

export interface AddressResponse {
  status: string;
  data: Address[];
  results: number;
}

export interface CreateAddressRequest {
  details: string;
  phone: string;
  city: string;
}

export interface CreateAddressResponse {
  status: string;
  data: Address;
}


