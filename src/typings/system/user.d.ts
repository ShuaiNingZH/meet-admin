declare namespace User {
  interface Item {
    id: number;
    username: string;
    password?: string;
    nickname: string;
    phone: string;
    avatar: string;
    email: string;
    gender: 0 | 1 | 2;
    roleIds: number[];
    status: boolean;
    remark: string;
  }

  interface CurrentUser {
    userId: number;
    nickname: string;
    phone: string;
    email: string | null;
    avatar: string;
    buttons: string[];
  }
}
