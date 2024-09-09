import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import MyPage from "./src/MyPage"

const queryClient = new QueryClient();

export const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <MyPage />
      </ChakraProvider>
    </QueryClientProvider>)
}
