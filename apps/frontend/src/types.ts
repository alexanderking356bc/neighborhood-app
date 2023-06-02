export interface LoginData {
  username: string,
  password: string
};

export interface StorageWithUser extends Storage {
  user?: string
};

export interface UserInfo {
  username: string,
  token: string
};