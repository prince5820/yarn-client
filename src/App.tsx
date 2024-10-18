import { BrowserRouter, Route, Routes } from "react-router-dom"
import './assets/css/alignment.css'
import './assets/css/font.css'
import './assets/css/footer.css'
import './assets/css/main.css'
import './assets/css/mui-custom.css'
import NotFound from "./common/components/404-not-found/404-not-found"
import Loader from "./common/components/global-loader/loader"
import SnackbarAlert from "./common/components/snackbar/snackbar"
import { PATH_TO_ADD_AUTO_PAY, PATH_TO_ADD_CONTACT, PATH_TO_ADD_PAYMENT, PATH_TO_AUTO_PAY, PATH_TO_AUTO_PAY_SUMMARY, PATH_TO_CATEGORIES, PATH_TO_CHAT, PATH_TO_CHAT_HISTORY, PATH_TO_CHAT_SUMMARY, PATH_TO_CHAT_TRANSACTION, PATH_TO_CONTACT, PATH_TO_CONTACT_SUMMARY, PATH_TO_EDIT_AUTO_PAY, PATH_TO_EDIT_CONTACT, PATH_TO_EDIT_PAYMENT, PATH_TO_FORGET_PASSWORD, PATH_TO_PAYMENT, PATH_TO_PAYMENT_ANALYZE, PATH_TO_PAYMENT_SUMMARY, PATH_TO_PROFILE, PATH_TO_ROOT_ROUTE, PATH_TO_SCAN, PATH_TO_SCANNED_SUMMARY, PATH_TO_SETTINGS, PATH_TO_SIGN_IN, PATH_TO_SIGN_UP, PATH_TO_TRANSACTION_SUMMARY } from "./common/constants"
import { AuthGuard } from "./guards/auth-guard/auth-guard"
import AddAutoPay from "./pages/auto-pay/add-auto-pay"
import AutoPay from "./pages/auto-pay/auto-pay"
import AutoPaySummary from "./pages/auto-pay/auto-pay-summary"
import Category from "./pages/category/category"
import Chat from "./pages/chat/chat"
import ChatHistoryDownload from "./pages/chat/chat-history-download"
import ChatSummary from "./pages/chat/chat-summary"
import ChatTransaction from "./pages/chat/chat-transaction"
import TransactionSummary from "./pages/chat/transaction-summary"
import AddContact from "./pages/contact/add-contact"
import Contact from "./pages/contact/contact"
import ContactSummary from "./pages/contact/contact-summary"
import Footer from "./pages/footer/footer"
import ForgetPassword from "./pages/forget-password/forget-password"
import AddPayment from "./pages/payment/add-payment"
import Payment from "./pages/payment/payment"
import PaymentAnalyze from "./pages/payment/payment-analyze"
import PaymentSummary from "./pages/payment/payment-summary"
import Profile from "./pages/profile/profile"
import Scan from "./pages/Scan/scan"
import ScannedSummary from "./pages/Scan/scanned-summary"
import Settings from "./pages/settings/settings"
import SignIn from "./pages/sign-in/sign-in"
import SignUp from "./pages/sign-up/sign-up"

function App() {

  return (
    <BrowserRouter>
      <Loader />
      <SnackbarAlert />
      <Footer />
      <Routes>

        {/* Auth Routes */}

        <Route path={PATH_TO_ROOT_ROUTE} element={<SignIn />} />
        <Route path={PATH_TO_SIGN_IN} element={<SignIn />} />
        <Route path={PATH_TO_FORGET_PASSWORD} element={<ForgetPassword />} />
        <Route path={PATH_TO_SIGN_UP} element={<SignUp />} />

        {/* Other Routes */}

        <Route path={PATH_TO_CHAT} element={<AuthGuard component={<Chat />} />} />
        <Route path={PATH_TO_SETTINGS} element={<AuthGuard component={<Settings />} />} />
        <Route path={PATH_TO_PROFILE} element={<AuthGuard component={<Profile />} />} />
        <Route path={PATH_TO_CATEGORIES} element={<AuthGuard component={<Category />} />} />
        <Route path={PATH_TO_PAYMENT} element={<AuthGuard component={<Payment />} />} />
        <Route path={PATH_TO_PAYMENT_SUMMARY} element={<AuthGuard component={<PaymentSummary />} />} />
        <Route path={PATH_TO_ADD_PAYMENT} element={<AuthGuard component={<AddPayment />} />} />
        <Route path={PATH_TO_EDIT_PAYMENT} element={<AuthGuard component={<AddPayment />} />} />
        <Route path={PATH_TO_CONTACT} element={<AuthGuard component={<Contact />} />} />
        <Route path={PATH_TO_ADD_CONTACT} element={<AuthGuard component={<AddContact />} />} />
        <Route path={PATH_TO_CONTACT_SUMMARY} element={<AuthGuard component={<ContactSummary />} />} />
        <Route path={PATH_TO_EDIT_CONTACT} element={<AuthGuard component={<AddContact />} />} />
        <Route path={PATH_TO_CHAT_SUMMARY} element={<AuthGuard component={<ChatSummary />} />} />
        <Route path={PATH_TO_PAYMENT_ANALYZE} element={<AuthGuard component={<PaymentAnalyze />} />} />
        <Route path={PATH_TO_CHAT_HISTORY} element={<AuthGuard component={<ChatHistoryDownload />} />} />
        <Route path={PATH_TO_CHAT_TRANSACTION} element={<AuthGuard component={<ChatTransaction />} />} />
        <Route path={PATH_TO_TRANSACTION_SUMMARY} element={<AuthGuard component={<TransactionSummary />} />} />
        <Route path={PATH_TO_SCAN} element={<AuthGuard component={<Scan />} />} />
        <Route path={PATH_TO_SCANNED_SUMMARY} element={<AuthGuard component={<ScannedSummary />} />} />
        <Route path={PATH_TO_AUTO_PAY} element={<AuthGuard component={<AutoPay />} />} />
        <Route path={PATH_TO_ADD_AUTO_PAY} element={<AuthGuard component={<AddAutoPay />} />} />
        <Route path={`${PATH_TO_AUTO_PAY_SUMMARY}/:paymentId`} element={<AuthGuard component={<AutoPaySummary />} />} />
        <Route path={`${PATH_TO_EDIT_AUTO_PAY}/:paymentId`} element={<AuthGuard component={<AddAutoPay />} />} />
        <Route path='*' element={<AuthGuard component={<NotFound />} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
