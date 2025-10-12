export interface Address {
  _id: string;
  alias: string;
  details: string;
  phone: string;
  city: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AddressResponse {
  status: string;
  data: Address[];
  results: number;
}

export interface CreateAddressRequest {
  alias: string;
  details: string;
  phone: string;
  city: string;
  postalCode: string;
}

export interface CreateAddressResponse {
  status: string;
  data: Address;
}


