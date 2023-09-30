import {
  Cart,
  Category,
  Order,
  Product,
  SavedItem,
  SimpleSingleStore,
  Store,
  SubCategory,
  TeamMember,
  User,
} from "./Types";

type ResponseStatus = "success" | "failed";
export interface DefaultResponse {
  data: {
    status: ResponseStatus;
    response_code: number;
    message: string;
  };
}
export interface LoginResponse {
  data: {
    token: string;
    status: ResponseStatus;
    response_code: number;
    message: string;
    data: User;
  };
}
export interface GetProductsResponse {
  data: {
    token: string;
    status: ResponseStatus;
    response_code: number;
    message: string;
    data: Product[];
    counts: number;
    totalPages: number;
    currentPage: number;
    listPerPage: string;
  };
}
export interface GetStoreListResponse {
  data: {
    token: string;
    status: ResponseStatus;
    response_code: number;
    message: string;
    data: Store[];
    counts: number;
    totalPages: number;
    currentPage: number;
    listPerPage: string;
  };
}
export interface GetSingleStoreResponse {
  data: {
    status: ResponseStatus;
    response_code: number;
    message: string;
    data: SimpleSingleStore;
  };
}
export interface GetUserStoreResponse {
  data: {
    status: ResponseStatus;
    response_code: number;
    message: string;
    data: Store;
  };
}
export interface GetCategoriesResponse {
  data: {
    token: string;
    status: ResponseStatus;
    response_code: number;
    message: string;
    data: Category[];
  };
}
export interface GetSubCategoriesResponse {
  data: {
    token: string;
    status: ResponseStatus;
    response_code: number;
    message: string;
    data: SubCategory[];
  };
}
export interface UploadFileResponse {
  data: {
    status: ResponseStatus;
    response_code: number;
    message: string;
    file_url: string;
  };
}
export interface CreateProductResponse {
  data: {
    status: ResponseStatus;
    response_code: number;
    message: string;
  };
}

export interface GetOrdersResponse {
  data: {
    status: ResponseStatus;
    response_code: number;
    message: string;
    data: Order[];
    volume: number;
    counts: number;
    totalPages: number;
    currentPage: number;
    listPerPage: number;
  };
}
export interface GetTeamResponse {
  data: {
    status: ResponseStatus;
    response_code: number;
    message: string;
    data: TeamMember[];
    counts: number;
    totalPages: number;
    currentPage: number;
    listPerPage: number;
  };
}
export interface GetCartResponse {
  data: {
    status: ResponseStatus;
    response_code: number;
    message: string;
    data: Cart;
  };
}

export interface GetSavedItemsResponse {
  data: {
    token: string;
    status: ResponseStatus;
    response_code: number;
    message: string;
    data: SavedItem[];
    counts: number;
    totalPages: number;
    currentPage: number;
    listPerPage: string;
  };
}
export interface CheckoutResponse {
  data: {
    status: ResponseStatus;
    response_code: number;
    message: string;
    reference_code: string;
  };
}
