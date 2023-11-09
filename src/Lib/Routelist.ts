import StoreIcon from "@mui/icons-material/Storefront";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CartIcon from "@mui/icons-material/LocalGroceryStore";
import OrdersIcon from "@mui/icons-material/ContentPaste";
import ProfileIcon from "@mui/icons-material/AccountCircle";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
const RouteList = [
  { label: "Stores", route: "stores", icon: StoreIcon },
  { label: "Saved Items", route: "saved", icon: FavoriteIcon },
  { label: "Cart", route: "cart", icon: CartIcon },
  { label: "Orders", route: "orders", icon: OrdersIcon },
  { label: "My Profile", route: "profile", icon: ProfileIcon },
  { label: "Wallet", route: "wallet", icon: WalletIcon },
];
export { RouteList };
